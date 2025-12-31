<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cafes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('description')->nullable();
            $table->string('open_hours')->nullable();
            $table->enum('wifi_status', ['fast', 'standard', 'slow', 'none'])->default('standard');
            $table->enum('socket_status', ['many', 'few', 'none'])->default('few');
            $table->text('parking_info')->nullable();
            $table->text('toilet_info')->nullable();
            $table->boolean('musholla_status')->default(false);
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cafes');
    }
};
