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

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/letovi', [LetController::class,'store']);
    Route::put('/letovi/{id}', [LetController::class, 'update']);
    Route::delete('/letovi/{id}', [LetController::class, 'destroy']);
    Route::get('/rezervacije', [RezervacijaController::class, 'index']);      
    Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
    Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
});


 
    /*
Route::middleware('role:admin')->group(function () {
    Route::apiResource('letovi', LetController::class)->only(['store','update','destroy']);
    Route::get('/admin/rezervacije', [RezervacijaController::class, 'index']);
    Route::get('/admin/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::put('/admin/rezervacije/{id}', [RezervacijaController::class, 'update']);
});

Route::middleware('role:user')->group(function () {
        Route::get('/rezervacije', [RezervacijaController::class, 'index']);      
        Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
        Route::post('/rezervacije', [RezervacijaController::class, 'store']);
        Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
        Route::post('/zakljucaj-sediste', [LockedSeatController::class, 'lock']);
        Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
    });
*/
      //Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
      

});


Route::get('/slobodna-sedista', [LockedSeatController::class, 'slobodnaSedista']);
Route::delete('/locked-seats/cleanup', [LockedSeatController::class, 'cleanupExpired']);








//test
Route::get('/admin-only', function () {
    return response()->json(['message' => 'Dobrodošao admin!']);
})->middleware(['auth:sanctum', 'role:admin']);

Route::get('/user-only', function () {
    return response()->json(['message' => 'Dobrodošao korisniče!']);
})->middleware(['auth:sanctum', 'role:user']);