<?php

namespace App\Services;

use App\Models\User;

class ProfileService
{
    /**
     * Update the profile of the authenticated user.
     */
    public function updateProfile(User $user, array $data): User
    {
        $user->update($data);

        return $user->load('telecomGroup');
    }
}
