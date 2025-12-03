<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Subject;
use App\Models\Extra;             // Model Ekskul
use App\Models\AcademicGrade;
use App\Models\TalentGrade;       // Model Nilai Bakat

class DashboardController extends Controller
{
    /**
     * Halaman Utama Dashboard (Pengatur Lalu Lintas)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // --- DEBUGGING SEMENTARA (HAPUS NANTI) ---
        // dd($user->role, $user->email); 
        // -----------------------------------------
    
        if ($user->role === 'guru') {
            return $this->teacherDashboard($user, $request);
        } 
        elseif ($user->role === 'pembina') {
            return $this->coachDashboard($user); 
        }
        elseif ($user->role === 'admin') {
            return Inertia::render('Dashboard/Admin'); 
        }
    
        // Default fallback ke siswa
        return $this->studentDashboard($user);
    }

    /**
     * LOGIKA DASHBOARD PEMBINA (BARU)
     */
    private function coachDashboard($user)
    {
        // Cari Ekskul yang dibina user ini
        $myExtra = Extra::where('coach_id', $user->id)->first();

        $students = [];
        $availableStudents = []; // List siswa yang bisa ditambahkan
        $stats = ['total' => 0, 'avg' => 0, 'top' => '-'];

        if ($myExtra) {
            // Ambil siswa yang SUDAH punya nilai di ekskul ini (Anggota Tim)
            $grades = TalentGrade::with('student')
                ->where('extra_id', $myExtra->id)
                ->get();

            $students = $grades->map(function($g) {
                return [
                    'id' => $g->student->id,
                    'name' => $g->student->name,
                    'kelas' => $g->student->kelas,
                    'nis' => $g->student->nomor_induk, 
                    'nilai_teknis' => $g->nilai_teknis,
                    'observasi' => $g->observasi_bakat,
                    'rekomendasi' => $g->rekomendasi
                ];
            });

            // Ambil siswa yang BELUM terdaftar di ekskul ini (Available to Add)
            // Logic: Ambil semua user role 'siswa', kecuali yang ID-nya sudah ada di $grades
            $existingStudentIds = $grades->pluck('student_id');
            
            $availableStudents = User::where('role', 'siswa')
                ->whereNotIn('id', $existingStudentIds)
                ->select('id', 'name', 'kelas', 'nomor_induk')
                ->orderBy('kelas')
                ->orderBy('name')
                ->get();

            // Hitung Statistik
            if ($students->count() > 0) {
                $stats['total'] = $students->count();
                $stats['avg'] = round($students->avg('nilai_teknis'));
                $stats['top'] = $students->sortByDesc('nilai_teknis')->first()['name'];
            }
        }

        return Inertia::render('Dashboard/Coach', [
            'auth' => ['user' => $user],
            'extra' => $myExtra,
            'students' => $students,
            'availableStudents' => $availableStudents, // Data untuk dropdown "Tambah Siswa"
            'stats' => $stats
        ]);
    }

    /**
     * FUNGSI SIMPAN NILAI BAKAT (BARU)
     */
    public function updateTalent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'extra_id' => 'required|exists:extras,id',
            // nilai_teknis bisa 0 jika baru ditambahkan (default member baru)
            'nilai_teknis' => 'required|numeric|min:0|max:100',
            'observasi' => 'nullable|string',
            'rekomendasi' => 'nullable|string',
        ]);

        TalentGrade::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'extra_id' => $validated['extra_id'],
            ],
            [
                'nilai_teknis' => $validated['nilai_teknis'],
                'observasi_bakat' => $validated['observasi'],
                'rekomendasi' => $validated['rekomendasi'],
            ]
        );

        return redirect()->back()->with('success', 'Data ekskul berhasil disimpan!');
    }

    // --- LOGIKA GURU (LAMA - TETAP ADA) ---
    private function teacherDashboard($user, $request)
    {
        $mySubjects = Subject::where('teacher_id', $user->id)->get();
        $classList = User::where('role', 'siswa')->select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        $selectedClass = $request->input('kelas', $classList->first());
        $selectedSubjectId = $request->input('subject_id', $mySubjects->first()->id ?? null);

        $students = [];
        if ($selectedClass && $selectedSubjectId) {
            $students = User::where('role', 'siswa')
                ->where('kelas', $selectedClass)
                ->with(['academicGrades' => function($query) use ($selectedSubjectId) {
                    $query->where('subject_id', $selectedSubjectId);
                }])
                ->get()
                ->map(function ($student) use ($selectedSubjectId) {
                    $grade = $student->academicGrades->first();
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'nis' => $student->nomor_induk,
                        'uts' => $grade->uts ?? 0,
                        'uas' => $grade->uas ?? 0,
                        'catatan' => $grade->catatan_guru ?? '',
                        'subject_id' => $selectedSubjectId
                    ];
                });
        }

        return Inertia::render('Dashboard/Teacher', [
            'auth' => ['user' => $user],
            'subjects' => $mySubjects,
            'classes' => $classList,
            'students' => $students,
            'filters' => ['kelas' => $selectedClass, 'subject_id' => $selectedSubjectId],
            'homeroom' => 'XII MIPA 1'
        ]);
    }

    public function updateGrade(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'uts' => 'required|numeric|min:0|max:100',
            'uas' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string|max:255',
        ]);

        AcademicGrade::updateOrCreate(
            ['student_id' => $validated['student_id'], 'subject_id' => $validated['subject_id']],
            ['uts' => $validated['uts'], 'uas' => $validated['uas'], 'catatan_guru' => $validated['catatan']]
        );

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }

    // --- LOGIKA SISWA (LAMA - TETAP ADA) ---
    private function studentDashboard($user)
    {
        $academics = AcademicGrade::with('subject')
            ->where('student_id', $user->id)
            ->get()
            ->map(function ($grade) {
                $nilaiAkhir = ($grade->uts + $grade->uas) / 2;
                return [
                    'mapel' => $grade->subject->nama_mapel,
                    'uts' => $grade->uts,
                    'uas' => $grade->uas,
                    'nilai' => round($nilaiAkhir),
                    'catatan' => $grade->catatan_guru ?? 'Belum ada catatan.',
                ];
            });

        $talents = TalentGrade::with('extra')
            ->where('student_id', $user->id)
            ->get()
            ->map(function ($grade) {
                $predikat = 'Kompeten';
                if ($grade->nilai_teknis >= 90) $predikat = 'Sangat Berbakat';
                elseif ($grade->nilai_teknis >= 80) $predikat = 'Berbakat';

                return [
                    'ekskul' => $grade->extra->nama_ekskul,
                    'nilai_teknis' => $grade->nilai_teknis,
                    'predikat' => $predikat,
                    'observasi' => $grade->observasi_bakat ?? 'Belum ada observasi.',
                ];
            });

        $analysis = ['jurusan' => 'Belum Cukup Data', 'alasan' => 'Silakan hubungi guru untuk melengkapi nilai.'];
        if ($academics->isNotEmpty()) {
            $bestMapel = $academics->sortByDesc('nilai')->first();
            if ($bestMapel['nilai'] >= 80) {
               $analysis['jurusan'] = 'Rekomendasi Tersedia'; 
               $analysis['alasan'] = 'Berdasarkan nilai tertinggi di ' . $bestMapel['mapel'];
            }
        }

        return Inertia::render('Dashboard/Student', [
            'auth' => ['user' => $user],
            'academics' => $academics,
            'talents' => $talents,
            'analysis' => $analysis
        ]);
    }
}