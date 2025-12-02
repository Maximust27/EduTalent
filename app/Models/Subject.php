<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    protected $guarded = []; // Agar bisa diisi semua kolom

    // Relasi: Mapel dimiliki oleh Guru
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}