<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LockedSeat extends Model
{


    protected $table = 'locked_seats';
    protected $fillable = [
        'let_id', 
        'broj_sedista', 
        'locked_until'
    ];

        protected $casts = [
        'locked_until' => 'datetime',
    ];

    public function let()
    {
        return $this->belongsTo(Let::class);
    }
}
