<?php

namespace App\Http\Controllers;

use App\Models\LockedSeat;
use Illuminate\Http\Request;

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
}
