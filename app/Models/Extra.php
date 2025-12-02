<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Extra extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Relasi: Ekskul dibina oleh Pembina
    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}