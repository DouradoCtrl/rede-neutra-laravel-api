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

        // Usuários comuns podem ver apenas a si mesmos
        return $user->id === $model->id;
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

        // Um usuário comum só pode alterar a própria conta (senha, por ex)
        return $user->id === $model->id;
    }

    /**
     * Quem pode deletar um usuário?
     */
    public function delete(User $user, User $model): bool
    {
        if ($user->role === 'super_admin') return true;

        if ($user->role === 'admin') {
            // Admin não pode excluir um super admin nem a si próprio
            if ($model->role === 'super_admin') return false;
            if ($user->id === $model->id) return false;

            return $user->telecom_group_id === $model->telecom_group_id;
        }

        return false;
    }
}
