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
        // Ambil data user
        $users = User::orderBy('created_at', 'desc')->get()->map(function($u) {
            $subject = Subject::where('teacher_id', $u->id)->first();
            $extra = Extra::where('coach_id', $u->id)->first();

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'nomor_induk' => $u->nomor_induk,
                'kelas' => $u->kelas,
                'mapel_ajar' => $subject ? $subject->nama_mapel : '-',
                'ekskul_bina' => $extra ? $extra->nama_ekskul : '-',
                // Data ID untuk form edit
                'subject_id' => $subject ? $subject->id : '',
                'extra_id' => $extra ? $extra->id : '',
            ];
        });

        $stats = [
            'total_user' => $users->count(),
            'guru' => $users->where('role', 'guru')->count(),
            'siswa' => $users->where('role', 'siswa')->count(),
            'pembina' => $users->where('role', 'pembina')->count(),
        ];

        // Ambil semua jadwal untuk admin
        $schedules = Schedule::with(['subject', 'extra', 'instructor'])->orderBy('day')->orderBy('start_time')->get();

        return Inertia::render('Dashboard/Admin', [
            'auth' => ['user' => $user],
            'users' => $users,
            'subjects' => Subject::all(),
            'extras' => Extra::all(),
            'stats' => $stats,
            'schedules' => $schedules
        ]);
    }

    public function saveUser(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($request->id)],
            'role' => 'required|in:admin,guru,pembina,siswa',
            'nomor_induk' => 'nullable|string',
        ];

        if (!$request->id) {
            $rules['password'] = 'required|min:6';
        }

        $request->validate($rules);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'nomor_induk' => $request->nomor_induk,
            'kelas' => ($request->role === 'siswa') ? $request->kelas : null,
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
        if ($id == Auth::id()) return redirect()->back()->with('error', 'Tidak bisa hapus akun sendiri!');
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }

    // --- ADMIN: SCHEDULE MANAGEMENT (YANG TADINYA HILANG/KURANG) ---
    public function saveSchedule(Request $request)
    {
        // 1. Validasi Input
        $rules = [
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat',
            'start_time' => 'required',
            'end_time' => 'required',
            'type' => 'required|in:mapel,ekskul',
            'class_name' => 'required|string',
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
                'day' => $request->day,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'type' => $request->type,
                'subject_id' => $request->type === 'mapel' ? $request->subject_id : null,
                'extra_id' => $request->type === 'ekskul' ? $request->extra_id : null,
                'class_name' => $request->class_name,
                'instructor_id' => $request->instructor_id,
            ]
        );

        return redirect()->back()->with('success', 'Jadwal berhasil disimpan!');
    }

    public function deleteSchedule($id)
    {
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
        $val = $request->validate([
            'student_id' => 'required|exists:users,id', 'extra_id' => 'required|exists:extras,id',
            'nilai_teknis' => 'required|numeric', 'observasi' => 'nullable', 'rekomendasi' => 'nullable'
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
        $val = $request->validate([
            'student_id' => 'required', 'subject_id' => 'required',
            'uts' => 'required|numeric', 'uas' => 'required|numeric', 'catatan' => 'nullable'
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
}