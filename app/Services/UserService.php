<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAll()
    {
        return User::with('telecomGroup')->get();
    }

    public function createUser(array $validated, User $authUser)
    {
        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create($validated);

        return $user->load('telecomGroup');
    }

    public function getUser(User $user)
    {
        return $user->load('telecomGroup');
    }

    public function updateUser(User $user, array $validated)
    {
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $user->fresh('telecomGroup');
    }

    public function deleteUser(User $user)
    {
        $user->delete();
    }
}
