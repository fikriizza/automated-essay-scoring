<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Jawaban;
use App\Models\Siswa;
use App\Models\Ujian;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ManageJawabanController extends Controller
{
    // public function index()
    // {
    //     // Tampilkan daftar ujian
    //     $ujians = Ujian::with('kelas', 'mataPelajaran')->get();

    //     return Inertia::render('ManageJawaban/Index', [
    //         'ujians' => $ujians
    //     ]);
    // }
    public function index(Request $request)
    {
        $query = Ujian::with('kelas', 'mataPelajaran')
            ->when(
                $request->search,
                fn($q) =>
                $q->where('nama_ujian', 'like', '%' . $request->search . '%')
            );

        $ujians = $query->paginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('ManageJawaban/Index', [
            'ujians' => $ujians,
            'filters' => [
                'search' => $request->search ?? '',
                'per_page' => $request->per_page ?? 10,
            ],
        ]);
    }


    public function show($ujianId)
    {
        // $ujian = Ujian::with('kelas', 'mataPelajaran')->findOrFail($ujianId);
        $ujian = Ujian::with([
            'kelas.siswa.user', // tambahkan relasi siswas di dalam kelas
            'mataPelajaran',
            'soals',
        ])->findOrFail($ujianId);
        // Ambil siswa yang mengikuti ujian ini
        $siswas = $ujian->kelas->siswa;

        // Ambil jawaban mereka
        $jawabans = Jawaban::with('soal', 'siswa')
            ->whereIn('siswa_id', $siswas->pluck('id'))
            ->whereIn('soal_id', $ujian->soals->pluck('id'))
            ->get();

        return Inertia::render('ManageJawaban/Show', [
            'ujian' => $ujian,
            'jawabans' => $jawabans->groupBy('siswa_id'),
            'siswas' => $siswas,
        ]);
    }

    public function detailSiswa($ujianId, $siswaId)
    {
        $ujian = Ujian::with('soals', 'kelas', 'mataPelajaran')->findOrFail($ujianId);
        // $siswa = Siswa::findOrFail($siswaId);
        $siswa = Siswa::with('user')->findOrFail($siswaId);


        $jawabans = Jawaban::with('soal')
            ->where('siswa_id', $siswaId)
            ->whereIn('soal_id', $ujian->soals->pluck('id'))
            ->get()
            ->keyBy('soal_id');

        return Inertia::render('ManageJawaban/DetailSiswa', [
            'ujian' => $ujian,
            'siswa' => $siswa,
            'jawabans' => $jawabans,
        ]);
    }
    // public function nilaiOtomatis($ujianId, $siswaId)
    // {
    //     $ujian = Ujian::with('soals')->findOrFail($ujianId);
    //     $siswa = Siswa::findOrFail($siswaId);

    //     $jawabanSiswa = Jawaban::where('siswa_id', $siswaId)
    //         ->whereIn('soal_id', $ujian->soals->pluck('id'))
    //         ->with('soal')
    //         ->get();

    //     $data = $jawabanSiswa->map(fn($j) => [
    //         'soal_id' => $j->soal_id,
    //         'soal' => $j->soal->pertanyaan,
    //         'jawaban' => $j->jawaban,
    //     ])->toArray();

    //     $penilaian = GroqService::nilaiJawaban($data);

    //     // Update skor ke DB
    //     DB::transaction(function () use ($penilaian) {
    //         foreach ($penilaian as $item) {
    //             Jawaban::where('soal_id', $item['soal_id'])
    //                 ->update(['skor' => $item['skor']]);
    //         }
    //     });

    //     return back()->with('success', 'Penilaian otomatis berhasil dilakukan.');
    // }
    // public function nilaiOtomatis($ujianId, $siswaId)
    // {
    //     $ujian = Ujian::with('soals')->findOrFail($ujianId);
    //     $siswa = Siswa::findOrFail($siswaId);

    //     $jawabanSiswa = Jawaban::where('siswa_id', $siswaId)
    //         ->whereIn('soal_id', $ujian->soals->pluck('id'))
    //         ->with('soal')
    //         ->get();

    //     $data = $jawabanSiswa->map(fn($j) => [
    //         'soal_id' => $j->soal_id,
    //         'soal' => $j->soal->pertanyaan,
    //         'jawaban' => $j->jawaban,
    //     ])->toArray();

    //     $response = GroqService::nilaiJawaban($data);

    //     // Ambil content string JSON dari response Groq
    //     $message = $response['choices'][0]['message']['content'] ?? null;

    //     if (!$message) {
    //         return back()->withErrors(['msg' => 'Gagal mendapatkan respons dari Groq.']);
    //     }

    //     // Parse JSON ke array PHP
    //     $parsed = json_decode($message, true);

    //     if (!isset($parsed['penilaian'])) {
    //         return back()->withErrors(['msg' => 'Format penilaian tidak valid dari Groq.']);
    //     }

    //     // Update skor ke DB
    //     DB::transaction(function () use ($parsed, $siswaId) {
    //         foreach ($parsed['penilaian'] as $item) {
    //             Jawaban::where('soal_id', $item['soal_id'])
    //                 ->where('siswa_id', $siswaId)
    //                 ->update(['skor' => $item['skor']]);
    //         }
    //     });

    //     return back()->with('success', 'Penilaian otomatis berhasil dilakukan.');
    // }

    // public function nilaiOtomatis($ujianId, $siswaId)
    // {
    //     $ujian = Ujian::with('soals')->findOrFail($ujianId);
    //     $siswa = Siswa::findOrFail($siswaId);

    //     $jawabanSiswa = Jawaban::where('siswa_id', $siswaId)
    //         ->whereIn('soal_id', $ujian->soals->pluck('id'))
    //         ->with('soal')
    //         ->get();

    //     $data = $jawabanSiswa->map(fn($j) => [
    //         'soal_id' => $j->soal_id,
    //         'soal' => $j->soal->pertanyaan,
    //         'jawaban' => $j->jawaban,
    //     ])->toArray();

    //     Log::info('📝 Payload dikirim ke Groq:', $data);

    //     $response = GroqService::nilaiJawaban($data);

    //     Log::info('📩 Full response dari Groq:', $response);

    //     // Ambil content string JSON dari response Groq
    //     $message = $response['choices'][0]['message']['content'] ?? null;

    //     Log::info('📄 Konten JSON dari Groq:', ['content' => $message]);

    //     if (!$message) {
    //         Log::error('❌ Gagal mendapatkan message dari Groq.');
    //         return back()->withErrors(['msg' => 'Gagal mendapatkan respons dari Groq.']);
    //     }

    //     $parsed = json_decode($message, true);

    //     if (!isset($parsed['penilaian'])) {
    //         Log::error('❌ Penilaian tidak ditemukan dalam konten Groq.', ['message' => $message]);
    //         return back()->withErrors(['msg' => 'Format penilaian tidak valid dari Groq.']);
    //     }

    //     Log::info('✅ Penilaian yang akan diupdate:', $parsed['penilaian']);

    //     // Update skor ke DB
    //     DB::transaction(function () use ($parsed, $siswaId) {
    //         foreach ($parsed['penilaian'] as $item) {
    //             Jawaban::where('soal_id', $item['soal_id'])
    //                 ->where('siswa_id', $siswaId)
    //                 ->update(['skor' => $item['skor']]);
    //         }
    //     });

    //     Log::info('✅ Skor berhasil disimpan ke database.');

    //     return back()->with('success', 'Penilaian otomatis berhasil dilakukan.');
    // }
    public function nilaiOtomatis($ujianId, $siswaId)
    {
        $ujian = Ujian::with('soals')->findOrFail($ujianId);
        $siswa = Siswa::findOrFail($siswaId);

        $jawabanSiswa = Jawaban::where('siswa_id', $siswaId)
            ->whereIn('soal_id', $ujian->soals->pluck('id'))
            ->with('soal')
            ->get();

        $data = $jawabanSiswa->map(fn($j) => [
            'soal_id' => $j->soal_id,
            'soal' => $j->soal->pertanyaan,
            'jawaban' => $j->jawaban,
        ])->toArray();

        try {
            $penilaian = GroqService::nilaiJawaban($data);
        } catch (\Throwable $e) {
            Log::error('❌ Gagal mendapatkan respons dari Groq.', [
                'exception' => $e->getMessage()
            ]);
            return back()->withErrors(['msg' => 'Gagal mendapatkan respons dari Groq.']);
        }

        $validIds = collect($data)->pluck('soal_id')->all();

        $penilaianFiltered = collect($penilaian)
            ->filter(fn($item) => in_array($item['soal_id'], $validIds))
            ->all();

        if (empty($penilaianFiltered)) {
            Log::error('❌ Tidak ada skor yang valid untuk diperbarui.');
            return back()->withErrors(['msg' => 'Tidak ada penilaian yang valid.']);
        }


        // Update skor ke DB
        DB::transaction(function () use ($penilaianFiltered, $siswaId) {
            foreach ($penilaianFiltered as $item) {
                Jawaban::where('soal_id', $item['soal_id'])
                    ->where('siswa_id', $siswaId)
                    ->update(['skor' => $item['skor']]);
            }
        });

        return back()->with('success', 'Penilaian otomatis berhasil dilakukan.');
    }
}
