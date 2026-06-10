<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    /**
     * Update the profile of the authenticated user.
     */
    public function updateProfile(User $user, array $data): User
    {
        $this->userRepository->update($user, $data);

        return $user->load('telecomGroup');
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(User $user, string $newPassword): void
    {
        $this->userRepository->updatePassword($user, Hash::make($newPassword));
    }
}
