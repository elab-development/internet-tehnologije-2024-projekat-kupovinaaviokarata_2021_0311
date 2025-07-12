<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Let;

class Rezervacija extends Model
{
    protected $fillable = [
        'ime_putnika',
        'email',
        'broj_sedista',
        'let_id',
    ];

    public function let()
    {
        return $this->belongsTo(Let::class);
    }
}
