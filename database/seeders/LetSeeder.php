<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Let;

class LetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Let::create([
            'broj_leta' => 'BEG123',
            'polaziste' => 'Beograd',
            'odrediste' => 'Pariz',
            'vreme_poletanja' => now()->addDays(2),
            'vreme_sletanja' => now()->addDays(2)->addHours(2),
            'broj_mesta' => 150,
            'cena' => 120.50,
        ]);

         Let::create([
            'broj_leta' => 'NYC456',
            'polaziste' => 'New York',
            'odrediste' => 'London',
            'vreme_poletanja' => now()->addDays(5),
            'vreme_sletanja' => now()->addDays(5)->addHours(7),
            'broj_mesta' => 300,
            'cena' => 450.00,
        ]);

    }
}
