<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppController;

// Page de sélection du rôle
Route::get('/app', function () {
    return Inertia::render('app/index');
})->name('app');

Route::middleware('auth')->group(function () {
    Route::get('/app/consumer', [AppController::class, 'consumer'])->name('app.consumer');
});

Route::middleware('auth')->group(function () {
    Route::get('/app/creator', [AppController::class, 'creator'])->name('app.creator');
    Route::post('/creator/bio', [AppController::class, 'bio'])->name('app.creator.bio');
    Route::post('/songs/store', [AppController::class, 'store'])->name('songs.store');
    Route::post('/app/creator', [AppController::class, 'user_songs'])->name('songs.fetch');
    Route::post('/songs', [AppController::class, 'song_destroy'])->name('songs.delete');
    Route::post('/album/create', [AppController::class, 'createAlbum'])->name('album.create');
});


// Route::middleware('auth')->group(function () {
// });