<?php

namespace App\Services;

use App\Models\TelecomGroup;
use Illuminate\Support\Str;

class TelecomGroupService
{
    public function getAll()
    {
        return TelecomGroup::all();
    }

    public function createGroup(array $validated)
    {
        return TelecomGroup::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'active' => $validated['active'] ?? true,
        ]);
    }

    public function getGroup(TelecomGroup $telecomGroup)
    {
        return $telecomGroup->load('users');
    }

    public function updateGroup(TelecomGroup $telecomGroup, array $validated)
    {
        if (isset($validated['name'])) $telecomGroup->name = $validated['name'];
        if (isset($validated['slug'])) $telecomGroup->slug = $validated['slug'];
        if (isset($validated['active'])) $telecomGroup->active = $validated['active'];
        $telecomGroup->save();

        return $telecomGroup;
    }

    public function deleteGroup(TelecomGroup $telecomGroup)
    {
        $telecomGroup->delete();
    }
}
