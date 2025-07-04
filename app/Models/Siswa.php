<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'siswa';
    protected $fillable = ['nisn', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function kelas()
    {

        return $this->belongsToMany(Kelas::class, 't_kelas_siswa')
            // ->withPivot('tahun_ajaran')
            ->withTimestamps();
    }
    public function jawabanSiswa()
    {
        return $this->hasMany(Jawaban::class);
    }
}
