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
            $table->string('first_name', 50);
            $table->string('last_name', 50)->nullable();
            $table->string('company_name', 100)->nullable();
            $table->string('phone', 20);
            $table->string('email', 255)->unique()->nullable();
            $table->string('product_interest', 100)->nullable();
            $table->enum('user_type', ['lead', 'client'])->default('lead');
            $table->enum('lead_status', [
                'new',
                'contacted',
                'follow_up',
                'proposal',
                'negotiation',
                'closed_won',
                'closed_lost'
            ])->default('new');
            $table->datetime('created_at');
            $table->datetime('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_clients');
    }
};
