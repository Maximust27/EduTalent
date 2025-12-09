<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Extra extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_ekskul',
        'coach_id'
    ];

    // Relasi ke Pembina
    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    // Relasi ke Nilai Bakat Siswa
    public function talentGrades()
    {
        return $this->hasMany(TalentGrade::class);
    }

    // Relasi ke Jadwal
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}