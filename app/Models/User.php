<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'is_admin',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_admin'  => 'boolean',
        'password'  => 'hashed',
    ];

    // Relasi ke lead_clients
    public function leadClients()
    {
        return $this->hasMany(LeadClient::class, 'sales_id');
    }

    // Relasi ke communication_logs
    public function communicationLogs()
    {
        return $this->hasMany(CommunicationLog::class, 'user_id');
    }

    // Helper: cek apakah admin
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    // Helper: cek apakah sales
    public function isSales(): bool
    {
        return $this->is_admin === false;
    }

    // Accessor: full name
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
