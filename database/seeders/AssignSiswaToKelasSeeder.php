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

        // Ambil data kelas berdasarkan tahun ajaran
        $kelasByTahun = Kelas::all()->groupBy('tahun_ajaran');

        // === TAHUN AJARAN 2024/2025 ===
        // Siswa urutan 6–10 masuk ke kelas 1 tahun 2024/2025
        // $index = 5; // karena urutan 6 berarti index ke-5
        // $kelas2024 = $kelasByTahun['2024/2025']->firstWhere('nama_kelas', 'Kelas 1');
        // for ($i = 0; $i < 5; $i++) {
        //     $siswa = $siswaList[$index++] ?? null;
        //     if ($siswa && $kelas2024) {
        //         $kelas2024->siswa()->attach($siswa->id);
        //     }
        // }

        // === TAHUN AJARAN 2025/2026 ===

        // 1. Isi kelas 1 tahun 2025/2026 dengan siswa urutan 1–5
        $kelas2025_1 = $kelasByTahun['2025/2026']->firstWhere('nama_kelas', 'Kelas 1');
        for ($i = 0; $i < 5; $i++) {
            $siswa = $siswaList[$i] ?? null;
            if ($siswa && $kelas2025_1) {
                $kelas2025_1->siswa()->attach($siswa->id);
            }
        }

        // 2. Pindahkan siswa dari kelas 1–5 tahun 2024/2025 ke kelas 2–6 tahun 2025/2026
        // for ($i = 1; $i <= 5; $i++) {
        //     $kelasLama = $kelasByTahun['2024/2025']->firstWhere('nama_kelas', "Kelas $i");
        //     $kelasBaru = $kelasByTahun['2025/2026']->firstWhere('nama_kelas', "Kelas " . ($i + 1));

        //     if ($kelasLama && $kelasBaru) {
        //         $siswaKelasLama = $kelasLama->siswa;
        //         foreach ($siswaKelasLama as $siswa) {
        //             $kelasBaru->siswa()->attach($siswa->id);
        //         }
        //     }
        // }
    }
}
