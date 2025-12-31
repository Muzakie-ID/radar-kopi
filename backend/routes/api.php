<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CafeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/cafes', [CafeController::class, 'index']);
Route::get('/cafes/{id}', [CafeController::class, 'show']);
Route::post('/cafes/{id}/reviews', [CafeController::class, 'storeReview']);
