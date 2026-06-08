<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Rota Pública
Route::post('/login', [AuthController::class, 'login']);

// Rotas Protegidas por Bearer Token (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Rotas de Gerenciamento de Parceiros (Somente Super Admin Kayros Link)
    Route::apiResource('telecom-groups', \App\Http\Controllers\TelecomGroupController::class);

    // Rotas de Gerenciamento de Usuários (Acessível conforme as regras da UserPolicy)
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
});
