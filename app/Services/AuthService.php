<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Valida as credenciais (já limpas) e gera o Token Sanctum
     */
    public function login(array $validated)
    {
        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $deviceName = $validated['device_name'] ?? 'auth_token';
        $token = $user->createToken($deviceName)->plainTextToken;

        return [
            'token' => $token,
            'user' => $user->load('telecomGroup')
        ];
    }

    /**
     * Revoga o token atual do usuário
     */
    public function logout(User $user)
    {
        $user->currentAccessToken()->delete();
    }
}
