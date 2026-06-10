<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Services\ProfileService;
use App\Http\Resources\UserResource;

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
}
