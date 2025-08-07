<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Rezervacija;

class Let extends Model
{
     protected $fillable = [
        'broj_leta',
        'polaziste',
        'odrediste',
        'vreme_poletanja',
        'vreme_sletanja',
        'broj_mesta',
        'cena',
    ];
    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class);
    }


}
