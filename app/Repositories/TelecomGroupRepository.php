<?php

namespace App\Repositories;

use App\Models\TelecomGroup;

class TelecomGroupRepository extends BaseRepository
{
    public function __construct(TelecomGroup $model)
    {
        parent::__construct($model);
    }
}
