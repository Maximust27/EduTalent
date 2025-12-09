<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'day',           // Senin, Selasa, dll
        'start_time',
        'end_time',
        'type',          // mapel atau ekskul
        'subject_id',    // diisi jika type mapel
        'extra_id',      // diisi jika type ekskul
        'class_name',    // XII MIPA 1, dll
        'instructor_id', // User ID (Guru/Pembina)
    ];

    // Relasi ke Mapel (Opsional)
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // Relasi ke Ekskul (Opsional)
    public function extra()
    {
        return $this->belongsTo(Extra::class);
    }

    // Relasi ke Pengajar (Guru/Pembina)
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}