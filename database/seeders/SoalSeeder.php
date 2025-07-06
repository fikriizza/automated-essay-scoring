<?php

namespace Database\Seeders;

use App\Models\Soal;
use App\Models\Ujian;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SoalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ujians = Ujian::with(['kelas', 'mataPelajaran'])->get();

        foreach ($ujians as $ujian) {
            $kelas = $ujian->kelas;
            $mapel = $ujian->mataPelajaran->nama_mapel;
            $jenis = $ujian->nama_ujian;
            $tahun = $kelas->tahun_ajaran;
            $tingkat = $kelas->nama_kelas;

            $soals = $this->generateSoals($mapel, $jenis, $tingkat, $tahun);

            foreach ($soals as $pertanyaan) {
                Soal::create([
                    'ujian_id' => $ujian->id,
                    'pertanyaan' => $pertanyaan,
                ]);
            }
        }
    }

    private function generateSoals($mapel, $jenis, $kelas, $tahun): array
    {
        // Contoh soal berdasarkan kombinasi
        if ($mapel === 'IPA') {
            return [
                "Apa perbedaan antara makhluk hidup dan benda mati? Jelaskan ciri-ciri masing-masing! ($kelas - $tahun - $jenis)",
                "Sebutkan dan jelaskan fungsi bagian-bagian utama dari tumbuhan! ($kelas - $tahun - $jenis)",
            ];
        } elseif ($mapel === 'IPS') {
            return [
                "Jelaskan apa yang dimaksud dengan lingkungan alam dan lingkungan buatan! Berikan contohnya! ($kelas - $tahun - $jenis)",
                "Mengapa kita harus menjaga kebersihan lingkungan sekolah? Berikan alasannya! ($kelas - $tahun - $jenis)",
            ];
        }

        return [
            "Soal 1 default untuk $mapel $jenis ($kelas - $tahun)",
            "Soal 2 default untuk $mapel $jenis ($kelas - $tahun)",
        ];
    }
}
