<?php

namespace App\Services;

use App\Models\TelecomGroup;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TelecomGroupService
{
    public function getAll()
    {
        return TelecomGroup::all();
    }

    public function createGroup(array $data)
    {
        $validated = Validator::make($data, [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:telecom_groups',
            'active' => 'boolean'
        ])->validate();

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

    public function updateGroup(TelecomGroup $telecomGroup, array $data)
    {
        $validated = Validator::make($data, [
            'name' => 'string|max:255',
            'slug' => 'string|max:255|unique:telecom_groups,slug,' . $telecomGroup->id,
            'active' => 'boolean'
        ])->validate();

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
