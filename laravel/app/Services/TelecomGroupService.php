<?php

namespace App\Services;

use App\Models\TelecomGroup;
use App\Repositories\TelecomGroupRepository;
use Illuminate\Support\Str;

class TelecomGroupService
{
    public function __construct(
        protected TelecomGroupRepository $telecomGroupRepository
    ) {}

    public function getAll()
    {
        return $this->telecomGroupRepository->getAll();
    }

    public function createGroup(array $validated)
    {
        return $this->telecomGroupRepository->create([
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
        $data = [];
        if (isset($validated['name'])) $data['name'] = $validated['name'];
        if (isset($validated['slug'])) $data['slug'] = $validated['slug'];
        if (isset($validated['active'])) $data['active'] = $validated['active'];
        
        if (!empty($data)) {
            $this->telecomGroupRepository->update($telecomGroup, $data);
        }

        return $telecomGroup;
    }

    public function deleteGroup(TelecomGroup $telecomGroup)
    {
        $this->telecomGroupRepository->delete($telecomGroup);
    }
}
