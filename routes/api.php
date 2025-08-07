<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LetController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\LockedSeatController;
use App\Http\Controllers\AuthController;

Route::get('/health-check', function() {
    return response()->json(['status' => 'ok']);
});

// Javne rute 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rute za letove
Route::apiResource('letovi', LetController::class)->only([
    'index', 'show'
]);

// Rute samo pregled
Route::get('/rezervacije', [RezervacijaController::class, 'index']);
Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);

// Rute za sedista
Route::get('/slobodna-sedista', [LockedSeatController::class, 'slobodnaSedista']);

// Zaštićene rute 
Route::middleware('auth:sanctum')->group(function () {
    // Auth rute
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Letovi
    Route::apiResource('letovi', LetController::class)->except([
        'index', 'show'
    ]);
    
    // Rezervacije
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
    
    // Zaključavanje sedista
    Route::post('/zakljucaj-sediste', [LockedSeatController::class, 'lock']);
});