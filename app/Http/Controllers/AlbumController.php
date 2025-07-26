<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlbumController extends Controller
{
    public function index()
    {
        // Récupérer tous les albums avec leurs artistes (users) et musiques
        $albums = Album::with(['artist', 'musics'])->get();
        
        // Transformer les données pour qu'elles correspondent à l'interface attendue par le front
        $formattedAlbums = $albums->map->formatted_for_list;

        return Inertia::render('welcome', [
            'albums' => $formattedAlbums
        ]);
    }

    public function show($id)
    {
        $album = Album::with(['artist', 'musics'])->findOrFail($id);
        
        return Inertia::render('Albums/Show', [
            'album' => $album->formatted_for_detail,
        ]);
    }

    public function like($id)
    {
        $album = Album::findOrFail($id);
        $user = auth()->user();
        
        // Vérifier si l'utilisateur a déjà aimé cet album
        $liked = $user->likedPlaylists()->where('playlist_id', $album->id)->exists();
        
        if ($liked) {
            // Si déjà aimé, on retire le like
            $user->likedPlaylists()->detach($album->id);
        } else {
            // Sinon on ajoute le like
            $user->likedPlaylists()->attach($album->id);
        }
        
        return back();
    }
}