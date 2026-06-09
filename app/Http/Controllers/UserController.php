<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\UserService;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);
        
        return UserResource::collection($this->userService->getAll())
            ->response()
            ->setStatusCode(200);
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);
        $user = $this->userService->createUser($request->validated(), $request->user());
        
        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);
        $userData = $this->userService->getUser($user);
        
        return (new UserResource($userData))
            ->response()
            ->setStatusCode(200);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);
        $updatedUser = $this->userService->updateUser($user, $request->validated(), $request->user());
        
        return (new UserResource($updatedUser))
            ->response()
            ->setStatusCode(200);
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        $this->userService->deleteUser($user);
        
        return response()->json(['message' => 'Usuário deletado com sucesso.'], 200);
    }
}
