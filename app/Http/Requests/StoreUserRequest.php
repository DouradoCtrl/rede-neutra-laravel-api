<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
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
        $isSuperAdmin = $this->user()->role === 'super_admin';
        $allowedRoles = $isSuperAdmin 
            ? ['super_admin', 'admin', 'user'] 
            : ['admin', 'user'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in($allowedRoles)],
            'telecom_group_id' => $isSuperAdmin ? ['nullable', 'exists:telecom_groups,id'] : ['prohibited']
        ];
    }
}
