<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Ces routes gèrent toutes les fonctionnalités principales de l'application WeListen
| accessibles depuis le préfixe /app. Elles incluent la sélection du rôle
| (auditeur ou créateur) et les fonctionnalités spécifiques à chaque rôle.
|
*/

// Page de sélection du rôle
Route::get('/app', function () {
    return Inertia::render('app/index');
})->name('app');

// Routes protégées nécessitant une authentification
Route::middleware('auth')->group(function () {
    Route::get('/app/consumer', function () {
        return Inertia::render('app/ConsumerDashboard');
    })->name('app.consumer');

    Route::get('/app/creator', function () {
        return Inertia::render('app/CreatorDashboard');
    })->name('app.creator');
});
