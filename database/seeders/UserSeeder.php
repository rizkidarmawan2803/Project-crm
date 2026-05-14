<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'first_name' => 'Admin',
            'last_name'  => 'CRM',
            'email'      => 'admin@crm.com',
            'password'   => Hash::make('password'),
            'is_admin'   => 1,
            'status'     => 'active',
        ]);

        // Sales 1
        User::create([
            'first_name' => 'Ali',
            'last_name'  => 'Akbar',
            'email'      => 'ali@crm.com',
            'password'   => Hash::make('password'),
            'is_admin'   => 0,
            'status'     => 'active',
        ]);

        // Sales 2
        User::create([
            'first_name' => 'Budi',
            'last_name'  => 'Santoso',
            'email'      => 'budi@crm.com',
            'password'   => Hash::make('password'),
            'is_admin'   => 0,
            'status'     => 'active',
        ]);
    }
}