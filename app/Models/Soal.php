<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'soal';
    // protected $fillable = ['paket_soal_id', 'pertanyaan'];

    // public function paketSoal()
    // {
    //     return $this->belongsTo(PaketSoal::class);
    // }
    protected $fillable = ['ujian_id', 'pertanyaan'];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function jawabanSiswa()
    {
        return $this->hasMany(Jawaban::class);
    }
}
