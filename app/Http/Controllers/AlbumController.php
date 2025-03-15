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
        $formattedAlbums = $albums->map(function ($album) {
            return [
                'id' => $album->id,
                'name' => $album->name,
                'artist' => [
                    'id' => $album->artist->id,
                    'name' => $album->artist->name,
                ],
                'cover_image' => $album->cover_image ?? '/images/default-album-cover.jpg',
                'year' => $album->year ?? date('Y'),
                'songs_count' => $album->musics->count(),
                'duration' => $this->calculateDuration($album->musics),
            ];
        });
        
        return Inertia::render('welcome', [
            'albums' => $formattedAlbums
        ]);
    }

    public function show($id)
    {
        $album = Album::with(['artist', 'musics'])->findOrFail($id);
        
        return Inertia::render('Albums/Show', [
            'album' => [
                'id' => $album->id,
                'name' => $album->name,
                'artist' => [
                    'id' => $album->artist->id,
                    'name' => $album->artist->name,
                ],
                'cover_image' => $album->cover_image ?? '/images/default-album-cover.jpg',
                'description' => $album->description,
                'year' => $album->year ?? date('Y'),
                'songs' => $album->musics->map(function ($music) {
                    return [
                        'id' => $music->id,
                        'title' => $music->title,
                        'duration' => $music->duration,
                        'artist' => $music->user->name,
                        'position' => $music->pivot->position
                    ];
                }),
                'duration' => $this->calculateDuration($album->musics),
            ]
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

    /**
     * Calcule la durée totale d'un album en fonction des musiques qu'il contient
     */
    private function calculateDuration($musics)
    {
        $totalSeconds = $musics->sum(function($music) {
            // Si la durée est au format MM:SS, on la convertit en secondes
            if (strpos($music->duration, ':') !== false) {
                list($minutes, $seconds) = explode(':', $music->duration);
                return ($minutes * 60) + $seconds;
            }
            return $music->duration ?? 0;
        });
        
        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        
        if ($hours > 0) {
            return sprintf("%dh %dmin", $hours, $minutes);
        }
        
        return sprintf("%d min", $minutes);
    }
}