<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;

Route::controller(HomeController::class)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::post('/', [HomeController::class, 'getArtist'])->name('get-artist-info');
    // Route::post('/', [HomeController::class, 'getAlbum'])->name('get-album-info');
});


Route::get('/phpinfo', function() {
    phpinfo();
    exit;
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/composant.php';
require __DIR__.'/app.php';