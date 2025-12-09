<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicGrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'uts',
        'uas',
        'catatan_guru'
    ];

    // Milik Siswa
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Milik Mapel
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}