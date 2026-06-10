<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    /**
     * Valida as credenciais (já limpas) e gera o Token Sanctum
     */
    public function login(array $validated)
    {
        $user = $this->userRepository->findByEmail($validated['email']);

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
