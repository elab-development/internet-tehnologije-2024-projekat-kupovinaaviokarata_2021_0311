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
        Schema::create('locked_seats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('let_id');
            $table->unsignedInteger('broj_sedista');
          $table->timestamp('locked_until');


            $table->timestamps();
            $table->foreign('let_id')->references('id')->on('lets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locked_seats');
    }
};
