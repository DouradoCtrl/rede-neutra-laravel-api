<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\LoginResource;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService)
    {
    }

    /**
     * Realiza o login e retorna o Token Sanctum (Bearer Token)
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());
        
        return (new LoginResource($result))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Realiza o logout revogando o token atual.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Deslogado com sucesso'
        ], 200);
    }

    /**
     * Retorna os dados do usuário autenticado.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('telecomGroup');
        
        return (new UserResource($user))
            ->response()
            ->setStatusCode(200);
    }
}
