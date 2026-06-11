<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function getAllWithGroup(): Collection
    {
        return $this->model->with('telecomGroup')->get();
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function updatePassword(User $user, string $password): bool
    {
        return $user->update(['password' => $password]);
    }
}
