<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rezervacija;

class RezervacijaController extends Controller
{
public function store(Request $request)
{
    try {
        
        $validated = $request->validate([
            'ime_putnika' => 'required|string',
            'email' => 'required|email',
            'broj_sedista' => 'required|integer',
            'let_id' => 'required|exists:lets,id',
        ]);

     
        $zauzeto = Rezervacija::where('let_id', $validated['let_id'])
            ->where('broj_sedista', $validated['broj_sedista'])
            ->exists();

        if ($zauzeto) {
            return response()->json([
                'error' => 'Sedište je već rezervisano za ovaj let.'
            ], 400);
        }

      
        $rezervacija = Rezervacija::create($validated);

        return response()->json($rezervacija, 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }
}


    public function index()
    {
        return Rezervacija::with('let')->get();
    }
}
