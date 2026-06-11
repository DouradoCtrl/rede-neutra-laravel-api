<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTelecomGroupRequest extends FormRequest
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
        $telecomGroup = $this->route('telecomGroup');
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:telecom_groups,slug,' . $telecomGroup->id],
            'active' => ['required', 'boolean'],
        ];
    }
}
