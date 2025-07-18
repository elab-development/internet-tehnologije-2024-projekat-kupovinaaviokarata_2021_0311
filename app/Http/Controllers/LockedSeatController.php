<?php

namespace App\Http\Controllers;

use App\Models\LockedSeat;
use App\Models\Let;
use App\Models\Rezervacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LockedSeatController extends Controller

{

    public function lock(Request $request)
{
    $validated = $request->validate([
        'let_id' => 'required|exists:lets,id',
        'broj_sedista' => 'required|integer',
    ]);

    $existingLock = LockedSeat::where('let_id', $validated['let_id'])
        ->where('broj_sedista', $validated['broj_sedista'])
        ->where('locked_until', '>', now())
        ->first();

    if ($existingLock) {
        return response()->json([
            'error' => 'Sedište je već privremeno zaključano.'
        ], 409);
    }

    
    $lock = LockedSeat::create([
        'let_id' => $validated['let_id'],
        'broj_sedista' => $validated['broj_sedista'],
        'locked_until' => now()->addMinutes(5),
    ]);

    return response()->json([
        'message' => 'Sedište je uspešno zaključano na 5 minuta.',
        'lock' => $lock,
    ], 201);
}


public function slobodnaSedista(Request $request)
{
    $letId = $request->query('let_id');

    if (!$letId) {
        return response()->json(['error' => 'Let ID je obavezan parametar.'], 400);
    }

    $let = Let::find($letId);
    if (!$let) {
        return response()->json(['error' => 'Let nije pronađen.'], 404);
    }

    $svaSedista = range(1, $let->broj_mesta);

    $rezervisana = Rezervacija::where('let_id', $letId)->pluck('broj_sedista')->toArray();

    $zakljucana = LockedSeat::where('let_id', $letId)
        ->where('locked_until', '>', now())
        ->pluck('broj_sedista')
        ->toArray();

    $slobodna = array_values(array_diff($svaSedista, $rezervisana, $zakljucana));

    return response()->json([
        'let_id' => $letId,
        'slobodna_sedista' => $slobodna
    ]);
}




}
