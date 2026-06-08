<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Realiza o login e retorna o Token Sanctum (Bearer Token)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['string', 'nullable']
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Gera o token de acesso
        $deviceName = $request->device_name ?? 'auth_token';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('telecomGroup')
        ]);
    }

    /**
     * Realiza o logout revogando o token atual.
     */
    public function logout(Request $request)
    {
        // Deleta o token que foi usado para autenticar esta requisição
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Deslogado com sucesso'
        ]);
    }

    /**
     * Retorna os dados do usuário autenticado.
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('telecomGroup')
        ]);
    }
}
