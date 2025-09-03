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
            'ime_putnika'   => 'required|string',
            'email'         => 'required|email',
            'broj_sedista'  => 'required|integer',
            'let_id'        => 'required|exists:lets,id',
        ]);

        $let = Let::findOrFail($validated['let_id']);

        if ($validated['broj_sedista'] > $let->broj_mesta) {
            return response()->json([
                'error' => 'Uneti broj sedišta premašuje kapacitet leta.'
            ], 400);
        }

        $validated['user_id'] = $request->user()->id;

        $rezervacija = DB::transaction(function () use ($validated) {
            
            $zauzeto = Rezervacija::where('let_id', $validated['let_id'])
                ->where('broj_sedista', $validated['broj_sedista'])
                ->lockForUpdate()
                ->exists();

            if ($zauzeto) {
                throw new \Exception('Sedište je već rezervisano za ovaj let.');
            }

            $lock = \App\Models\LockedSeat::where('let_id', $validated['let_id'])
                ->where('broj_sedista', $validated['broj_sedista'])
                ->where('locked_until', '>', now())
                ->first();

            if (!$lock) {
                throw new \Exception('Sedište nije zaključano ili je lock istekao.');
            }

           
            $lock->delete();

            return Rezervacija::create($validated);
        });

        $rezervacija->load('let', 'user');

        return response()->json($rezervacija, 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 400);
    }
}


   /* public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'ime_putnika' => 'required|string',
                'email' => 'required|email',
                'broj_sedista' => 'required|integer',
                'let_id' => 'required|exists:lets,id',
            ]);

            $let = Let::findOrFail($validated['let_id']);

            if ($validated['broj_sedista'] > $let->broj_mesta) {
                return response()->json([
                    'error' => 'Uneti broj sedišta premašuje kapacitet leta.'
                ], 400);
            }

          
            $validated['user_id'] = $request->user()->id;

            $rezervacija = DB::transaction(function () use ($validated) {

                 $lock = \App\Models\LockedSeat::where('let_id', $validated['let_id'])
                ->where('broj_sedista', $validated['broj_sedista'])
                ->where('locked_until', '>', now())
                ->first();


                  if (!$lock) {
                throw new \Exception('Sedište nije zaključano ili je lock istekao.');
            }

            if($lock) {
                $lock->delete();
            }

                $zauzeto = Rezervacija::where('let_id', $validated['let_id'])
                    ->where('broj_sedista', $validated['broj_sedista'])
                    ->lockForUpdate()
                    ->exists();

                if ($zauzeto) {
                    throw new \Exception('Sedište je već rezervisano za ovaj let.');
                }


                 $rezervacija = Rezervacija::create($validated);
                  $lock->delete();



                return $rezervacija;
            });


            $rezervacija->load('let', 'user');

            return response()->json($rezervacija, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
*/

    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {
       
            $rezervacije = Rezervacija::with('let', 'user')->get();
        } else {
           
            $rezervacije = Rezervacija::where('user_id', $request->user()->id)
                                      ->with('let')
                                      ->get();
        }

        return response()->json($rezervacije);
    }

    public function show($id, Request $request)
    {
        
$rezervacija = Rezervacija::with('let', 'user')->find($id);

        if (!$rezervacija) {
            return response()->json(['error' => 'Rezervacija nije pronadjena.'], 404);
        }

        if ($request->user()->role !== 'admin' && $rezervacija->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json($rezervacija);
        
    }

    
    public function destroy($id, Request $request)
    {
        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija) {
            return response()->json(['error' => 'Rezervacija nije pronadjena.'], 404);
        }

        if ($request->user()->role !== 'admin' && $rezervacija->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $rezervacija->delete();

        return response()->json(['message' => 'Rezervacija uspešno obrisana.'], 200);
    }
}
