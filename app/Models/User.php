<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        // Custom Fields EduTalent
        'role',          // admin, guru, pembina, siswa
        'nomor_induk',   // NIS atau NIP
        'kelas',         // Khusus Siswa
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- RELATIONS ---

    // 1. Relasi Guru -> Mengajar Mapel
    public function subjects()
    {
        return $this->hasMany(Subject::class, 'teacher_id');
    }

    // 2. Relasi Pembina -> Membina Ekskul
    public function extras()
    {
        return $this->hasMany(Extra::class, 'coach_id');
    }

    // 3. Relasi Siswa -> Punya Nilai Akademik
    public function academicGrades()
    {
        return $this->hasMany(AcademicGrade::class, 'student_id');
    }

    // 4. Relasi Siswa -> Punya Nilai Bakat
    public function talentGrades()
    {
        return $this->hasMany(TalentGrade::class, 'student_id');
    }

    // 5. Relasi Guru/Pembina -> Punya Jadwal Mengajar
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'instructor_id');
    }
}