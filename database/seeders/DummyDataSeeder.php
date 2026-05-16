<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subject;
use App\Models\Extra;
use App\Models\AcademicGrade;
use App\Models\TalentGrade;
use App\Models\Schedule;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        // Hash password sekali di awal untuk menghemat pemakaian CPU saat looping ratusan data
        $defaultPassword = Hash::make('password');

        // ==========================================
        // 1. BUAT AKUN SUPER ADMIN
        // ==========================================
        User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@edutalent.com',
            'password' => $defaultPassword,
            'role' => 'admin',
            'nomor_induk' => 'ADM001',
            'kelas' => null
        ]);

        // ==========================================
        // 2. BUAT AKUN GURU & PEMBINA (Total 15 Guru, 10 Pembina Ekskul)
        // ==========================================
        $guruData = [
            ['name' => 'Agus Santoso, S.Ag.', 'email' => 'agus.agama@edutalent.com', 'kode' => 'G001'],
            ['name' => 'Dra. Sri Wahyuni', 'email' => 'sri.pkn@edutalent.com', 'kode' => 'G002'],
            ['name' => 'Budi Utomo, S.Pd.', 'email' => 'budi.bindo@edutalent.com', 'kode' => 'G003'],
            ['name' => 'Heryanto, M.Pd.', 'email' => 'hery.mtk1@edutalent.com', 'kode' => 'G004'],
            ['name' => 'Rini Astuti, S.Pd.', 'email' => 'rini.mtk2@edutalent.com', 'kode' => 'G005'], // MTK Minat
            ['name' => 'Ratna Sari, S.Pd.', 'email' => 'ratna.bing@edutalent.com', 'kode' => 'G006'],
            ['name' => 'Drs. Supriyanto', 'email' => 'supri.fisika@edutalent.com', 'kode' => 'G007'],
            ['name' => 'Susi Susanti, S.Si.', 'email' => 'susi.biologi@edutalent.com', 'kode' => 'G008'],
            ['name' => 'Dr. Hendra', 'email' => 'hendra.kimia@edutalent.com', 'kode' => 'G009'],
            ['name' => 'Eko Prasetyo, S.Pd.', 'email' => 'eko.geografi@edutalent.com', 'kode' => 'G010'],
            ['name' => 'Dewi Lestari, M.Sos.', 'email' => 'dewi.sosiologi@edutalent.com', 'kode' => 'G011'],
            ['name' => 'Anita Rachman, S.E.', 'email' => 'anita.ekonomi@edutalent.com', 'kode' => 'G012'],
            ['name' => 'Bambang Sugeng, S.Pd.', 'email' => 'bambang.sejarah@edutalent.com', 'kode' => 'G013'],
            ['name' => 'Andi Setiawan, S.Or.', 'email' => 'andi.pjok@edutalent.com', 'kode' => 'G014'],
            ['name' => 'Lina Marlina, S.Sn.', 'email' => 'lina.seni@edutalent.com', 'kode' => 'G015'],
        ];

        $gurus = [];
        foreach ($guruData as $g) {
            $gurus[] = User::create([
                'name' => $g['name'],
                'email' => $g['email'],
                'password' => $defaultPassword,
                'role' => 'guru',
                'nomor_induk' => $g['kode']
            ]);
        }

        // Pembina Ekskul (10 Pembina untuk 10 Ekskul Umum)
        $pembinas = [
            User::create(['name' => 'Coach Dimas', 'email' => 'coach.basket@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C001']),
            User::create(['name' => 'Coach Yudi', 'email' => 'coach.futsal@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C002']),
            User::create(['name' => 'Kak Gilang', 'email' => 'gilang.pramuka@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C003']),
            User::create(['name' => 'Dr. Rina', 'email' => 'rina.pmr@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C004']),
            User::create(['name' => 'Pak Irwan', 'email' => 'irwan.paskibra@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C005']),
            User::create(['name' => 'Ustadz Ali', 'email' => 'ali.rohis@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C006']),
            User::create(['name' => 'Miss Vina', 'email' => 'vina.english@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C007']),
            User::create(['name' => 'Kak Maya', 'email' => 'maya.tari@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C008']),
            User::create(['name' => 'Pak Toni', 'email' => 'toni.padus@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C009']),
            User::create(['name' => 'Coach Herman', 'email' => 'coach.voli@edutalent.com', 'password' => $defaultPassword, 'role' => 'pembina', 'nomor_induk' => 'C010']),
        ];

        // ==========================================
        // 3. BUAT MATA PELAJARAN & EKSKUL
        // ==========================================
        $mapels = [
            'Agama' => Subject::create(['nama_mapel' => 'Pend. Agama', 'teacher_id' => $gurus[0]->id]),
            'PKn' => Subject::create(['nama_mapel' => 'Pancasila & Kewarganegaraan', 'teacher_id' => $gurus[1]->id]),
            'BIndo' => Subject::create(['nama_mapel' => 'Bahasa Indonesia', 'teacher_id' => $gurus[2]->id]),
            'MTKW' => Subject::create(['nama_mapel' => 'Matematika Wajib', 'teacher_id' => $gurus[3]->id]),
            'BIng' => Subject::create(['nama_mapel' => 'Bahasa Inggris', 'teacher_id' => $gurus[5]->id]),
            'PJOK' => Subject::create(['nama_mapel' => 'Pend. Jasmani & Olahraga', 'teacher_id' => $gurus[13]->id]),
            'Seni' => Subject::create(['nama_mapel' => 'Seni Budaya', 'teacher_id' => $gurus[14]->id]),
            
            // Peminatan MIPA
            'MTKM' => Subject::create(['nama_mapel' => 'Matematika Peminatan', 'teacher_id' => $gurus[4]->id]),
            'Fisika' => Subject::create(['nama_mapel' => 'Fisika', 'teacher_id' => $gurus[6]->id]),
            'Biologi' => Subject::create(['nama_mapel' => 'Biologi', 'teacher_id' => $gurus[7]->id]),
            'Kimia' => Subject::create(['nama_mapel' => 'Kimia', 'teacher_id' => $gurus[8]->id]),
            
            // Peminatan IPS
            'Geografi' => Subject::create(['nama_mapel' => 'Geografi', 'teacher_id' => $gurus[9]->id]),
            'Sosiologi' => Subject::create(['nama_mapel' => 'Sosiologi', 'teacher_id' => $gurus[10]->id]),
            'Ekonomi' => Subject::create(['nama_mapel' => 'Ekonomi', 'teacher_id' => $gurus[11]->id]),
            'Sejarah' => Subject::create(['nama_mapel' => 'Sejarah Peminatan', 'teacher_id' => $gurus[12]->id]),
        ];

        // Pengelompokan 12 Mapel sesuai kriteria (Termasuk Lintas Jurusan)
        $kurikulumMipa = [
            $mapels['Agama'], $mapels['PKn'], $mapels['BIndo'], $mapels['MTKW'], $mapels['BIng'], $mapels['PJOK'], $mapels['Seni'],
            $mapels['MTKM'], $mapels['Fisika'], $mapels['Biologi'], $mapels['Kimia'], 
            $mapels['Ekonomi'] // Lintas Jurusan
        ];

        $kurikulumIps = [
            $mapels['Agama'], $mapels['PKn'], $mapels['BIndo'], $mapels['MTKW'], $mapels['BIng'], $mapels['PJOK'], $mapels['Seni'],
            $mapels['Geografi'], $mapels['Sosiologi'], $mapels['Ekonomi'], $mapels['Sejarah'], 
            $mapels['Biologi'] // Lintas Jurusan
        ];

        // 10 Ekskul Umum di Sekolah
        $ekskuls = [
            Extra::create(['nama_ekskul' => 'Basket', 'coach_id' => $pembinas[0]->id]),
            Extra::create(['nama_ekskul' => 'Futsal', 'coach_id' => $pembinas[1]->id]),
            Extra::create(['nama_ekskul' => 'Pramuka', 'coach_id' => $pembinas[2]->id]),
            Extra::create(['nama_ekskul' => 'PMR', 'coach_id' => $pembinas[3]->id]),
            Extra::create(['nama_ekskul' => 'Paskibra', 'coach_id' => $pembinas[4]->id]),
            Extra::create(['nama_ekskul' => 'Rohis', 'coach_id' => $pembinas[5]->id]),
            Extra::create(['nama_ekskul' => 'English Club', 'coach_id' => $pembinas[6]->id]),
            Extra::create(['nama_ekskul' => 'Tari Tradisional', 'coach_id' => $pembinas[7]->id]),
            Extra::create(['nama_ekskul' => 'Paduan Suara', 'coach_id' => $pembinas[8]->id]),
            Extra::create(['nama_ekskul' => 'Voli', 'coach_id' => $pembinas[9]->id]),
        ];

        // ==========================================
        // 4. BUAT KELAS, SISWA & NILAI (25 Siswa / Kelas)
        // ==========================================
        $daftarKelas = [
            ['nama' => 'X MIPA 1', 'jurusan' => 'MIPA'],
            ['nama' => 'X MIPA 2', 'jurusan' => 'MIPA'],
            ['nama' => 'X MIPA 3', 'jurusan' => 'MIPA'],
            ['nama' => 'X IPS 1', 'jurusan' => 'IPS'],
            ['nama' => 'X IPS 2', 'jurusan' => 'IPS'],
        ];

        $academicGradesInsert = [];
        $talentGradesInsert = [];
        $nisCounter = 1000;

        foreach ($daftarKelas as $kelas) {
            $kurikulum = ($kelas['jurusan'] == 'MIPA') ? $kurikulumMipa : $kurikulumIps;

            for ($i = 1; $i <= 25; $i++) {
                // Buat Siswa
                $siswa = User::create([
                    'name' => $faker->name,
                    'email' => 'siswa' . $nisCounter . '@edutalent.com',
                    'password' => $defaultPassword,
                    'role' => 'siswa',
                    'kelas' => $kelas['nama'],
                    'nomor_induk' => (string) $nisCounter
                ]);
                $nisCounter++;

                // Generate Academic Grades untuk 12 Mapel
                foreach ($kurikulum as $mapel) {
                    $uts = $faker->numberBetween(70, 98);
                    $uas = $faker->numberBetween(70, 100);
                    $academicGradesInsert[] = [
                        'student_id' => $siswa->id,
                        'subject_id' => $mapel->id,
                        'uts' => $uts,
                        'uas' => $uas,
                        'catatan_guru' => $uas > 85 ? 'Pertahankan prestasimu.' : 'Tingkatkan lagi belajarmu.',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Generate Talent Grades (Siswa ikut 1-2 ekskul secara acak dari 10 ekskul yang ada)
                $ikutEkskul = $faker->randomElements($ekskuls, $faker->numberBetween(1, 2));
                foreach ($ikutEkskul as $ekskul) {
                    $nilai = $faker->numberBetween(75, 95);
                    $talentGradesInsert[] = [
                        'student_id' => $siswa->id,
                        'extra_id' => $ekskul->id,
                        'nilai_teknis' => $nilai,
                        'observasi_bakat' => 'Siswa menunjukkan ketertarikan dan bakat yang baik.',
                        'rekomendasi' => $nilai > 88 ? 'Layak diikutkan lomba perwakilan sekolah.' : 'Perlu latihan rutin.',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Bulk Insert Nilai agar proses seeding sangat cepat
        $chunksAcademic = array_chunk($academicGradesInsert, 500);
        foreach ($chunksAcademic as $chunk) {
            AcademicGrade::insert($chunk);
        }

        $chunksTalent = array_chunk($talentGradesInsert, 500);
        foreach ($chunksTalent as $chunk) {
            TalentGrade::insert($chunk);
        }

        // ==========================================
        // 5. GENERATE JADWAL PELAJARAN & EKSKUL
        // ==========================================
        $hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        // Jadwal Mapel Akademik (Pagi sampai 14:30)
        $waktuMapel = [
            ['07:30', '09:00'],
            ['09:15', '10:45'],
            ['11:00', '12:30'],
            ['13:00', '14:30'] // Jam 14:30 siswa pulang
        ];
        
        $schedulesInsert = [];

        foreach ($daftarKelas as $kelas) {
            $kurikulum = ($kelas['jurusan'] == 'MIPA') ? $kurikulumMipa : $kurikulumIps;
            
            foreach ($hari as $d) {
                // Alokasikan mapel per hari untuk kelas ini secara acak (Simulasi Jadwal Akademik)
                $mapelHariIni = $faker->randomElements($kurikulum, 4);

                foreach ($waktuMapel as $index => $waktu) {
                    // Jika hari jumat, slot ke-4 dihilangkan (pulang lebih awal jam 12:30, atau slot dipakai istirahat)
                    if ($d == 'Jumat' && $index == 3) continue; 

                    $selectedMapel = $mapelHariIni[$index];
                    $schedulesInsert[] = [
                        'day' => $d,
                        'start_time' => $waktu[0],
                        'end_time' => $waktu[1],
                        'type' => 'mapel',
                        'subject_id' => $selectedMapel->id,
                        'extra_id' => null,
                        'class_name' => $kelas['nama'],
                        'instructor_id' => $selectedMapel->teacher_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Jadwal Ekskul UMUM (Dilaksanakan setelah sekolah, durasi 2 jam)
        // Sekolah pulang jam 14:30, siswa istirahat/sholat, ekskul mulai 15:30 s/d 17:30
        $jadwalEkskuls = [
            ['hari' => 'Senin',  'waktu' => ['15:30', '17:30'], 'ekskul_index' => [0, 6]], // Basket, English Club
            ['hari' => 'Selasa', 'waktu' => ['15:30', '17:30'], 'ekskul_index' => [1, 7]], // Futsal, Tari Tradisional
            ['hari' => 'Rabu',   'waktu' => ['15:30', '17:30'], 'ekskul_index' => [3, 8, 9]], // PMR, Paduan Suara, Voli
            ['hari' => 'Kamis',  'waktu' => ['15:30', '17:30'], 'ekskul_index' => [4, 5]], // Paskibra, Rohis
            ['hari' => 'Jumat',  'waktu' => ['15:00', '17:00'], 'ekskul_index' => [2]], // Pramuka (Mulai lebih awal karena Jumat pulang awal)
        ];

        foreach ($jadwalEkskuls as $je) {
            foreach ($je['ekskul_index'] as $idx) {
                $schedulesInsert[] = [
                    'day' => $je['hari'],
                    'start_time' => $je['waktu'][0],
                    'end_time' => $je['waktu'][1],
                    'type' => 'ekskul',
                    'subject_id' => null,
                    'extra_id' => $ekskuls[$idx]->id,
                    'class_name' => 'UMUM', // Bisa diikuti oleh seluruh kelas
                    'instructor_id' => $ekskuls[$idx]->coach_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        Schedule::insert($schedulesInsert);
    }
}