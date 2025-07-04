<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class KelasSiswa extends Model
{
    use HasUuids;
    protected $table = 't_kelas_siswa';
    protected $fillable = ['kelas_id', 'siswa_id'];
}
