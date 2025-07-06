<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Ujian;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MataPelajaranDanUjianSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 2 mata pelajaran: IPA & IPS
        $mapelIpa = MataPelajaran::create(['nama_mapel' => 'IPA']);
        $mapelIps = MataPelajaran::create(['nama_mapel' => 'IPS']);

        // Ambil semua kelas
        $kelasList = Kelas::all();

        foreach ($kelasList as $kelas) {
            // Untuk setiap kelas, buat UTS dan UAS untuk IPA
            Ujian::create([
                'nama_ujian' => 'UTS',
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapelIpa->id,
            ]);

            Ujian::create([
                'nama_ujian' => 'UAS',
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapelIpa->id,
            ]);

            // Dan juga UTS dan UAS untuk IPS
            Ujian::create([
                'nama_ujian' => 'UTS',
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapelIps->id,
            ]);

            Ujian::create([
                'nama_ujian' => 'UAS',
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapelIps->id,
            ]);
        }
    }
}
