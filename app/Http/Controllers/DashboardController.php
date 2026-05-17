<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Subject;
use App\Models\Extra;
use App\Models\AcademicGrade;
use App\Models\TalentGrade;
use App\Models\Schedule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /**
     * Halaman Utama Dashboard (Pengatur Lalu Lintas)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role === 'guru') {
            return $this->teacherDashboard($user, $request);
        } 
        elseif ($user->role === 'pembina') {
            return $this->coachDashboard($user); 
        }
        elseif ($user->role === 'admin') {
            return $this->adminDashboard($user); 
        }

        // Default: Siswa
        return $this->studentDashboard($user);
    }

    // ==========================================
    // 1. LOGIKA ADMIN
    // ==========================================
    private function adminDashboard($user)
    {
        // Fix N+1 Query: Pre-load subjects & extras, keyed by teacher_id/coach_id
        $subjectsByTeacher = Subject::whereNotNull('teacher_id')->get()->keyBy('teacher_id');
        $extrasByCoach = Extra::whereNotNull('coach_id')->get()->keyBy('coach_id');

        $users = User::orderBy('created_at', 'desc')->get()->map(function($u) use ($subjectsByTeacher, $extrasByCoach) {
            $subject = $subjectsByTeacher->get($u->id);
            $extra   = $extrasByCoach->get($u->id);

            return [
                'id'          => $u->id,
                'name'        => $u->name,
                'email'       => $u->email,
                'role'        => $u->role,
                'nomor_induk' => $u->nomor_induk,
                'kelas'       => $u->kelas,
                'mapel_ajar'  => $subject ? $subject->nama_mapel : '-',
                'ekskul_bina' => $extra ? $extra->nama_ekskul : '-',
                'subject_id'  => $subject ? $subject->id : '',
                'extra_id'    => $extra ? $extra->id : '',
            ];
        });

        $stats = [
            'total_user' => $users->count(),
            'guru'       => $users->where('role', 'guru')->count(),
            'siswa'      => $users->where('role', 'siswa')->count(),
            'pembina'    => $users->where('role', 'pembina')->count(),
        ];

        // Ambil semua jadwal untuk admin
        $schedules = Schedule::with(['subject', 'extra', 'instructor'])->orderBy('day')->orderBy('start_time')->get();

        return Inertia::render('Dashboard/Admin', [
            'auth'      => ['user' => $user],
            'users'     => $users,
            'subjects'  => Subject::all(),
            'extras'    => Extra::all(),
            'stats'     => $stats,
            'schedules' => $schedules
        ]);
    }

    public function saveUser(Request $request)
    {
        // [SECURITY] Hanya admin yang boleh menyimpan data user
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola pengguna.');
        }

        $rules = [
            'name'        => 'required|string|max:255',
            'email'       => ['required', 'email', Rule::unique('users')->ignore($request->id)],
            'role'        => 'required|in:admin,guru,pembina,siswa',
            'nomor_induk' => 'nullable|string',
        ];

        if (!$request->id) {
            $rules['password'] = 'required|min:6';
        }

        $request->validate($rules);

        $userData = [
            'name'        => $request->name,
            'email'       => $request->email,
            'role'        => $request->role,
            'nomor_induk' => $request->nomor_induk,
            'kelas'       => ($request->role === 'siswa') ? $request->kelas : null,
        ];

        if ($request->filled('password')) {
            $userData['password'] = bcrypt($request->password);
        }

        $user = User::updateOrCreate(['id' => $request->id], $userData);

        // Update Assignment
        Subject::where('teacher_id', $user->id)->update(['teacher_id' => null]);
        Extra::where('coach_id', $user->id)->update(['coach_id' => null]);

        if ($user->role === 'guru' && $request->subject_id) {
            Subject::where('id', $request->subject_id)->update(['teacher_id' => $user->id]);
        }
        elseif ($user->role === 'pembina' && $request->extra_id) {
            Extra::where('id', $request->extra_id)->update(['coach_id' => $user->id]);
        }

        return redirect()->back()->with('success', 'Data pengguna berhasil disimpan!');
    }

    public function deleteUser($id)
    {
        // [SECURITY] Hanya admin yang boleh menghapus user
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak. Hanya admin yang dapat menghapus pengguna.');
        }

        if ($id == Auth::id()) return redirect()->back()->with('error', 'Tidak bisa hapus akun sendiri!');
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }

    // --- ADMIN: SCHEDULE MANAGEMENT (YANG TADINYA HILANG/KURANG) ---
    public function saveSchedule(Request $request)
    {
        // [SECURITY] Hanya admin yang boleh mengelola jadwal
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak. Hanya admin yang dapat mengelola jadwal.');
        }

        // 1. Validasi Input
        $rules = [
            'day'           => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat',
            'start_time'    => 'required|date_format:H:i',
            'end_time'      => 'required|date_format:H:i|after:start_time',
            'type'          => 'required|in:mapel,ekskul',
            'class_name'    => 'required|string',
            'instructor_id' => 'required|exists:users,id',
        ];

        // Validasi conditional: Mapel butuh subject_id, Ekskul butuh extra_id
        if ($request->type === 'mapel') {
            $rules['subject_id'] = 'required|exists:subjects,id';
        } else {
            $rules['extra_id'] = 'required|exists:extras,id';
        }

        $request->validate($rules);

        // 2. Simpan ke Database
        Schedule::updateOrCreate(
            ['id' => $request->id],
            [
                'day'           => $request->day,
                'start_time'    => $request->start_time,
                'end_time'      => $request->end_time,
                'type'          => $request->type,
                'subject_id'    => $request->type === 'mapel' ? $request->subject_id : null,
                'extra_id'      => $request->type === 'ekskul' ? $request->extra_id : null,
                'class_name'    => $request->class_name,
                'instructor_id' => $request->instructor_id,
            ]
        );

        return redirect()->back()->with('success', 'Jadwal berhasil disimpan!');
    }

    public function deleteSchedule($id)
    {
        // [SECURITY] Hanya admin yang boleh menghapus jadwal
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak. Hanya admin yang dapat menghapus jadwal.');
        }

        Schedule::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }

    // ==========================================
    // 2. LOGIKA PEMBINA (COACH)
    // ==========================================
    private function coachDashboard($user)
    {
        $myExtra = Extra::where('coach_id', $user->id)->first();
        $students = [];
        $availableStudents = [];
        $stats = ['total' => 0, 'avg' => 0, 'top' => '-'];

        if ($myExtra) {
            $grades = TalentGrade::with('student')->where('extra_id', $myExtra->id)->get();
            
            $students = $grades->map(function($g) {
                return [
                    'id' => $g->student->id, 'name' => $g->student->name, 'kelas' => $g->student->kelas,
                    'nomor_induk' => $g->student->nomor_induk, 'nilai_teknis' => $g->nilai_teknis,
                    'observasi' => $g->observasi_bakat, 'rekomendasi' => $g->rekomendasi
                ];
            });

            $existingIds = $grades->pluck('student_id');
            $availableStudents = User::where('role', 'siswa')
                ->whereNotIn('id', $existingIds)
                ->select('id', 'name', 'kelas', 'nomor_induk')->orderBy('kelas')->get();

            if ($students->count() > 0) {
                $stats['total'] = $students->count();
                $stats['avg'] = round($students->avg('nilai_teknis'));
                $stats['top'] = $students->sortByDesc('nilai_teknis')->first()['name'];
            }
        }

        // Ambil Jadwal Mengajar untuk Pembina ini
        $mySchedules = Schedule::where('instructor_id', $user->id)->orderBy('day')->get();

        return Inertia::render('Dashboard/Coach', [
            'auth' => ['user' => $user], 'extra' => $myExtra,
            'students' => $students, 'availableStudents' => $availableStudents, 'stats' => $stats,
            'schedules' => $mySchedules
        ]);
    }

    public function updateTalent(Request $request)
    {
        // [SECURITY] Hanya pembina yang boleh update nilai ekskul
        if (Auth::user()->role !== 'pembina') {
            abort(403, 'Akses ditolak. Hanya pembina yang dapat memperbarui nilai bakat.');
        }

        $val = $request->validate([
            'student_id'  => 'required|exists:users,id', 'extra_id' => 'required|exists:extras,id',
            'nilai_teknis' => 'required|numeric|min:0|max:100', 'observasi' => 'nullable', 'rekomendasi' => 'nullable'
        ]);
        
        TalentGrade::updateOrCreate(
            ['student_id' => $val['student_id'], 'extra_id' => $val['extra_id']],
            ['nilai_teknis' => $val['nilai_teknis'], 'observasi_bakat' => $val['observasi'], 'rekomendasi' => $val['rekomendasi']]
        );
        return redirect()->back()->with('success', 'Data tersimpan!');
    }

    public function removeStudentFromTalent($studentId)
    {
        $user = Auth::user();
        
        if ($user->role !== 'pembina') {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $myExtra = Extra::where('coach_id', $user->id)->first();

        if ($myExtra) {
            $deleted = TalentGrade::where('student_id', $studentId)
                ->where('extra_id', $myExtra->id)
                ->delete();
            
            if ($deleted) {
                return redirect()->back()->with('success', 'Siswa berhasil dikeluarkan dari ekskul.');
            }
        }

        return redirect()->back()->with('error', 'Gagal menghapus siswa.');
    }

    // ==========================================
    // 3. LOGIKA GURU (TEACHER)
    // ==========================================
    private function teacherDashboard($user, $request)
    {
        $mySubjects = Subject::where('teacher_id', $user->id)->get();
        $classList = User::where('role', 'siswa')->select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        $selectedClass = $request->input('kelas', $classList->first());
        $selectedSubjectId = $request->input('subject_id', $mySubjects->first()->id ?? null);

        $students = [];
        if ($selectedClass && $selectedSubjectId) {
            $students = User::where('role', 'siswa')->where('kelas', $selectedClass)
                ->with(['academicGrades' => function($query) use ($selectedSubjectId) {
                    $query->where('subject_id', $selectedSubjectId);
                }])->get()->map(function ($student) use ($selectedSubjectId) {
                    $grade = $student->academicGrades->first();
                    return [
                        'id' => $student->id, 'name' => $student->name, 'nis' => $student->nomor_induk,
                        'uts' => $grade->uts ?? 0, 'uas' => $grade->uas ?? 0, 'catatan' => $grade->catatan_guru ?? '',
                        'subject_id' => $selectedSubjectId
                    ];
                });
        }

        // Ambil Jadwal Mengajar untuk Guru ini
        $mySchedules = Schedule::where('instructor_id', $user->id)
            ->with(['subject'])
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Dashboard/Teacher', [
            'auth' => ['user' => $user], 'subjects' => $mySubjects, 'classes' => $classList,
            'students' => $students, 
            'filters' => ['kelas' => $selectedClass, 'subject_id' => $selectedSubjectId],
            'homeroom' => 'XII MIPA 1',
            'schedules' => $mySchedules
        ]);
    }

    public function updateGrade(Request $request)
    {
        // [SECURITY] Hanya guru yang boleh update nilai akademik
        if (Auth::user()->role !== 'guru') {
            abort(403, 'Akses ditolak. Hanya guru yang dapat memperbarui nilai akademik.');
        }

        $val = $request->validate([
            'student_id' => 'required', 'subject_id' => 'required',
            'uts' => 'required|numeric|min:0|max:100', 'uas' => 'required|numeric|min:0|max:100', 'catatan' => 'nullable'
        ]);
        
        AcademicGrade::updateOrCreate(
            ['student_id' => $val['student_id'], 'subject_id' => $val['subject_id']],
            ['uts' => $val['uts'], 'uas' => $val['uas'], 'catatan_guru' => $val['catatan']]
        );
        return redirect()->back()->with('success', 'Nilai tersimpan!');
    }

    // ==========================================
    // 4. LOGIKA SISWA (STUDENT)
    // ==========================================
    private function studentDashboard($user)
    {
        $academics = AcademicGrade::with('subject')->where('student_id', $user->id)->get()->map(function ($grade) {
            return [
                'mapel' => $grade->subject->nama_mapel, 'uts' => $grade->uts, 'uas' => $grade->uas,
                'nilai' => round(($grade->uts + $grade->uas) / 2), 'catatan' => $grade->catatan_guru ?? '-'
            ];
        });

        $talents = TalentGrade::with('extra')->where('student_id', $user->id)->get()->map(function ($grade) {
            $predikat = $grade->nilai_teknis >= 90 ? 'Sangat Berbakat' : 'Kompeten';
            return [
                'ekskul' => $grade->extra->nama_ekskul, 'nilai_teknis' => $grade->nilai_teknis,
                'predikat' => $predikat, 'observasi' => $grade->observasi_bakat ?? '-'
            ];
        });

        $analysis = ['jurusan' => 'Belum Cukup Data', 'alasan' => 'Hubungi guru.'];
        if ($academics->isNotEmpty()) {
            $best = $academics->sortByDesc('nilai')->first();
            if ($best['nilai'] >= 80) {
                $analysis['jurusan'] = 'Potensi di ' . $best['mapel'];
                $analysis['alasan'] = 'Nilai tertinggi: ' . $best['nilai'];
            }
        }

        $schedules = Schedule::with(['subject', 'extra', 'instructor'])
            ->where(function($query) use ($user) {
                $query->where('class_name', $user->kelas)
                      ->orWhere('class_name', 'SEMUA KELAS');
            })
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Dashboard/Student', [
            'auth' => ['user' => $user], 
            'academics' => $academics, 
            'talents' => $talents, 
            'analysis' => $analysis,
            'schedules' => $schedules
        ]);
    }

    public function aiCareer(Request $request)
    {
        $user = Auth::user();

        // [SECURITY] Hanya siswa yang boleh akses
        if ($user->role !== 'siswa') {
            return redirect()->route('dashboard')->with('error', 'Akses khusus siswa.');
        }

        // [CACHE] Cek cache per siswa selama 24 jam
        $cacheKey = "ai_career_result_{$user->id}";

        // 1. Ambil Data Akademik Siswa
        $academics = AcademicGrade::with('subject')->where('student_id', $user->id)->get()->map(function ($grade) {
            return [
                'mapel'        => $grade->subject->nama_mapel,
                'uts'          => $grade->uts,
                'uas'          => $grade->uas,
                'nilai_akhir'  => round(($grade->uts + $grade->uas) / 2),
                'catatan_guru' => $grade->catatan_guru ?? '-'
            ];
        });

        // 2. Ambil Data Bakat/Ekskul Siswa (termasuk rekomendasi pembina)
        $talents = TalentGrade::with('extra')->where('student_id', $user->id)->get()->map(function ($grade) {
            return [
                'ekskul'      => $grade->extra->nama_ekskul,
                'nilai_teknis' => $grade->nilai_teknis,
                'observasi'   => $grade->observasi_bakat ?? '-',
                'rekomendasi' => $grade->rekomendasi ?? '-'
            ];
        });

        // 3. Deteksi Jurusan dari nama kelas secara eksplisit
        $kelasNama = $user->kelas ?? 'Tidak Diketahui';
        $jurusan = 'Umum';
        if (stripos($kelasNama, 'MIPA') !== false || stripos($kelasNama, 'IPA') !== false) {
            $jurusan = 'MIPA/IPA (Sains)';
        } elseif (stripos($kelasNama, 'IPS') !== false || stripos($kelasNama, 'Sosial') !== false) {
            $jurusan = 'IPS (Ilmu Sosial)';
        }

        // 4. Tentukan mapel lintas jurusan (MIPA ambil IPS atau sebaliknya)
        $mapeIps  = ['Geografi', 'Sosiologi', 'Ekonomi', 'Sejarah'];
        $mapelMipa = ['Matematika Peminatan', 'Fisika', 'Biologi', 'Kimia'];
        $lintasJurusan = [];
        foreach ($academics as $ak) {
            if ($jurusan === 'MIPA/IPA (Sains)' && in_array($ak['mapel'], $mapeIps)) {
                $lintasJurusan[] = $ak['mapel'] . ' (nilai: ' . $ak['nilai_akhir'] . ')';
            } elseif ($jurusan === 'IPS (Ilmu Sosial)' && in_array($ak['mapel'], $mapelMipa)) {
                $lintasJurusan[] = $ak['mapel'] . ' (nilai: ' . $ak['nilai_akhir'] . ')';
            }
        }
        $lintasInfo = count($lintasJurusan) > 0
            ? implode(', ', $lintasJurusan)
            : 'Tidak ada lintas jurusan yang terdeteksi.';

        $apiKey = env('GEMINI_API_KEY');

        // Fallback mock data
        $mockData = [
            'radarData' => [
                ['subject' => 'Logika & Sains',      'A' => 75, 'fullMark' => 100],
                ['subject' => 'Kreativitas',          'A' => 70, 'fullMark' => 100],
                ['subject' => 'Fisik & Olahraga',    'A' => 65, 'fullMark' => 100],
                ['subject' => 'Sosial & Empati',      'A' => 70, 'fullMark' => 100],
                ['subject' => 'Bahasa & Komunikasi', 'A' => 72, 'fullMark' => 100],
            ],
            'matches'  => [
                ['role' => 'Perlu Data Lengkap', 'match' => 0, 'type' => 'Safe Option'],
                ['role' => 'API Belum Aktif',    'match' => 0, 'type' => 'Dream Option'],
                ['role' => 'Hubungi Admin',       'match' => 0, 'type' => 'Future Option']
            ],
            'skillTree' => [
                ['name' => 'Akademik Umum',  'level' => 70, 'status' => 'In Progress'],
                ['name' => 'Soft Skills',    'level' => 60, 'status' => 'In Progress'],
                ['name' => 'Hard Skills',    'level' => 40, 'status' => 'Locked'],
                ['name' => 'Leadership',     'level' => 50, 'status' => 'In Progress'],
                ['name' => 'Digital Skills', 'level' => 30, 'status' => 'Locked']
            ],
            'roadmap' => [
                ['year' => '2024', 'title' => 'Sedang Berjalan', 'desc' => 'Fokus nilai akademik'],
                ['year' => '2026', 'title' => 'Kuliah',          'desc' => 'Pilih jurusan sesuai minat'],
                ['year' => '2030', 'title' => 'Karir Awal',      'desc' => 'Mulai karir pertama'],
                ['year' => '2034', 'title' => 'Karir Senior',    'desc' => 'Posisi profesional']
            ],
            'crossMajorAnalysis' => 'Data lintas jurusan akan tampil setelah AI aktif.',
            'gapAnalysis'        => 'Gap analysis akan tersedia setelah koneksi AI berhasil.',
            'aiSummary'          => 'Maaf, AI sedang tidak dapat dihubungi. Data ini adalah simulasi. Silakan coba lagi nanti.'
        ];

        if (!$apiKey) {
            return Inertia::render('Dashboard/AiCareer', [
                'auth'     => ['user' => $user],
                'aiResult' => $mockData
            ]);
        }

        // [CACHE HIT] Kembalikan data cache jika ada
        if (Cache::has($cacheKey) && !$request->has('refresh')) {
            return Inertia::render('Dashboard/AiCareer', [
                'auth'     => ['user' => $user],
                'aiResult' => Cache::get($cacheKey)
            ]);
        }

        // 5. Bangun Prompt Super-Lengkap untuk Gemini AI
        $akademikJson = json_encode($academics->values(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $bakat        = json_encode($talents->values(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $prompt = <<<PROMPT
Bertindaklah sebagai Konsultan Karier AI Senior dan Pakar Pendidikan Indonesia.
Analisis profil siswa berikut ini secara MENDALAM dan PERSONAL:

=== DATA IDENTITAS SISWA ===
- Nama Lengkap  : {$user->name}
- Nomor Induk   : {$user->nomor_induk}
- Kelas         : {$kelasNama}
- Jurusan       : {$jurusan}

=== DATA AKADEMIK (12 Mata Pelajaran) ===
{$akademikJson}

=== DATA BAKAT & EKSTRAKURIKULER ===
{$bakat}

=== MATA PELAJARAN LINTAS JURUSAN YANG TERDETEKSI ===
{$lintasInfo}

=== INSTRUKSI ANALISIS WAJIB ===
1. PEMBOBOTAN:
   - 40% bobot dari rata-rata nilai akademik (terutama mapel peminatan jurusan)
   - 40% bobot dari nilai_teknis ekskul dan observasi pembina
   - 20% bobot dari catatan_guru (pola kepribadian siswa)

2. ANALISIS LINTAS JURUSAN:
   Gunakan data "MATA PELAJARAN LINTAS JURUSAN" di atas. Jika nilai lintas jurusan tinggi (>80), pertimbangkan karier di bidang Hybrid seperti Fintech, Data Science, atau Komunikasi Sains.

3. GAP ANALYSIS:
   Sebutkan 2-3 skill SPESIFIK (contoh: Python, Statistik, Public Speaking) yang belum terlihat di data siswa namun SANGAT DIBUTUHKAN untuk mencapai karier yang kamu rekomendasikan.

4. REKOMENDASI KULIAH:
   Berikan TEPAT 3 opsi:
   - Safe Option : jurusan yang realistis dicapai dengan nilai saat ini
   - Dream Option: jurusan ideal sesuai bakat terkuat
   - Future Option: jurusan yang akan sangat relevan di masa depan (5-10 tahun)
   WAJIB: Sertakan nama UNIVERSITAS RIIL yang benar-benar ada di Indonesia (contoh: UI, ITB, UGM, UNAIR, ITS, UNDIP, BINUS, UNPAD, dll.). DILARANG mengarang nama universitas fiktif.

5. RADAR DATA:
   Hitung skor 0-100 untuk 5 dimensi berdasarkan data nyata siswa:
   - Logika & Sains    : dari nilai Matematika, Fisika, Kimia, Biologi
   - Kreativitas        : dari nilai Seni, data ekskul kreatif (Tari, Paduan Suara)
   - Fisik & Olahraga  : dari nilai PJOK dan ekskul olahraga (Basket, Futsal, Voli)
   - Sosial & Empati   : dari nilai PKn, Sosiologi, ekskul sosial (PMR, Rohis, Pramuka)
   - Bahasa & Komunikasi: dari nilai Bahasa Indonesia, Bahasa Inggris, English Club

6. SKILL TREE:
   Buat 5 skill yang RELEVAN dengan karier yang kamu rekomendasikan. Status:
   - "Mastered"     : skill yang tercermin sudah baik dari data (nilai/ekskul tinggi)
   - "In Progress"  : skill yang ada petunjuknya tapi masih perlu dikembangkan
   - "Locked"       : skill yang belum sama sekali terlihat di data siswa

7. ROADMAP:
   Buat 4 milestone realistis sesuai tahun saat ini (2024-2035), spesifik untuk siswa ini.

8. GAYA BAHASA:
   Gunakan nada memotivasi, inspiratif, dan REALISTIS. Jangan berlebihan.
   aiSummary harus menyebut nama siswa dan jurusannya secara eksplisit.

=== FORMAT OUTPUT ===
KEMBALIKAN HANYA JSON MURNI (tanpa markdown, tanpa penjelasan tambahan):
{
  "radarData": [
    {"subject": "Logika & Sains", "A": 0, "fullMark": 100},
    {"subject": "Kreativitas", "A": 0, "fullMark": 100},
    {"subject": "Fisik & Olahraga", "A": 0, "fullMark": 100},
    {"subject": "Sosial & Empati", "A": 0, "fullMark": 100},
    {"subject": "Bahasa & Komunikasi", "A": 0, "fullMark": 100}
  ],
  "matches": [
    {"role": "Nama Profesi Safe", "match": 0, "type": "Safe Option"},
    {"role": "Nama Profesi Dream", "match": 0, "type": "Dream Option"},
    {"role": "Nama Profesi Future", "match": 0, "type": "Future Option"}
  ],
  "skillTree": [
    {"name": "Skill 1", "level": 0, "status": "Mastered"},
    {"name": "Skill 2", "level": 0, "status": "In Progress"},
    {"name": "Skill 3", "level": 0, "status": "Locked"},
    {"name": "Skill 4", "level": 0, "status": "Mastered"},
    {"name": "Skill 5", "level": 0, "status": "In Progress"}
  ],
  "roadmap": [
    {"year": "2024", "title": "Fokus Akademik", "desc": "..."},
    {"year": "2026", "title": "Kuliah di [Nama Univ] - [Jurusan]", "desc": "..."},
    {"year": "2030", "title": "Junior [Nama Profesi]", "desc": "..."},
    {"year": "2034", "title": "Senior [Nama Profesi]", "desc": "..."}
  ],
  "crossMajorAnalysis": "Analisis lintas jurusan spesifik untuk siswa ini...",
  "gapAnalysis": "Gap analysis spesifik dengan menyebut skill konkret yang kurang...",
  "aiSummary": "Paragraf memotivasi yang menyebut nama dan jurusan siswa secara eksplisit..."
}
PROMPT;

        // 6. Eksekusi Request ke Gemini API
        try {
            // FIXED: Gunakan ->asJson() agar Content-Type: application/json terkirim dengan benar
            $response = Http::withoutVerifying()
                ->asJson()
                ->timeout(30)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'topK'        => 40,
                        'topP'        => 0.95,
                    ]
                ]);

            if ($response->successful()) {
                $result = $response->json();
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $jsonString = $result['candidates'][0]['content']['parts'][0]['text'];

                    // Bersihkan markdown block jika ada
                    $jsonString = preg_replace('/```json|```/i', '', $jsonString);
                    $jsonString = trim($jsonString);

                    $aiResultData = json_decode($jsonString, true);

                    if ($aiResultData && is_array($aiResultData)) {
                        // [CACHE] Simpan hasil 24 jam
                        Cache::put($cacheKey, $aiResultData, 86400);

                        return Inertia::render('Dashboard/AiCareer', [
                            'auth'     => ['user' => $user],
                            'aiResult' => $aiResultData
                        ]);
                    }
                }
            }

            Log::error('Gemini API Error: HTTP ' . $response->status() . ' — ' . $response->body());

        } catch (\Exception $e) {
            Log::error('Gemini API Exception: ' . $e->getMessage());
        }

        // 7. Fallback terakhir
        return Inertia::render('Dashboard/AiCareer', [
            'auth'     => ['user' => $user],
            'aiResult' => $mockData
        ]);
    }
}