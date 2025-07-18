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
         Schema::create('rezervacijas', function (Blueprint $table) {
        $table->id();
        $table->string('ime_putnika');
        $table->string('email');
        $table->integer('broj_sedista');

        $table->foreignId('let_id')->constrained('lets')->onDelete('cascade');

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rezervacijas');
    }
};
