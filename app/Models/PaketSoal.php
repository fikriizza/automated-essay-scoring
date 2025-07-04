<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketSoal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'paket_soal';
    protected $fillable = ['ujian_id', 'kelas_id', 'mata_pelajaran_id'];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }
}
