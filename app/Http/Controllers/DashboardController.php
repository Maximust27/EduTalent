<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Subject;
use App\Models\AcademicGrade;
use App\Models\TalentGrade;

class DashboardController extends Controller
{
    /**
     * Halaman Utama Dashboard (Pengatur Lalu Lintas)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Cek Role dengan Ketat
        if ($user->role === 'guru') {
            return $this->teacherDashboard($user, $request);
        } elseif ($user->role === 'admin') {
            return Inertia::render('Dashboard/Admin'); 
        } elseif ($user->role === 'pembina') {
            return Inertia::render('Dashboard/Pembina'); 
        }

        // Default: Jika role 'siswa' atau tidak diketahui, lempar ke dashboard siswa
        return $this->studentDashboard($user);
    }

    /**
     * Logika Khusus Halaman GURU
     */
    private function teacherDashboard($user, $request)
    {
        // 1. Ambil Mapel yang diampu Guru ini
        $mySubjects = Subject::where('teacher_id', $user->id)->get();

        // 2. Ambil Daftar Kelas Unik
        $classList = User::where('role', 'siswa')
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas')
            ->pluck('kelas');

        // 3. Filter Aktif
        $selectedClass = $request->input('kelas', $classList->first());
        $selectedSubjectId = $request->input('subject_id', $mySubjects->first()->id ?? null);

        // 4. Ambil Siswa
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

        // 5. Cek Wali Kelas (Dummy Logic dulu)
        $isHomeroom = 'XII MIPA 1';

        return Inertia::render('Dashboard/Teacher', [
            'auth' => ['user' => $user],
            'subjects' => $mySubjects,
            'classes' => $classList,
            'students' => $students,
            'filters' => [
                'kelas' => $selectedClass,
                'subject_id' => $selectedSubjectId
            ],
            'homeroom' => $isHomeroom
        ]);
    }

    /**
     * Fungsi Simpan Nilai (Untuk Guru)
     */
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
            [
                'student_id' => $validated['student_id'],
                'subject_id' => $validated['subject_id'],
            ],
            [
                'uts' => $validated['uts'],
                'uas' => $validated['uas'],
                'catatan_guru' => $validated['catatan'],
            ]
        );

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }

    /**
     * Logika Khusus Halaman SISWA
     */
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

        $analysis = [
            'jurusan' => 'Belum Cukup Data',
            'alasan' => 'Silakan hubungi guru untuk melengkapi nilai akademik dan ekskul.',
        ];

        if ($academics->isNotEmpty()) {
            $bestMapel = $academics->sortByDesc('nilai')->first();
            if ($bestMapel['nilai'] >= 80) {
                $analysis['jurusan'] = 'Potensi di ' . $bestMapel['mapel'];
                $analysis['alasan'] = "Nilai tertinggi kamu ada di mata pelajaran ini ({$bestMapel['nilai']}).";
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