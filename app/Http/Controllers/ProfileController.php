<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
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
}
