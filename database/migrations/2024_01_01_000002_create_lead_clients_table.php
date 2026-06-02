<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_id')->constrained('users')->onDelete('cascade');
            $table->string('nama_client', 50);
            $table->string('company_name', 100)->nullable();
            $table->string('phone', 20);
            $table->string('email', 255)->unique()->nullable();
            $table->string('product_interest', 100)->nullable();
            $table->string('sumber', 50);
            $table->enum('lead_status', [
                'Baru',
                'Dihubungi',
                'Negosiasi',
                'Deal',
                'Belum Tertarik'
            ])->default('Baru');
            $table->string('domisili', 50);
            $table->longText('alamat_lengkap');
            $table->datetime('created_at');
            $table->datetime('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_clients');
    }
};
