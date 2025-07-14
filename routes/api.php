<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LetController;
use App\Http\Controllers\RezervacijaController;

Route::apiResource('letovi', LetController::class);
Route::post('/rezervacije', [RezervacijaController::class, 'store']);
Route::get('/rezervacije', [RezervacijaController::class, 'index']);
Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
