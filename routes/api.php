<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TelecomGroupController;
use App\Http\Controllers\UserController;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
        
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{user}', [UserController::class, 'show']);
            Route::put('/{user}', [UserController::class, 'update']);
            Route::delete('/{user}', [UserController::class, 'destroy']);
        });

        Route::prefix('telecom-groups')->group(function () {
            Route::get('/', [TelecomGroupController::class, 'index']);
            Route::post('/', [TelecomGroupController::class, 'store']);
            Route::get('/{telecomGroup}', [TelecomGroupController::class, 'show']);
            Route::put('/{telecomGroup}', [TelecomGroupController::class, 'update']);
            Route::delete('/{telecomGroup}', [TelecomGroupController::class, 'destroy']);
        });
    });
});