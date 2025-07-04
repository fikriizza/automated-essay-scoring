<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');

        $query = MataPelajaran::query();

        if ($search) {
            $query->where('nama_mapel', 'like', "%{$search}%");
        }

        $mata_pelajaran = $query->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('MataPelajaran/Index', [
            'mata_pelajaran' => $mata_pelajaran,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }


    public function create()
    {
        return Inertia::render('MataPelajaran/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mapel' => ['required', 'string', 'max:255'],
        ]);

        MataPelajaran::create($validated);

        return to_route('mata_pelajaran.index')->with('success', 'MataPelajaran berhasil ditambahkan');
    }

    public function destroy($id)
    {
        $mata_pelajaran = MataPelajaran::findOrFail($id);
        $mata_pelajaran->delete();

        return to_route('mata_pelajaran.index')->with('success', 'MataPelajaran berhasil dihapus.');
    }

    public function edit($id)
    {
        $mata_pelajaran = MataPelajaran::findOrFail($id);

        return Inertia::render('MataPelajaran/Edit', [
            'mata_pelajaran' => $mata_pelajaran
        ]);
    }

    public function update(Request $request, $id)
    {
        $mata_pelajaran = MataPelajaran::findOrFail($id);

        $validated = $request->validate([
            'nama_mapel' => ['required', 'string', 'max:255'],
            'nisn' => ['nullable', 'string', 'max:255'],
        ]);

        $mata_pelajaran->update($validated);

        return to_route('mata_pelajaran.index')->with('success', 'MataPelajaran berhasil diupdate');
    }
}
