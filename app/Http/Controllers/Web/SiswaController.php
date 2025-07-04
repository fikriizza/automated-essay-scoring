<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Siswa::with('user');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $siswas = $query->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Siswa/Index', [
            'siswas' => $siswas,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Siswa/Create');
    }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'nama' => ['required', 'string', 'max:255'],
        //     'nisn' => ['nullable', 'string', 'max:255'],
        // ]);

        // // 1. Buat user terlebih dahulu
        // $user = User::create([
        //     'name' => $validated['nama'],
        //     'email' => fake()->unique()->safeEmail(), // Atur email sesuai kebutuhan
        //     'password' => Hash::make('password123'),  // Bisa diganti generate atau input dari form
        // ]);

        // // 2. Buat siswa dan kaitkan user_id
        // Siswa::create([
        //     'user_id' => $user->id,
        //     'nisn' => $validated['nisn'],
        // ]);

        // return to_route('siswa.index')->with('success', 'Siswa berhasil ditambahkan');
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'nisn' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Siswa::create([
            'user_id' => $user->id,
            'nisn' => $validated['nisn'],
        ]);
        return to_route('siswa.index')->with('success', 'Siswa berhasil ditambahkan');
    }

    public function edit($id)
    {
        $siswa = Siswa::with('user')->findOrFail($id);

        // return Inertia::render('Siswa/Edit', [
        //     'siswa' => [
        //         'id' => $siswa->id,
        //         'nama' => $siswa->user->name,
        //         'nisn' => $siswa->nisn,
        //     ]
        // ]);
        return Inertia::render('Siswa/Edit', [
            'siswa' => [
                'id' => $siswa->id,
                'nama' => $siswa->user->name,
                'email' => $siswa->user->email,
                'nisn' => $siswa->nisn,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::with('user')->findOrFail($id);
        // $validated = $request->validate([
        //     'nama' => ['required', 'string', 'max:255'],
        //     'nisn' => ['nullable', 'string', 'max:255'],
        // ]);


        // // Update nama user
        // $siswa->user->update([
        //     'name' => $validated['nama'],
        // ]);

        // // Update data siswa
        // $siswa->update([
        //     'nisn' => $validated['nisn'],
        // ]);
        // return to_route('siswa.index')->with('success', 'Siswa berhasil diupdate');

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $siswa->user->id],
            'password' => ['nullable', 'string', 'min:8'],
            'nisn' => ['nullable', 'string', 'max:255'],
        ]);

        $siswa->user->update([
            'name' => $validated['nama'],
            'email' => $validated['email'],
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);

        $siswa->update([
            'nisn' => $validated['nisn'],
        ]);
        return to_route('siswa.index')->with('success', 'Siswa berhasil diupdate');
    }

    public function destroy($id)
    {
        // $siswa = Siswa::findOrFail($id);
        // $siswa->delete(); // Ini juga akan menghapus user jika pakai foreign key cascade

        // return to_route('siswa.index')->with('success', 'Siswa berhasil dihapus.');
        $siswa = Siswa::with('user')->findOrFail($id);

        // Hapus user (otomatis akan menghapus siswa jika pakai cascade)
        $siswa->user->delete();

        return to_route('siswa.index')->with('success', 'Siswa berhasil dihapus.');
    }
}
