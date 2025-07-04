<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jawaban extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'jawaban_siswa';
    protected $fillable = ['siswa_id', 'soal_id', 'jawaban', 'nilai'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }
    // use HasFactory, HasUuids;

    // protected $table = 'jawaban_siswa';
    // protected $fillable = [
    //     'siswa_id',
    //     'soal_id',
    //     'jawaban',
    //     'nilai',
    // ];

    // public function siswa()
    // {
    //     return $this->belongsTo(Siswa::class);
    // }

    // public function soal()
    // {
    //     return $this->belongsTo(Soal::class);
    // }
}
