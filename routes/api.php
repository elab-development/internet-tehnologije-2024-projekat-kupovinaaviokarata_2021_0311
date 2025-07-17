<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LetController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\LockedSeatController;

Route::apiResource('letovi', LetController::class);
Route::post('/rezervacije', [RezervacijaController::class, 'store']);
Route::get('/rezervacije', [RezervacijaController::class, 'index']);
Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
Route::post('/zakljucaj-sediste', [\App\Http\Controllers\LockedSeatController::class, 'lock']);
