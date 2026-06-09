<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService)
    {
    }

    /**
     * Realiza o login e retorna o Token Sanctum (Bearer Token)
     */
    public function login(Request $request)
    {
        $result = $this->authService->login($request->all());
        
        return response()->json($result);
    }

    /**
     * Realiza o logout revogando o token atual.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

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
