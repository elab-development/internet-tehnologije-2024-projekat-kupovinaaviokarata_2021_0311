<?php

namespace App\Http\Controllers;

use App\Models\Let;
use Illuminate\Http\Request;
use App\Models\Rezervacija;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



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
    // Dozvoljena polja za sortiranje
    $allowedSort = ['created_at', 'ime_putnika', 'email', 'broj_sedista'];

    $sortBy  = in_array($request->get('sort_by'), $allowedSort, true)
        ? $request->get('sort_by')
        : 'created_at';

    $sortDir = strtolower($request->get('sort_dir')) === 'asc' ? 'asc' : 'desc';

    $perPage = (int) $request->get('per_page', 10);
    if ($perPage < 1)   $perPage = 10;
    if ($perPage > 100) $perPage = 100;

    $query = Rezervacija::query()->with('let', 'user');

    // Admin vidi sve, user samo svoje
    if ($request->user()->role !== 'admin') {
        $query->where('user_id', $request->user()->id);
    }

    // --- Filteri ---
    if ($request->filled('let_id')) {
        $query->where('let_id', (int) $request->get('let_id'));
    }

    if ($request->filled('email')) {
        $query->where('email', 'like', '%' . $request->get('email') . '%');
    }

    if ($request->filled('ime_putnika')) {
        $query->where('ime_putnika', 'like', '%' . $request->get('ime') . '%');
    }

    if ($request->filled('broj_sedista')) {
        $query->where('broj_sedista', (int) $request->get('seat'));
    }

    if ($request->filled('date_from')) {
        $query->whereDate('created_at', '>=', $request->get('date_from'));
    }

    if ($request->filled('date_to')) {
        $query->whereDate('created_at', '<=', $request->get('date_to'));
    }

    $query->orderBy($sortBy, $sortDir);

    $rez = $query->paginate($perPage)->appends($request->query());

    return response()->json([
        'data' => $rez->items(),
        'meta' => [
            'current_page' => $rez->currentPage(),
            'per_page'     => $rez->perPage(),
            'total'        => $rez->total(),
            'last_page'    => $rez->lastPage(),
            'sort_by'      => $sortBy,
            'sort_dir'     => $sortDir,
        ],
        'links' => [
            'first' => $rez->url(1),
            'last'  => $rez->url($rez->lastPage()),
            'prev'  => $rez->previousPageUrl(),
            'next'  => $rez->nextPageUrl(),
        ],
    ]);
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

     public function update($id, Request $request)

    {
    try {
        Log::info('Usla sam u update metod');

        Log::info('--- UPDATE START ---');
        Log::info('Auth user role: ' . $request->user()->role);
        Log::info('Auth user id: ' . $request->user()->id);

        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija) {
            Log::warning("Rezervacija ID {$id} nije pronađena");
            return response()->json(['error' => 'Rezervacija nije pronađena.'], 404);
        }

        Log::info('Rezervacija pronađena', $rezervacija->toArray());
        Log::info('Rezervacija user_id: ' . $rezervacija->user_id);

        // Provera da li je admin ili vlasnik rezervacije
        if ($request->user()->role !== 'admin' && $rezervacija->user_id !== $request->user()->id) {
            Log::warning('Forbidden pokušaj: user nema prava da menja ovu rezervaciju');
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Validacija
        $validated = $request->validate([
            'ime_putnika' => 'sometimes|nullable|string',
            'email' => 'sometimes|email',
            'broj_sedista' => 'sometimes|integer',
        ]);

        Log::info('Validated update data', $validated);

        // Ako korisnik menja sedište
        if (isset($validated['broj_sedista'])) {
            Log::info("Pokušaj promene sedišta na broj: {$validated['broj_sedista']}");

            $let = Let::findOrFail($rezervacija->let_id);
            Log::info("Let ID {$let->id}, broj mesta: {$let->broj_mesta}");

            if ($validated['broj_sedista'] > $let->broj_mesta) {
                Log::warning('Uneti broj sedišta premašuje kapacitet leta');
                return response()->json([
                    'error' => 'Uneti broj sedišta premašuje kapacitet leta.'
                ], 400);
            }

            $lock = \App\Models\LockedSeat::where('let_id', $rezervacija->let_id)
                ->where('broj_sedista', $validated['broj_sedista'])
                ->where('locked_until', '>', now())
                ->first();

            if (!$lock) {
                Log::warning('Sedište nije zaključano ili je lock istekao.');
                return response()->json([
                    'error' => 'Sedište nije zaključano ili je lock istekao.'
                ], 400);
            }

            $zauzeto = Rezervacija::where('let_id', $rezervacija->let_id)
                ->where('broj_sedista', $validated['broj_sedista'])
                ->where('id', '!=', $rezervacija->id)
                ->lockForUpdate()
                ->exists();

            if ($zauzeto) {
                Log::warning('Sedište je već rezervisano');
                return response()->json([
                    'error' => 'Sedište je već rezervisano za ovaj let.'
                ], 400);
            }

            Log::info("Sedište {$validated['broj_sedista']} uspešno dodeljeno, brišem lock.");
            $lock->delete();
        }

        // Ažuriranje
        $rezervacija->update($validated);
        $rezervacija->load('let', 'user');

        Log::info('Rezervacija uspešno ažurirana', $rezervacija->toArray());
        Log::info('--- UPDATE END ---');

        return response()->json($rezervacija, 200);

    } catch (\Exception $e) {
        Log::error('Greška u update metodi: ' . $e->getMessage());
        return response()->json([
            'error' => $e->getMessage(),
        ], 400);
    }
}




}
