<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Jawaban;
use App\Models\Soal;
use App\Models\Ujian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JawabanController extends Controller
{
    // Tampilkan soal ujian untuk dijawab
    public function kerjakan($ujianId)
    {
        $user = Auth::user();
        $siswa = $user->siswa;

        // $ujian = Ujian::with(['soals', 'kelas'])->findOrFail($ujianId);
        $ujian = Ujian::with([
            'kelas',
            'mataPelajaran',
            // 'soals.paketSoal.mataPelajaran'
            'soals'
        ])->findOrFail($ujianId);
        // dd($ujian->toArray());

        // Cek apakah siswa tergabung dalam kelas ujian
        if (!$siswa->kelas->contains('id', $ujian->kelas_id)) {
            abort(403, 'Anda tidak terdaftar di kelas ini.');
        }

        // Ambil jawaban sebelumnya jika ada
        $jawabanSebelumnya = Jawaban::where('siswa_id', $siswa->id)
            ->whereIn('soal_id', $ujian->soals->pluck('id'))
            ->get()
            ->keyBy('soal_id');

        // return inertia('Ujian/Kerjakan', [
        //     'ujian' => $ujian,
        //     'soals' => $ujian->soals,
        //     'jawabanSebelumnya' => $jawabanSebelumnya,
        // ]);
        return Inertia::render('SoalUjian/KerjakanSoal', [
            'ujian' => $ujian,
            'jawabanSebelumnya' => $jawabanSebelumnya,
        ]);
    }

    // Simpan jawaban siswa untuk 1 soal
    public function simpanJawaban(Request $request, $soalId)
    {
        $request->validate([
            'jawaban' => 'required|string',
        ]);

        $user = Auth::user();
        $siswa = $user->siswa;
        $soal = Soal::findOrFail($soalId);

        // Cek apakah soal ini termasuk ujian kelas siswa
        $ujian = $soal->ujian;
        if (!$siswa->kelas->contains('id', $ujian->kelas_id)) {
            abort(403, 'Anda tidak terdaftar di kelas ini.');
        }

        Jawaban::updateOrCreate(
            ['siswa_id' => $siswa->id, 'soal_id' => $soal->id],
            ['jawaban' => $request->jawaban]
        );

        return back()->with('success', 'Jawaban berhasil disimpan.');
    }
    public function daftarUjian()
    {
        $user = Auth::user();
        $siswa = $user->siswa;

        // Ambil kelas siswa dengan tahun ajaran terbaru
        $kelasTerbaru = $siswa->kelas()
            ->orderByDesc('tahun_ajaran')
            ->first();

        if (!$kelasTerbaru) {
            return Inertia::render('SoalUjian/DaftarUjian', [
                'ujians' => [],
            ]);
        }

        // Ambil ujian berdasarkan kelas tersebut
        $ujians = Ujian::with('kelas', 'mataPelajaran')
            ->where('kelas_id', $kelasTerbaru->id)
            ->get();

        return Inertia::render('SoalUjian/DaftarUjian', [
            'ujians' => $ujians,
        ]);
    }
}
