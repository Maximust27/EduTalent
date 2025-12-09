<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_mapel',
        'teacher_id'
    ];

    // Relasi ke Guru Pengampu
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relasi ke Nilai Siswa
    public function academicGrades()
    {
        return $this->hasMany(AcademicGrade::class);
    }

    // Relasi ke Jadwal
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}