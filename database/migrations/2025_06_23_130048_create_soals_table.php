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
        Schema::create('soal', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('ujian_id');
            $table->text('pertanyaan');
            $table->timestamps();

            $table->foreign('ujian_id')->references('id')->on('ujian')->onDelete('cascade');
        });

        // Schema::create('jawaban_siswa', function (Blueprint $table) {
        //     $table->uuid('id')->primary();
        //     $table->uuid('siswa_id');
        //     $table->uuid('soal_id');
        //     $table->text('jawaban');
        //     $table->integer('nilai')->nullable();
        //     $table->timestamps();

        //     $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
        //     $table->foreign('soal_id')->references('id')->on('soal')->onDelete('cascade');
        //     $table->unique(['siswa_id', 'soal_id']);
        // });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soals');
    }
};
