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
        Schema::create('lets', function (Blueprint $table) {
            $table->id();
            $table->string('broj_leta');
        $table->string('polaziste');
        $table->string('odrediste');
        $table->dateTime('vreme_poletanja');
        $table->dateTime('vreme_sletanja');
        $table->integer('broj_mesta');
        $table->decimal('cena', 8, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lets');
    }
};
