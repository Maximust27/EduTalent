<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',         // Tambahan
        'nomor_induk',  // Tambahan
        'kelas',        // Tambahan
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ==========================================
    // RELASI TAMBAHAN (PENTING!)
    // ==========================================

    /**
     * Relasi: Satu User (Siswa) punya banyak Nilai Akademik
     */
    public function academicGrades()
    {
        return $this->hasMany(AcademicGrade::class, 'student_id');
    }

    /**
     * Relasi: Satu User (Siswa) punya banyak Nilai Bakat
     */
    public function talentGrades()
    {
        return $this->hasMany(TalentGrade::class, 'student_id');
    }

    /**
     * Relasi: Satu User (Guru) mengampu banyak Mapel
     */
    public function subjects()
    {
        return $this->hasMany(Subject::class, 'teacher_id');
    }

    /**
     * Relasi: Satu User (Pembina) membina banyak Ekskul
     */
    public function extras()
    {
        return $this->hasMany(Extra::class, 'coach_id');
    }
}