<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunicationLog extends Model
{
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

    /**
     * Relasi ke lead/client.
     */
    public function leadClient()
    {
        return $this->belongsTo(LeadClient::class, 'lead_client_id');
    }

    /**
     * Relasi ke user (sales) yang menghubungi.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}