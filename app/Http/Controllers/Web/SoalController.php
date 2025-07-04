<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\PaketSoal;
use App\Models\Soal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SoalController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $soals = Soal::with(['paketSoal.ujian', 'paketSoal.kelas', 'paketSoal.mataPelajaran'])
            ->when($search, function ($query, $search) {
                $query->where('pertanyaan', 'like', "%{$search}%")
                    ->orWhereHas('paketSoal.ujian', function ($q) use ($search) {
                        $q->where('nama_ujian', 'like', "%{$search}%");
                    });
            })
            ->paginate($perPage);

        return Inertia::render('Soal/Index', [
            'soals' => $soals,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        $paketSoals = PaketSoal::with(['ujian', 'kelas', 'mataPelajaran'])->get();

        return Inertia::render('Soal/Create', [
            'paketSoals' => $paketSoals,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'paket_soal_id' => 'required|exists:paket_soal,id',
            'pertanyaan' => 'required|string',
        ]);

        Soal::create($request->all());

        return redirect()->route('soal.index')
            ->with('success', 'Soal berhasil dibuat.');
    }

    public function show($id)
    {
        $soal = Soal::with(['paketSoal.ujian', 'paketSoal.kelas', 'paketSoal.mataPelajaran'])
            ->findOrFail($id);

        return Inertia::render('Soal/Show', [
            'soal' => $soal,
        ]);
    }

    public function edit($id)
    {
        $soal = Soal::with(['paketSoal'])->findOrFail($id);
        $paketSoals = PaketSoal::with(['ujian', 'kelas', 'mataPelajaran'])->get();

        return Inertia::render('Soal/Edit', [
            'soal' => $soal,
            'paketSoals' => $paketSoals,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'paket_soal_id' => 'required|exists:paket_soal,id',
            'pertanyaan' => 'required|string',
        ]);

        $soal = Soal::findOrFail($id);
        $soal->update($request->all());

        return redirect()->route('soal.index')
            ->with('success', 'Soal berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $soal = Soal::findOrFail($id);
        $soal->delete();

        return redirect()->route('soal.index')
            ->with('success', 'Soal berhasil dihapus.');
    }
}
