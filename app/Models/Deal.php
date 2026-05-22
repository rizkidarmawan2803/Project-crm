<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    protected $table = 'deals';

    protected $fillable = [
        'lead_client_id',
        'user_id',
        'payment_status',
        'deal_file',
        'catatan',
    ];

    public function leadClient()
    {
        return $this->belongsTo(LeadClient::class, 'lead_client_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}