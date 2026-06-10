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
    public function __construct(
        private UserService $userService,
        )
    {
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);
        
        return $this->successResponse(
            UserResource::collection($this->userService->getAll()),
            'Lista de usuários obtida com sucesso.',
            200
        );
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);
        $user = $this->userService->createUser($request->validated(), $request->user());
        
        return $this->successResponse(
            new UserResource($user),
            'Usuário criado com sucesso.',
            201
        );
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);
        $userData = $this->userService->getUser($user);
        
        return $this->successResponse(
            new UserResource($userData),
            'Usuário obtido com sucesso.',
            200
        );
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);
        $updatedUser = $this->userService->updateUser($user, $request->validated());
        
        return $this->successResponse(
            new UserResource($updatedUser),
            'Usuário atualizado com sucesso.',
            200
        );
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        $this->userService->deleteUser($user);
        
        return $this->successResponse(
            null,
            'Usuário deletado com sucesso.',
            200
        );
    }
}
