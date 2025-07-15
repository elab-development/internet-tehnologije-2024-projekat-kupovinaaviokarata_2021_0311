<?php

namespace App\Http\Controllers;

use App\Models\Let;
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




            $let = Let::find($validated['let_id']);

if ($validated['broj_sedista'] > $let->broj_mesta) {
    return response()->json([
        'error' => 'Uneti broj sedišta premašuje kapacitet leta.'
    ], 400);
}



            $rezervacija = DB::transaction(function () use ($validated) {
               
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
                'error' => 'Rezervacija nije pronadjena.'
            ], 404);
        }

        $rezervacija->delete();

        return response()->json(['message' => 'Rezervacija uspešno obrisana.'], 200);
    }


public function show($id)
{
    $rezervacija = Rezervacija::with('let')->find($id);

    if (!$rezervacija) {
        return response()->json([
            'error' => 'Rezervacija nije pronadjena.'
        ], 404);
    }

    return response()->json($rezervacija);
}








}
