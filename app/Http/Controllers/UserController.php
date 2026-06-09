<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);
        return response()->json($this->userService->getAll(), 200);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', User::class);
        $user = $this->userService->createUser($request->all(), $request->user());
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);
        return response()->json($this->userService->getUser($user), 200);
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('update', $user);
        $updatedUser = $this->userService->updateUser($user, $request->all(), $request->user());
        return response()->json($updatedUser, 200);
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        $this->userService->deleteUser($user);
        return response()->json(['message' => 'Usuário deletado com sucesso.'], 200);
    }
}
