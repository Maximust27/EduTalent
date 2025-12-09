<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentGrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'extra_id',
        'nilai_teknis',
        'observasi_bakat',
        'rekomendasi'
    ];

    // Milik Siswa
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Milik Ekskul
    public function extra()
    {
        return $this->belongsTo(Extra::class, 'extra_id');
    }
}