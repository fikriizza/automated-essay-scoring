<?php

use App\Http\Controllers\Web\KelasController;
use App\Http\Controllers\Web\MapelController;
use App\Http\Controllers\Web\SiswaController;
use App\Http\Controllers\Web\UjianController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::prefix('siswa')->name('siswa.')->group(function () {
        Route::get('/', [SiswaController::class, 'index'])->name('index');
        Route::get('/create', [SiswaController::class, 'create'])->name('create');
        Route::post('/store', [SiswaController::class, 'store'])->name('store');
        Route::delete('/{id}', [SiswaController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [SiswaController::class, 'edit'])->name('edit');
        Route::post('/{id}', [SiswaController::class, 'update'])->name('update');
    });
    Route::prefix('kelas')->name('kelas.')->group(function () {
        Route::get('/', [KelasController::class, 'index'])->name('index');
        Route::get('/create', [KelasController::class, 'create'])->name('create');
        Route::post('/store', [KelasController::class, 'store'])->name('store');
        Route::delete('/{id}', [KelasController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [KelasController::class, 'edit'])->name('edit');
        Route::post('/{id}', [KelasController::class, 'update'])->name('update');
        Route::get('/{kelas}/detail', [KelasController::class, 'show'])->name('detail');
        Route::post('/{kelas}/assign-siswa', [KelasController::class, 'assignSiswa'])->name('assign-siswa');
    });
    Route::prefix('mata_pelajaran')->name('mata_pelajaran.')->group(function () {
        Route::get('/', [MapelController::class, 'index'])->name('index');
        Route::get('/create', [MapelController::class, 'create'])->name('create');
        Route::post('/store', [MapelController::class, 'store'])->name('store');
        Route::delete('/{id}', [MapelController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [MapelController::class, 'edit'])->name('edit');
        Route::post('/{id}', [MapelController::class, 'update'])->name('update');
    });
    Route::prefix('ujian')->name('ujian.')->group(function () {
        Route::get('/', [UjianController::class, 'index'])->name('index');
        Route::get('/create', [UjianController::class, 'create'])->name('create');
        Route::post('/store', [UjianController::class, 'store'])->name('store');
        Route::delete('/{id}', [UjianController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [UjianController::class, 'edit'])->name('edit');
        Route::post('/{id}', [UjianController::class, 'update'])->name('update');
        Route::get('/{id}/show', [UjianController::class, 'show'])->name('show');

        Route::get('/{id}/manage_soal', [UjianController::class, 'manageSoal'])->name('manage_soal');
        Route::post('/{id}/soal/store', [UjianController::class, 'storeSoal'])->name('store_soal');
        Route::post('/{ujian_id}/soal/{soal_id}/update', [UjianController::class, 'updateSoal'])->name('update_soal');
        Route::delete('/{ujian_id}/soal/{soal_id}', [UjianController::class, 'destroySoal'])->name('destroy_soal');
    });
    Route::get('/dashboard-siswa', function () {
        return Inertia::render('DashboardSiswa/Index', [
            'nama' => auth()->user()->name,
        ]);
    })->name('dashboard.siswa');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
