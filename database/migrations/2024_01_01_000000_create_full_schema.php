<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. TABEL USERS (Induk)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // Custom Fields EduTalent
            $table->enum('role', ['admin', 'guru', 'pembina', 'siswa'])->default('siswa');
            $table->string('nomor_induk')->nullable(); // NIS/NIP
            $table->string('kelas')->nullable(); // Khusus Siswa
            
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. TABEL PENDUKUNG LARAVEL (Sessions, Reset Password, & Cache)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Tambahan Wajib: Tabel Cache & Cache Locks (Penyebab Error Sebelumnya)
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });

        // 3. TABEL MATA PELAJARAN (Subjects)
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mapel'); 
            // Relasi ke Users (Guru) - Pastikan Users sudah ada (Langkah 1)
            $table->foreignId('teacher_id')->nullable()->constrained('users')->onDelete('set null'); 
            $table->timestamps();
        });

        // 4. TABEL EKSTRAKURIKULER (Extras)
        Schema::create('extras', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ekskul');
            // Relasi ke Users (Pembina)
            $table->foreignId('coach_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 5. TABEL NILAI AKADEMIK
        Schema::create('academic_grades', function (Blueprint $table) {
            $table->id();
            // Relasi ke Users (Siswa) & Subjects (Mapel)
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->integer('uts')->default(0);
            $table->integer('uas')->default(0);
            $table->text('catatan_guru')->nullable();
            $table->timestamps();
        });

        // 6. TABEL NILAI MINAT BAKAT
        Schema::create('talent_grades', function (Blueprint $table) {
            $table->id();
            // Relasi ke Users (Siswa) & Extras (Ekskul)
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('extra_id')->constrained('extras')->onDelete('cascade');
            $table->integer('nilai_teknis')->default(0);
            $table->text('observasi_bakat')->nullable();
            $table->text('rekomendasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus semua tabel jika rollback
        Schema::dropIfExists('talent_grades');
        Schema::dropIfExists('academic_grades');
        Schema::dropIfExists('extras');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};