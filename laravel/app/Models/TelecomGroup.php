<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'active'])]
class TelecomGroup extends Model
{
    /**
     * Get the users for the telecom group.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
