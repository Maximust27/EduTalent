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

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. BUAT AKUN SUPER ADMIN
        // ==========================================
        User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nomor_induk' => 'ADM001',
            'kelas' => null
        ]);

        // ==========================================
        // 2. BUAT AKUN GURU & PEMBINA
        // ==========================================
        
        // Guru Matematika
        $guruMtk = User::create([
            'name' => 'Pak Heryanto (Guru MTK)',
            'email' => 'guru.mtk@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nomor_induk' => 'GURU001'
        ]);

        // Guru Bahasa
        $guruBahasa = User::create([
            'name' => 'Ibu Ratna (Guru Bahasa)',
            'email' => 'guru.bahasa@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nomor_induk' => 'GURU002'
        ]);

        // Guru IPA (Fisika/Kimia/Biologi)
        $guruIpa = User::create([
            'name' => 'Bu Susi (Guru IPA)',
            'email' => 'guru.ipa@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nomor_induk' => 'GURU003'
        ]);

        // Pembina Basket
        $coachBasket = User::create([
            'name' => 'Coach Dimas',
            'email' => 'coach.basket@edutalent.com',
            'password' => Hash::make('password'),
            'role' => 'pembina',
            'nomor_induk' => 'COACH001'
        ]);

        // Pembina Robotik (Pak Heryanto juga bisa jadi pembina)
        // Kita pakai Pak Heryanto yang sudah ada

        // ==========================================
        // 3. BUAT MATA PELAJARAN & EKSKUL
        // ==========================================

        $mtk = Subject::create(['nama_mapel' => 'Matematika', 'teacher_id' => $guruMtk->id]);
        $bindo = Subject::create(['nama_mapel' => 'Bahasa Indonesia', 'teacher_id' => $guruBahasa->id]);
        $bing = Subject::create(['nama_mapel' => 'Bahasa Inggris', 'teacher_id' => $guruBahasa->id]);
        $fisika = Subject::create(['nama_mapel' => 'Fisika', 'teacher_id' => $guruIpa->id]);
        $biologi = Subject::create(['nama_mapel' => 'Biologi', 'teacher_id' => $guruIpa->id]);
        $kimia = Subject::create(['nama_mapel' => 'Kimia', 'teacher_id' => $guruIpa->id]);

        $basket = Extra::create(['nama_ekskul' => 'Basket', 'coach_id' => $coachBasket->id]);
        $robotik = Extra::create(['nama_ekskul' => 'Robotik', 'coach_id' => $guruMtk->id]);

        // ==========================================
        // 4. BUAT SISWA (STUDENTS)
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

        // ==========================================
        // 5. INPUT NILAI (GRADES)
        // ==========================================

        // Nilai Budi
        AcademicGrade::create(['student_id' => $budi->id, 'subject_id' => $mtk->id, 'uts' => 90, 'uas' => 95, 'catatan_guru' => 'Sangat berbakat di logika.']);
        AcademicGrade::create(['student_id' => $budi->id, 'subject_id' => $bindo->id, 'uts' => 80, 'uas' => 82, 'catatan_guru' => 'Cukup baik.']);
        TalentGrade::create(['student_id' => $budi->id, 'extra_id' => $basket->id, 'nilai_teknis' => 92, 'observasi_bakat' => 'Kapten Tim.', 'rekomendasi' => 'Lanjut profesional.']);

        // Nilai Siti
        AcademicGrade::create(['student_id' => $siti->id, 'subject_id' => $mtk->id, 'uts' => 75, 'uas' => 78, 'catatan_guru' => 'Tingkatkan ketelitian.']);
        TalentGrade::create(['student_id' => $siti->id, 'extra_id' => $robotik->id, 'nilai_teknis' => 88, 'observasi_bakat' => 'Logika programming kuat.', 'rekomendasi' => 'Ikut olimpiade.']);

        // ==========================================
        // 6. JADWAL PELAJARAN (FULL DAY SCHOOL)
        // ==========================================
        // Jadwal untuk Kelas XII MIPA 1

        // SENIN
        Schedule::create(['day' => 'Senin', 'start_time' => '07:00', 'end_time' => '07:45', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruMtk->id, 'subject_id' => null]); // Upacara (Guru MTK Wali Kelas)
        Schedule::create(['day' => 'Senin', 'start_time' => '07:45', 'end_time' => '10:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruMtk->id, 'subject_id' => $mtk->id]);
        Schedule::create(['day' => 'Senin', 'start_time' => '10:00', 'end_time' => '10:30', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruMtk->id, 'subject_id' => null]); // Istirahat (Logic di frontend handle null subject sebagai istirahat jika mau, atau buat dummy subject 'Istirahat')
        Schedule::create(['day' => 'Senin', 'start_time' => '10:30', 'end_time' => '12:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruBahasa->id, 'subject_id' => $bindo->id]);
        Schedule::create(['day' => 'Senin', 'start_time' => '13:00', 'end_time' => '15:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruIpa->id, 'subject_id' => $fisika->id]);

        // SELASA
        Schedule::create(['day' => 'Selasa', 'start_time' => '07:00', 'end_time' => '09:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruIpa->id, 'subject_id' => $biologi->id]);
        Schedule::create(['day' => 'Selasa', 'start_time' => '09:00', 'end_time' => '11:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruIpa->id, 'subject_id' => $kimia->id]);
        Schedule::create(['day' => 'Selasa', 'start_time' => '11:30', 'end_time' => '13:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruBahasa->id, 'subject_id' => $bing->id]);
        // Ekskul Sore Selasa
        Schedule::create(['day' => 'Selasa', 'start_time' => '15:30', 'end_time' => '17:30', 'type' => 'ekskul', 'class_name' => 'SEMUA KELAS', 'instructor_id' => $coachBasket->id, 'extra_id' => $basket->id]);

        // RABU
        Schedule::create(['day' => 'Rabu', 'start_time' => '07:00', 'end_time' => '09:00', 'type' => 'mapel', 'class_name' => 'XII MIPA 1', 'instructor_id' => $guruMtk->id, 'subject_id' => $mtk->id]);
        // ... dst

        // JUMAT (Ekskul Robotik)
        Schedule::create(['day' => 'Jumat', 'start_time' => '13:00', 'end_time' => '15:00', 'type' => 'ekskul', 'class_name' => 'SEMUA KELAS', 'instructor_id' => $guruMtk->id, 'extra_id' => $robotik->id]);
    }
}