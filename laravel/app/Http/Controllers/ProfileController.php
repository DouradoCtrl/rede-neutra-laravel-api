<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Services\ProfileService;
use App\Http\Resources\UserResource;
use App\Http\Resources\PersonalAccessTokenResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private ProfileService $profileService)
    {
    }

    /**
     * Update the authenticated user's profile name and email.
     */
    public function update(UpdateProfileRequest $request)
    {
        $updatedUser = $this->profileService->updateProfile($request->user(), $request->validated());

        return $this->successResponse(
            new UserResource($updatedUser),
            'Perfil atualizado com sucesso.',
            200
        );
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $this->profileService->updatePassword($request->user(), $request->validated('password'));

        return $this->successResponse(
            null,
            'Senha atualizada com sucesso.',
            200
        );
    }

    /**
     * List active session tokens for the authenticated user.
     */
    public function tokens(Request $request)
    {
        $tokens = $this->profileService->tokens($request->user());

        return $this->successResponse(
            PersonalAccessTokenResource::collection($tokens),
            'Tokens recuperados com sucesso.',
            200
        );
    }

    /**
     * Revoke a specific session token for the authenticated user.
     */
    public function revokeToken(Request $request, $id)
    {
        $result = $this->profileService->revokeToken($request->user(), (int)$id);

        if ($result === 'self_revocation') {
            return $this->errorResponse('Você não pode revogar a sua sessão atual.', 400);
        }

        if ($result === 'not_found') {
            return $this->errorResponse('Sessão não encontrada.', 404);
        }

        return $this->successResponse(
            null,
            'Sessão revogada com sucesso.',
            200
        );
    }
}
