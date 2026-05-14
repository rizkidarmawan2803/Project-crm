<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $table = 'reminders';

    protected $fillable = [
        'lead_client_id',
        'reminder_date',
        'description',
        'is_completed',
    ];

    protected $casts = [
        'reminder_date' => 'datetime',
        'is_completed'  => 'boolean',
    ];

    // Relasi ke lead_clients
    public function leadClient()
    {
        return $this->belongsTo(LeadClient::class, 'lead_client_id');
    }

    // Scope: belum selesai
    public function scopePending($query)
    {
        return $query->where('is_completed', 0);
    }

    // Scope: sudah selesai
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', 1);
    }
}
