<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserService
{
    public function getAll()
    {
        return User::with('telecomGroup')->get();
    }

    public function createUser(array $data, User $authUser)
    {
        $isSuperAdmin = $authUser->role === 'super_admin';
        $allowedRoles = $isSuperAdmin 
            ? ['super_admin', 'admin', 'user'] 
            : ['admin', 'user'];

        $validated = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in($allowedRoles)],
            'telecom_group_id' => $isSuperAdmin ? 'nullable|exists:telecom_groups,id' : 'prohibited'
        ])->validate();

        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create($validated);

        return $user->load('telecomGroup');
    }

    public function getUser(User $user)
    {
        return $user->load('telecomGroup');
    }

    public function updateUser(User $user, array $data, User $authUser)
    {
        $isSuperAdmin = $authUser->role === 'super_admin';
        $allowedRoles = $isSuperAdmin ? ['super_admin', 'admin', 'user'] : ['admin', 'user'];

        $validated = Validator::make($data, [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => ['sometimes', Rule::in($allowedRoles)],
            'telecom_group_id' => $isSuperAdmin ? 'nullable|exists:telecom_groups,id' : 'prohibited'
        ])->validate();

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
