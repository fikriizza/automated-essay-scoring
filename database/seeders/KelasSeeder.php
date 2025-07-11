<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tahunAjaranList = ['2025/2026'];

        foreach ($tahunAjaranList as $tahunAjaran) {
            for ($i = 1; $i <= 6; $i++) {
                Kelas::create([
                    // 'id' => Str::uuid(),
                    'nama_kelas' => "Kelas $i",
                    'tahun_ajaran' => $tahunAjaran,
                ]);
            }
        }
    }
}
