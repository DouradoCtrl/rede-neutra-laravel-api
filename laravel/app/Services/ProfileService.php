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

    /**
     * Retrieve active session tokens for the user.
     */
    public function tokens(User $user)
    {
        return $user->tokens()->orderBy('created_at', 'desc')->get();
    }

    /**
     * Revoke a specific session token for the user.
     */
    public function revokeToken(User $user, int $tokenId): string
    {
        // Prevent self-revocation
        if ($user->currentAccessToken()?->id === $tokenId) {
            return 'self_revocation';
        }

        $token = $user->tokens()->find($tokenId);

        if (!$token) {
            return 'not_found';
        }

        $token->delete();

        return 'success';
    }
}
