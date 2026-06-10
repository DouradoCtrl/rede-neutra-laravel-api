<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Quem pode listar usuários? (Super admin e Admin)
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    /**
     * Quem pode ver o perfil de um usuário específico?
     */
    public function view(User $user, User $model): bool
    {
        if ($user->role === 'super_admin') return true;
        
        // Admins podem ver usuários do mesmo grupo
        if ($user->role === 'admin') {
            return $user->telecom_group_id === $model->telecom_group_id;
        }

        return false;
    }

    /**
     * Quem pode criar usuários?
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    /**
     * Quem pode atualizar um usuário?
     */
    public function update(User $user, User $model): bool
    {
        if ($user->role === 'super_admin') return true;
        
        // Admins podem atualizar usuários do próprio grupo
        if ($user->role === 'admin') {
            // Um admin não pode modificar a conta da Kayros Link (prevenção)
            if ($model->role === 'super_admin') return false;
            
            return $user->telecom_group_id === $model->telecom_group_id;
        }

        return false;
    }

    /**
     * Quem pode deletar um usuário?
     */
    public function delete(User $user, User $model): bool
    {
        // Ninguém pode se auto-excluir
        if ($user->id === $model->id) {
            return false;
        }

        if ($user->role === 'super_admin') {
            return true; // Pode excluir outros super_admin, admin ou user
        }

        if ($user->role === 'admin') {
            // Admin não pode excluir um super admin (hierarquia acima)
            if ($model->role === 'super_admin') return false;

            return $user->telecom_group_id === $model->telecom_group_id;
        }

        return false;
    }
}
