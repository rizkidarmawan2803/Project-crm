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
        'nama_client',
        'company_name',
        'phone',
        'email',
        'product_interest',
        'sumber',
        'lead_status',
        'domisili',
        'alamat_lengkap',
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

    // Scope by status
    public function scopeBaru($query)
    {
        return $query->where('lead_status', 'Baru');
    }

    public function scopeDeal($query)
    {
        return $query->where('lead_status', 'Deal');
    }

    public function scopeAktif($query)
    {
        return $query->whereNotIn('lead_status', ['Deal', 'Belum Tertarik']);
    }
}