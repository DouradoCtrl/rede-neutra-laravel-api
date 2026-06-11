<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['name', 'slug', 'active'])]
class TelecomGroup extends Model
{
    use HasFactory;

    /**
     * Get the users for the telecom group.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
