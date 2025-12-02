<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicGrade extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Relasi ke Siswa
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Relasi ke Mapel (PENTING untuk Controller)
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}