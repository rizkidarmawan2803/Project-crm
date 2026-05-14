<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationLog extends Model
{
    use HasFactory;

    protected $table = 'communication_logs';

    protected $fillable = [
        'lead_client_id',
        'user_id',
        'channel',
        'message',
        'contacted_at',
    ];

    protected $casts = [
        'contacted_at' => 'datetime',
    ];

    // Relasi ke lead_clients
    public function leadClient()
    {
        return $this->belongsTo(LeadClient::class, 'lead_client_id');
    }

    // Relasi ke users (sales)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
