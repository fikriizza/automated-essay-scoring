<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/dashboard';

    public function boot(): void
    {
        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        // Custom redirect setelah login
        $this->app['router']->get('redirect-after-login', function () {
            $user = Auth::user();

            if ($user->siswa) {
                return redirect()->route('dashboard.siswa');
            }

            return redirect()->route('dashboard'); // fallback ke dashboard biasa
        })->name('redirect.after.login');
    }
}
