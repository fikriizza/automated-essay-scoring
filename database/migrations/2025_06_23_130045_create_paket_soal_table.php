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
        // Schema::create('paket_soal', function (Blueprint $table) {
        //     $table->uuid('id')->primary();
        //     $table->uuid('ujian_id');
        //     $table->uuid('kelas_id');
        //     $table->uuid('mata_pelajaran_id');
        //     $table->timestamps();

        //     $table->foreign('ujian_id')->references('id')->on('ujian')->onDelete('cascade');
        //     $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('cascade');
        //     $table->foreign('mata_pelajaran_id')->references('id')->on('mata_pelajaran')->onDelete('cascade');

        //     $table->unique(['ujian_id', 'kelas_id', 'mata_pelajaran_id']);
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
