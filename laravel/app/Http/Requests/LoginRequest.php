<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
        return [
            'email' => ['required', 'email'],
            'password' => [
                'required', 
                'string', 
                'min:8',
            ],
            'device_name' => ['string', 'nullable']
        ];
    }
}
