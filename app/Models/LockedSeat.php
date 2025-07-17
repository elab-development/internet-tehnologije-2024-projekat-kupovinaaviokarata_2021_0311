<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LockedSeat extends Model
{
    protected $fillable = ['let_id', 'broj_sedista', 'locked_until'];

    public function let()
    {
        return $this->belongsTo(Let::class);
    }
}
