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
    // public function index(Request $request)
    // {
    //     $search = $request->get('search');
    //     $perPage = $request->get('per_page', 10);

    //     $ujians = Ujian::with(['kelas', 'mataPelajaran'])
    //         ->when($search, function ($query, $search) {
    //             $query->where('nama_ujian', 'like', "%{$search}%")
    //                 ->orWhereHas('kelas', fn($q) => $q->where('nama_kelas', 'like', "%{$search}%"))
    //                 ->orWhereHas('mataPelajaran', fn($q) => $q->where('nama_mapel', 'like', "%{$search}%"));
    //         })
    //         ->paginate($perPage);

    // return Inertia::render('Ujian/Index', [
    //     'ujians' => $ujians,
    //     'filters' => [
    //         'search' => $search,
    //         'per_page' => $perPage,
    //     ],
    // ]);
    //     return Inertia::render('Ujian/Index', [
    //         'ujians' => $ujians->through(function ($ujian) {
    //             return [
    //                 'id' => $ujian->id,
    //                 'nama_ujian' => $ujian->nama_ujian,
    //                 'mata_pelajaran' => $ujian->mataPelajaran->nama_mapel ?? '-',
    //                 'kelas' => [
    //                     'nama_kelas' => $ujian->kelas->nama_kelas ?? '-',
    //                     'tahun_ajaran' => $ujian->kelas->tahun_ajaran ?? '-',
    //                 ],
    //             ];
    //         }),
    //         'filters' => [
    //             'search' => $search,
    //             'per_page' => $perPage,
    //         ],
    //         'pagination' => [
    //             'total' => $ujians->total(),
    //             'current_page' => $ujians->currentPage(),
    //             'last_page' => $ujians->lastPage(),
    //         ],
    //     ]);
    // }
    // public function index(Request $request)
    // {
    //     $perPage = (int) $request->input('per_page', 10);
    //     $search = $request->input('search');
    //     $sortBy = $request->input('sort_by', 'nama_ujian');
    //     $sortDirection = $request->input('sort_direction', 'asc');

    //     // $query = Ujian::with(['kelas', 'mataPelajaran']);
    //     $query = Ujian::with(['kelas', 'mataPelajaran'])->withCount('soals');


    //     if ($search) {
    //         $query->where('nama_ujian', 'like', "%{$search}%")
    //             ->orWhereHas('kelas', fn($q) => $q->where('nama_kelas', 'like', "%{$search}%"))
    //             ->orWhereHas('mataPelajaran', fn($q) => $q->where('nama_mapel', 'like', "%{$search}%"));
    //     }

    //     if (in_array($sortBy, ['nama_ujian']) && in_array($sortDirection, ['asc', 'desc'])) {
    //         $query->orderBy($sortBy, $sortDirection);
    //     } else {
    //         $query->latest();
    //     }

    //     $ujians = $query->paginate($perPage)->withQueryString();

    //     return Inertia::render('Ujian/Index', [
    //         'ujians' => $ujians,
    //         'filters' => [
    //             'search' => $search,
    //             'per_page' => $perPage,
    //             'sort_by' => $sortBy,
    //             'sort_direction' => $sortDirection,
    //         ],
    //     ]);
    // }
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'nama_ujian');
        $sortDirection = $request->input('sort_direction', 'asc');

        $query = Ujian::with(['kelas', 'mataPelajaran'])->withCount('soals');

        if ($search) {
            $query->where('nama_ujian', 'like', "%{$search}%")
                ->orWhereHas('kelas', fn($q) => $q->where('nama_kelas', 'like', "%{$search}%"))
                ->orWhereHas('mataPelajaran', fn($q) => $q->where('nama_mapel', 'like', "%{$search}%"));
        }

        // Handle sorting
        if (in_array($sortDirection, ['asc', 'desc'])) {
            switch ($sortBy) {
                case 'nama_ujian':
                    $query->orderBy('nama_ujian', $sortDirection);
                    break;
                case 'kelas.nama_kelas':
                    $query->join('kelas', 'ujian.kelas_id', '=', 'kelas.id')
                        ->orderBy('kelas.nama_kelas', $sortDirection)
                        ->select('ujian.*');
                    break;
                case 'kelas.tahun_ajaran':
                    $query->join('kelas', 'ujian.kelas_id', '=', 'kelas.id')
                        ->orderBy('kelas.tahun_ajaran', $sortDirection)
                        ->select('ujian.*');
                    break;
                case 'mata_pelajaran.nama_mapel':
                    $query->join('mata_pelajaran', 'ujian.mata_pelajaran_id', '=', 'mata_pelajaran.id')
                        ->orderBy('mata_pelajaran.nama_mapel', $sortDirection)
                        ->select('ujian.*');
                    break;
                case 'soals_count':
                    $query->orderBy('soals_count', $sortDirection);
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }

        $ujians = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Ujian/Index', [
            'ujians' => $ujians,
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
        return Inertia::render('Ujian/Create', [
            // 'kelas' => Kelas::all(),
            'kelas' => Kelas::select('id', 'nama_kelas', 'tahun_ajaran')
                ->orderByDesc('tahun_ajaran')
                ->get(),
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
        Kelas::orderByDesc('tahun_ajaran')->get();
        return Inertia::render('Ujian/Edit', [
            'ujian' => $ujian,
            'kelas' => Kelas::select('id', 'nama_kelas', 'tahun_ajaran')
                ->orderByDesc('tahun_ajaran')
                ->get(),
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
