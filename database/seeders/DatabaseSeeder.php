<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criação do usuário master da Kayros Link (Super Admin)
        User::updateOrCreate(
            ['email' => 'admin@kayroslink.com.br'],
            [
                'name' => 'Administrador Kayros Link',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'telecom_group_id' => null
            ]
        );
    }
}
