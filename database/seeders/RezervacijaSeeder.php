<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rezervacija;
use App\Models\User;
use App\Models\Let;

class RezervacijaSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('role', 'user')->first(); // uzme test user-a
        $let = Let::first();

        if ($user && $let) {
            Rezervacija::create([
                'user_id' => $user->id,
                'let_id' => $let->id,
                'ime_putnika' => 'Test Putnik',
                'email' => 'putnik@example.com',
                'broj_sedista' => 12,
                'broj_karata' => 2,
                'ukupna_cena' => $let->cena * 2,
            ]);
        }
    }
}
