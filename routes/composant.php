<?php

use App\Http\Controllers\AlbumController;
use Illuminate\Support\Facades\Route;

Route::get('/albums', [AlbumController::class, 'index'])->name('albums.index');
    Route::get('/albums/{id}', [AlbumController::class, 'show'])->name('albums.show');
    Route::post('/albums/like/{id}', [AlbumController::class, 'like'])->name('albums.like');