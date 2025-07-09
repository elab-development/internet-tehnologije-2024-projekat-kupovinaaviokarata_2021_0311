<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
