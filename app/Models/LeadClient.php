<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadClient extends Model
{
    use HasFactory;

    protected $table = 'lead_clients';

    protected $fillable = [
        'sales_id',
        'first_name',
        'last_name',
        'company_name',
        'phone',
        'email',
        'product_interest',
        'user_type',
        'lead_status',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke users (sales)
    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    // Relasi ke communication_logs
    public function communicationLogs()
    {
        return $this->hasMany(CommunicationLog::class, 'lead_client_id');
    }

    // Relasi ke reminders
    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'lead_client_id');
    }

    // Accessor: full name
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    // Scope: hanya lead
    public function scopeLead($query)
    {
        return $query->where('user_type', 'lead');
    }

    // Scope: hanya client
    public function scopeClient($query)
    {
        return $query->where('user_type', 'client');
    }
}
