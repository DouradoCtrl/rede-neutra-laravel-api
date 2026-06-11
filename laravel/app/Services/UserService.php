<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function getAll()
    {
        return $this->userRepository->getAllWithGroup();
    }

    public function createUser(array $validated, User $authUser)
    {
        $validated['password'] = Hash::make($validated['password']);
        
        $user = $this->userRepository->create($validated);

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

        $this->userRepository->update($user, $validated);

        return $user->fresh('telecomGroup');
    }

    public function deleteUser(User $user)
    {
        $this->userRepository->delete($user);
    }
}
