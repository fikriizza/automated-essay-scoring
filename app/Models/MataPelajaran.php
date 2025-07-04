<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'mata_pelajaran';
    protected $fillable = ['nama_mapel'];

    public function ujians()
    {
        return $this->hasMany(Ujian::class);
    }
}
