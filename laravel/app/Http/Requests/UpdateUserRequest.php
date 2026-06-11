<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Retorna as regras de validação aplicadas à requisição.
     */
    public function rules(): array
    {
        $user = $this->route('user');
        $isSuperAdmin = $this->user()->role === 'super_admin';
        $allowedRoles = $isSuperAdmin ? ['super_admin', 'admin', 'user'] : ['admin', 'user'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['required', 'string', 'min:8'],
            'role' => [
                'sometimes',
                Rule::in($allowedRoles),
                function ($attribute, $value, $fail) use ($user) {
                    if ($user->id === $this->user()->id && $value !== $user->role) {
                        $fail('Você não pode alterar o seu próprio nível de permissão.');
                    }
                }
            ],
            'telecom_group_id' => $isSuperAdmin ? ['nullable', 'exists:telecom_groups,id'] : ['prohibited']
        ];
    }
}
