<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LetController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\LockedSeatController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);


Route::get('/letovi', [LetController::class, 'index']);
Route::get('/letovi/{id}', [LetController::class, 'show']);


Route::get('/slobodna-sedista', [LockedSeatController::class, 'slobodnaSedista']);


Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    
    Route::apiResource('letovi', LetController::class)->only(['store','update','destroy']);

   
    Route::get('/rezervacije', [RezervacijaController::class, 'index']);      
    Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);

    
    Route::post('/zakljucaj-sediste', [LockedSeatController::class, 'lock']);
});