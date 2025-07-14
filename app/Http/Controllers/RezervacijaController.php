<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rezervacija;
use Illuminate\Support\Facades\DB;

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

            $rezervacija = DB::transaction(function () use ($validated) {
                // Zaključavamo sve rezervacije za dati let
                $zauzeto = Rezervacija::where('let_id', $validated['let_id'])
                    ->where('broj_sedista', $validated['broj_sedista'])
                    ->lockForUpdate()
                    ->exists();

                if ($zauzeto) {
                    throw new \Exception('Sedište je već rezervisano za ovaj let.');
                }

                return Rezervacija::create($validated);
            });

            return response()->json($rezervacija, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function index()
    {
        return Rezervacija::with('let')->get();
    }

    public function destroy($id)
    {
        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija) {
            return response()->json([
                'error' => 'Rezervacija nije pronađena.'
            ], 404);
        }

        $rezervacija->delete();

        return response()->json(['message' => 'Rezervacija uspešno obrisana.'], 200);
    }

}
