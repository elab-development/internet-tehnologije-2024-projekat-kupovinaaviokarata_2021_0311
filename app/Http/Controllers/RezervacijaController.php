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
