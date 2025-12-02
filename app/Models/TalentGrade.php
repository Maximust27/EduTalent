<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentGrade extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Relasi ke Siswa
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Relasi ke Ekskul (PENTING untuk Controller)
    public function extra()
    {
        return $this->belongsTo(Extra::class, 'extra_id');
    }
}