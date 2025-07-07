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
    public function kerjakan($ujianId)
    {
        $user = Auth::user();
        $siswa = $user->siswa;

        $ujian = Ujian::with([
            'kelas',
            'mataPelajaran',
            'soals'
        ])->findOrFail($ujianId);

        if (!$siswa->kelas->contains('id', $ujian->kelas_id)) {
            abort(403, 'Anda tidak terdaftar di kelas ini.');
        }

        $jawabanSebelumnya = Jawaban::where('siswa_id', $siswa->id)
            ->whereIn('soal_id', $ujian->soals->pluck('id'))
            ->get()
            ->keyBy('soal_id');

        return Inertia::render('SoalUjian/KerjakanSoal', [
            'ujian' => $ujian,
            'jawabanSebelumnya' => $jawabanSebelumnya,
        ]);
    }

    public function simpanSemuaJawaban(Request $request, $ujianId)
    {
        $validated = $request->validate([
            'jawaban' => 'required|array',
            'jawaban.*.soal_id' => 'required|uuid|exists:soal,id',
            'jawaban.*.jawaban' => 'required|string',
        ]);

        $user = Auth::user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'User belum punya relasi siswa');
        }

        $ujian = Ujian::findOrFail($ujianId);

        if (!$siswa->kelas->contains('id', $ujian->kelas_id)) {
            abort(403, 'Anda tidak terdaftar di kelas ujian ini.');
        }

        foreach ($validated['jawaban'] as $item) {
            Jawaban::updateOrCreate(
                ['siswa_id' => $siswa->id, 'soal_id' => $item['soal_id']],
                ['id' => \Illuminate\Support\Str::uuid(), 'jawaban' => $item['jawaban']]
            );
        }

        return redirect()->route('soal.index')->with('success', 'Semua jawaban berhasil disimpan.');
    }

    public function daftarUjian()
    {
        $user = Auth::user();
        $siswa = $user->siswa;

        $kelasTerbaru = $siswa->kelas()
            ->orderByDesc('tahun_ajaran')
            ->first();

        if (!$kelasTerbaru) {
            return Inertia::render('SoalUjian/DaftarUjian', [
                'ujians' => [],
            ]);
        }

        $ujians = Ujian::with('kelas', 'mataPelajaran')
            ->where('kelas_id', $kelasTerbaru->id)
            ->get();

        return Inertia::render('SoalUjian/DaftarUjian', [
            'ujians' => $ujians,
        ]);
    }
}
