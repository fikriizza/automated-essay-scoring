<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\PaketSoal;
use App\Models\Ujian;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Soal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UjianController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $ujians = Ujian::with(['kelas', 'mataPelajaran'])
            ->when($search, function ($query, $search) {
                $query->where('nama_ujian', 'like', "%{$search}%")
                    ->orWhereHas('kelas', fn($q) => $q->where('nama_kelas', 'like', "%{$search}%"))
                    ->orWhereHas('mataPelajaran', fn($q) => $q->where('nama_mapel', 'like', "%{$search}%"));
            })
            ->paginate($perPage);

        return Inertia::render('Ujian/Index', [
            'ujians' => $ujians,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }


    public function create()
    {
        return Inertia::render('Ujian/Create', [
            'kelas' => Kelas::all(),
            'mataPelajarans' => MataPelajaran::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ujian' => 'required|string',
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
        ]);

        Ujian::create($request->all());

        return redirect()->route('ujian.index')->with('success', 'Ujian berhasil dibuat.');
    }


    public function show($id)
    {
        $ujian = Ujian::with(['kelas', 'mataPelajaran', 'soals'])->findOrFail($id);

        return Inertia::render('Ujian/Show', [
            'ujian' => $ujian,
        ]);
    }


    public function edit($id)
    {
        $ujian = Ujian::with(['kelas', 'mataPelajaran', 'soals'])->findOrFail($id);

        return Inertia::render('Ujian/Edit', [
            'ujian' => $ujian,
            'kelas' => Kelas::all(),
            'mataPelajarans' => MataPelajaran::all(),
        ]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_ujian' => 'required|string',
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
        ]);

        $ujian = Ujian::findOrFail($id);
        $ujian->update($request->only(['nama_ujian', 'kelas_id', 'mata_pelajaran_id']));

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil diperbarui.');
    }


    public function destroy($id)
    {
        $ujian = Ujian::findOrFail($id);
        $ujian->delete();

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dihapus.');
    }


    public function manageSoal($id)
    {
        $ujian = Ujian::with(['kelas', 'mataPelajaran', 'soals'])->findOrFail($id);

        return Inertia::render('Ujian/ManageSoal', [
            'ujian' => $ujian,
        ]);
    }

    public function storeSoal(Request $request, $id)
    {
        $request->validate(['pertanyaan' => 'required|string']);

        $ujian = Ujian::findOrFail($id);
        $ujian->soals()->create(['pertanyaan' => $request->pertanyaan]);

        return redirect()->route('ujian.manage_soal', $id)
            ->with('success', 'Soal berhasil ditambahkan.');
    }

    public function updateSoal(Request $request, $ujianId, $soalId)
    {
        $request->validate(['pertanyaan' => 'required|string']);

        $soal = Soal::where('ujian_id', $ujianId)->findOrFail($soalId);
        $soal->update(['pertanyaan' => $request->pertanyaan]);

        return redirect()->route('ujian.manage_soal', $ujianId)
            ->with('success', 'Soal berhasil diperbarui.');
    }

    public function destroySoal($ujianId, $soalId)
    {
        $soal = Soal::where('ujian_id', $ujianId)->findOrFail($soalId);
        $soal->delete();
        // $updatedSoal = Soal::where('ujian_id', $ujianId)->get();

        // return Inertia::render('Ujian/ManageSoal', [
        //     'ujian' => Ujian::findOrFail($ujianId),
        //     'soal' => $updatedSoal,
        //     'flash' => ['success' => 'Soal berhasil dihapus.'],
        // ]);
        return redirect()->route('ujian.manage_soal', $ujianId);
        // ->with('success', 'Soal berhasil dihapus.');
        // return Inertia::render('Ujian/ManageSoal', [
        //     'soal' => $soal,
        // ]);
    }
}
