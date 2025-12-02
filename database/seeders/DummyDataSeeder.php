<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subject;
use App\Models\Extra;
use App\Models\AcademicGrade;
use App\Models\TalentGrade;
use Illuminate\Support\Facades\Hash;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. BUAT AKUN GURU (TEACHERS)
        // ==========================================
        
        // Guru Matematika (Mengajar MIPA & IPS)
        $guruMtk = User::create([
            'name' => 'Pak Heryanto (Guru MTK)',
            'email' => 'guru.mtk@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nomor_induk' => 'GURU001'
        ]);

        // Guru Bahasa (Mengajar MIPA & IPS)
        $guruBahasa = User::create([
            'name' => 'Ibu Ratna (Guru Bahasa)',
            'email' => 'guru.bahasa@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nomor_induk' => 'GURU002'
        ]);

        // Pembina Basket
        $coachBasket = User::create([
            'name' => 'Coach Dimas',
            'email' => 'coach.basket@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'pembina',
            'nomor_induk' => 'COACH001'
        ]);

        // ==========================================
        // 2. BUAT MATA PELAJARAN & EKSKUL (SUBJECTS)
        // ==========================================

        // Mapel diampu Pak Heryanto
        $mtkWajib = Subject::create(['nama_mapel' => 'Matematika (Wajib)', 'teacher_id' => $guruMtk->id]);
        $mtkMinat = Subject::create(['nama_mapel' => 'Matematika (Peminatan)', 'teacher_id' => $guruMtk->id]);

        // Mapel diampu Ibu Ratna
        $bIndo = Subject::create(['nama_mapel' => 'Bahasa Indonesia', 'teacher_id' => $guruBahasa->id]);
        $bInggris = Subject::create(['nama_mapel' => 'Bahasa Inggris', 'teacher_id' => $guruBahasa->id]);

        // Ekskul
        $basket = Extra::create(['nama_ekskul' => 'Basket', 'coach_id' => $coachBasket->id]);
        $robotik = Extra::create(['nama_ekskul' => 'Robotik', 'coach_id' => $guruMtk->id]); // Pak Heryanto juga pembina robotik

        // ==========================================
        // 3. BUAT SISWA (STUDENTS) - BEDA KELAS
        // ==========================================

        // KELAS XII MIPA 1
        $budi = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'kelas' => 'XII MIPA 1',
            'nomor_induk' => 'S001'
        ]);

        $siti = User::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'kelas' => 'XII MIPA 1',
            'nomor_induk' => 'S002'
        ]);

        // KELAS XII IPS 1
        $reza = User::create([
            'name' => 'Reza Rahadian',
            'email' => 'reza@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'kelas' => 'XII IPS 1',
            'nomor_induk' => 'S003'
        ]);

        $ayu = User::create([
            'name' => 'Ayu Tingting',
            'email' => 'ayu@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'kelas' => 'XII IPS 1',
            'nomor_induk' => 'S004'
        ]);

        // ==========================================
        // 4. INPUT NILAI (MENGHUBUNGKAN MEREKA)
        // ==========================================

        // --- NILAI MATEMATIKA WAJIB (Pak Heryanto menilai MIPA & IPS) ---
        
        // Budi (MIPA) - Pintar MTK
        AcademicGrade::create(['student_id' => $budi->id, 'subject_id' => $mtkWajib->id, 'uts' => 90, 'uas' => 95, 'catatan_guru' => 'Sangat berbakat di logika.']);
        
        // Siti (MIPA) - Rata-rata
        AcademicGrade::create(['student_id' => $siti->id, 'subject_id' => $mtkWajib->id, 'uts' => 75, 'uas' => 78, 'catatan_guru' => 'Tingkatkan ketelitian hitungan.']);

        // Reza (IPS) - Kurang di MTK
        AcademicGrade::create(['student_id' => $reza->id, 'subject_id' => $mtkWajib->id, 'uts' => 60, 'uas' => 65, 'catatan_guru' => 'Perlu remedial bab fungsi.']);

        // Ayu (IPS) - Lumayan
        AcademicGrade::create(['student_id' => $ayu->id, 'subject_id' => $mtkWajib->id, 'uts' => 80, 'uas' => 82, 'catatan_guru' => 'Rajin mengerjakan tugas.']);


        // --- NILAI BAHASA INDONESIA (Ibu Ratna menilai MIPA & IPS) ---

        // Budi (MIPA)
        AcademicGrade::create(['student_id' => $budi->id, 'subject_id' => $bIndo->id, 'uts' => 80, 'uas' => 82, 'catatan_guru' => 'Penulisan esai cukup baik.']);
        
        // Reza (IPS) - Jago Bahasa
        AcademicGrade::create(['student_id' => $reza->id, 'subject_id' => $bIndo->id, 'uts' => 95, 'uas' => 98, 'catatan_guru' => 'Sangat puitis dan kritis.']);


        // --- NILAI BAKAT (EKSTRAKURIKULER) ---

        // Budi ikut Basket
        TalentGrade::create(['student_id' => $budi->id, 'extra_id' => $basket->id, 'nilai_teknis' => 92, 'observasi_bakat' => 'Kapten Tim yang solid.', 'rekomendasi' => 'Lanjut DBL.']);

        // Siti ikut Robotik
        TalentGrade::create(['student_id' => $siti->id, 'extra_id' => $robotik->id, 'nilai_teknis' => 85, 'observasi_bakat' => 'Tekun merakit.', 'rekomendasi' => 'Ikut lomba regional.']);
    }
}