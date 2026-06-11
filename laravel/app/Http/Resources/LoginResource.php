<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    /**
     * Transforma o recurso em um array.
     */
    public function toArray(Request $request): array
    {
        return [
            'token' => $this['token'],
            'user' => new UserResource($this['user']),
        ];
    }
}
