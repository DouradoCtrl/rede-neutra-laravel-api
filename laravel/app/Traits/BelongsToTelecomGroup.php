<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToTelecomGroup
{
    /**
     * Método inicializado automaticamente pelo Eloquent para a Trait.
     */
    protected static function bootBelongsToTelecomGroup(): void
    {
        // 1. Escopo Global para Filtragem (Leitura, Atualização, Exclusão)
        static::addGlobalScope('telecom_group', function (Builder $builder) {
            $user = auth()->user();

            if ($user) {
                // Se o usuário for Super Admin (Kayros Link), ignoramos o escopo
                // permitindo acesso irrestrito a todos os dados.
                if ($user->role === 'super_admin') {
                    return;
                }

                // Caso contrário (Parceiros), filtramos pelo grupo do usuário
                if ($user->telecom_group_id) {
                    $builder->where('telecom_group_id', $user->telecom_group_id);
                }
            }
        });

        // 2. Evento na Criação de Registros (Insert)
        static::creating(function ($model) {
            $user = auth()->user();

            // Se o usuário estiver logado e NÃO for super admin
            if ($user && $user->role !== 'super_admin') {
                // Forçamos o modelo a pertencer ao grupo do parceiro logado
                $model->telecom_group_id = $user->telecom_group_id;
            }
            // Se for super_admin, o sistema aceita o telecom_group_id que
            // vier preenchido na requisição (permitindo que a Kayros crie para parceiros).
        });
    }
}
