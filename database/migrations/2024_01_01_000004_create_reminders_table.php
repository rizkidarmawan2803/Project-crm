<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_client_id')->constrained('lead_clients')->onDelete('cascade');
            $table->datetime('reminder_date');
            $table->text('description')->nullable();
            $table->tinyInteger('is_completed')->default(0)->comment('0: Belum, 1: Selesai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
