<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusLog extends Model
{
    protected $table = 'status_logs';

    protected $fillable = [
        'lead_client_id',
        'user_id',
        'status_lama',
        'status_baru',
        'catatan',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke user yang melakukan perubahan status
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke data prospek/client
     */
    public function leadClient()
    {
        return $this->belongsTo(LeadClient::class, 'lead_client_id');
    }
}