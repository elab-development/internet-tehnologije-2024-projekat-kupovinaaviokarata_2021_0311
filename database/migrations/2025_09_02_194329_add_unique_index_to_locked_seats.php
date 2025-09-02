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
        Schema::table('locked_seats', function (Blueprint $table) {
                $table->unique(['let_id', 'broj_sedista'], 'locked_seats_let_sediste_unique');
                $table->index(['let_id', 'locked_until'], 'locked_seats_let_until_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locked_seats', function (Blueprint $table) {
              $table->dropUnique('locked_seats_let_sediste_unique');
            $table->dropIndex('locked_seats_let_until_idx');
        });
    }
};
