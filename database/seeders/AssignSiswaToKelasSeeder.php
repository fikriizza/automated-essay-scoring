<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignSiswaToKelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswaList = Siswa::orderBy('created_at')->get();

        // Ambil data kelas berdasarkan tahun ajaran dan urutan kelas
        $kelasByTahun = Kelas::all()->groupBy('tahun_ajaran');

        // === TAHUN AJARAN 2024/2025 ===
        // 5 siswa pertama: kelas 1 (2024)
        $index = 0;
        for ($i = 1; $i <= 6; $i++) {
            $kelas = $kelasByTahun['2024/2025']->firstWhere('nama_kelas', "Kelas $i");
            for ($j = 0; $j < 5; $j++) {
                $siswa = $siswaList[$index++] ?? null;
                if ($siswa && $kelas) {
                    $kelas->siswa()->attach($siswa->id);
                }
            }
        }

        // === TAHUN AJARAN 2025/2026 ===
        // Siswa dari kelas 1–5 tahun 2024/2025 dipindahkan ke kelas 2–6 tahun 2025/2026
        for ($i = 1; $i <= 5; $i++) {
            $kelasLama = $kelasByTahun['2024/2025']->firstWhere('nama_kelas', "Kelas $i");
            $kelasBaru = $kelasByTahun['2025/2026']->firstWhere('nama_kelas', "Kelas " . ($i + 1));

            $siswaKelasLama = $kelasLama->siswa()->get();

            foreach ($siswaKelasLama as $siswa) {
                if ($kelasBaru) {
                    $kelasBaru->siswa()->attach($siswa->id);
                }
            }
        }
    }
}
