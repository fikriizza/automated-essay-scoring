<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        // $perPage = (int) $request->input('per_page', 10);
        // $search = $request->input('search');

        // $query = Kelas::query();

        // if ($search) {
        //     $query->where('nama_kelas', 'like', "%{$search}%");
        // }

        // $kelas = $query->latest()
        //     ->paginate($perPage)
        //     ->withQueryString();

        // return Inertia::render('Kelas/Index', [
        //     'kelas' => $kelas,
        //     'filters' => [
        //         'search' => $search,
        //         'per_page' => $perPage,
        //     ],
        // ]);
        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'nama_kelas');
        $sortDirection = $request->input('sort_direction', 'asc');

        $query = Kelas::query();

        if ($search) {
            $query->where('nama_kelas', 'like', "%{$search}%");
        }

        if (in_array($sortBy, ['nama_kelas', 'tahun_ajaran']) && in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }

        $kelas = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Kelas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:255'],
            'tahun_ajaran' => ['required', 'string', 'max:255'],
        ]);

        Kelas::create($validated);

        return to_route('kelas.index')->with('success', 'Kelas berhasil ditambahkan');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return to_route('kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }

    public function edit($id)
    {
        $kelas = Kelas::findOrFail($id);

        return Inertia::render('Kelas/Edit', [
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:255'],
            'tahun_ajaran' => ['required', 'string', 'max:255'],
        ]);

        $kelas->update($validated);

        return to_route('kelas.index')->with('success', 'Kelas berhasil diupdate');
    }

    public function show(Kelas $kelas)
    {
        $siswa = $kelas->siswa()->with('kelas', 'user')->get();
        $kelas->load('siswa');

        $currentAcademicYear = $kelas->tahun_ajaran;

        // $allSiswas = Siswa::select('id', 'nama')
        $allSiswas = Siswa::with('user')
            ->whereNotIn('id', function ($query) use ($currentAcademicYear) {
                $query->select('siswa_id')
                    ->from('t_kelas_siswa')
                    ->join('kelas', 't_kelas_siswa.kelas_id', '=', 'kelas.id')
                    ->where('kelas.tahun_ajaran', $currentAcademicYear);
            })
            ->get();

        return Inertia::render('Kelas/Detail', [
            'kelasItem' => $kelas,
            'siswas' => $siswa,
            'allSiswas' => $allSiswas,
        ]);
    }

    public function assignSiswa(Request $request, Kelas $kelas)
    {
        try {
            $validated = $request->validate([
                'siswa_id' => 'required|exists:siswa,id',
            ]);

            if ($kelas->siswa()->where('siswa_id', $validated['siswa_id'])->exists()) {
                return redirect()->back()->withErrors(['siswa_id' => 'Siswa sudah terdaftar di kelas ini.']);
            }

            $existingClassInSameYear = DB::table('t_kelas_siswa')
                ->join('kelas', 't_kelas_siswa.kelas_id', '=', 'kelas.id')
                ->where('t_kelas_siswa.siswa_id', $validated['siswa_id'])
                ->where('kelas.tahun_ajaran', $kelas->tahun_ajaran)
                ->first();

            if ($existingClassInSameYear) {
                $existingClass = Kelas::find($existingClassInSameYear->kelas_id);
                return redirect()->back()->withErrors([
                    'siswa_id' => "Siswa sudah terdaftar di kelas {$existingClass->nama} untuk tahun ajaran {$kelas->tahun_ajaran}."
                ]);
            }

            $kelas->siswa()->attach($validated['siswa_id'], [
                'id' => Str::uuid(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Siswa berhasil ditambahkan ke kelas.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['siswa_id' => 'Terjadi kesalahan saat menambahkan siswa ke kelas.']);
        }
    }
}
