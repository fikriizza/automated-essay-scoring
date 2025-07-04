<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'kelas';
    protected $fillable = ['nama_kelas', 'tahun_ajaran'];

    public function siswa()
    {
        return $this->belongsToMany(Siswa::class, 't_kelas_siswa')
            // ->withPivot('tahun_ajaran')
            ->withTimestamps();
    }
    public function ujians()
    {
        return $this->hasMany(Ujian::class);
    }
}
