<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ujian';
    protected $fillable = [
        'nama_ujian',
        'mata_pelajaran_id',
        'kelas_id',
    ];

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }
}
