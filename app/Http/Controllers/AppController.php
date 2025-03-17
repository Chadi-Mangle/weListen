<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Music; 
use App\Models\Artist;
use Inertia\Inertia; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log; 

class AppController extends Controller
{
    public function store(Request $request)
    {   
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'releaseDate' => 'nullable|date',
            'genre' => 'required|string',
            'explicit' => 'boolean',
            'audio_file' => 'required|file',
            'cover_image' => 'required|image',
        ]);

        $songPath = $request->file('audio_file')->store('songs', 'public'); 
        $coverImagePath = $request->file('cover_image')->store('covers', 'public');
        
        Music::create([
            'titre' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'release_date' => $validated['releaseDate'] ?? now(),
            'user_id' => Auth::id(),
            'song' => $songPath,
            'cover_image' => $coverImagePath,
        ]);

        return redirect()->back()->with('success', 'Titre téléchargé avec succès');
    }

    public function creator()
    {
        $userId = Auth::id();
        $artist = Artist::find($userId);
        
        if (!$artist) {
            // Si l'utilisateur n'est pas un artiste (n'a pas encore de musiques)
            // On utilise le modèle User standard
            $user = Auth::user();
            
            $songs = [];
            $albums = [];
            
            $artistInfo = [
                'name' => $user->name,
                'image' => $user->avatar ?? '/default-artist.jpg',
                'bio' => $user->description ?? "Commencez à télécharger de la musique pour devenir un artiste WeListen!",
                'stats' => [
                    'followers' => '0',
                    'tracks' => 0,
                    'albums' => 0,
                    'monthlyListeners' => '0'
                ]
            ];
        } else {
            // Utiliser les méthodes de l'artiste pour obtenir les données formatées
            $detailData = $artist->formatted_for_detail;
            
            // Récupérer les chansons avec formatage avancé
            $songs = $artist->musics()
                ->select('id', 'titre as title', 'description', 'genre', 'release_date', 'song', 'cover_image as cover', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($song) {
                    return [
                        'id' => $song->id,
                        'title' => $song->title,
                        'description' => $song->description,
                        'genre' => $song->genre,
                        'releaseDate' => $song->release_date ? $song->release_date->format('Y-m-d') : null,
                        'cover' => $song->cover ? asset('storage/' . $song->cover) : '/default-cover.png',
                        'songUrl' => $song->song ? asset('storage/' . $song->song) : null,
                        'duration' => $song->formatted_duration ?? '0:00',
                        'streams' => $song->play_count ?? rand(1000, 100000), // À remplacer par des données réelles
                        'created_at' => $song->created_at->format('d M Y')
                    ];
                });
                
            // Récupérer les albums
            $albums = $artist->albums()
                ->select('id', 'name as title', 'description', 'cover_image as cover', 'release_date', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($album) {
                    // Récupérer les chansons de l'album
                    $albumSongs = $album->musics()
                        ->select('id', 'titre as title', 'duration')
                        ->get()
                        ->map(function ($song) {
                            return [
                                'id' => $song->id,
                                'title' => $song->title,
                                'duration' => $song->formatted_duration ?? '0:00'
                            ];
                        });
                        
                    return [
                        'id' => $album->id,
                        'title' => $album->title,
                        'description' => $album->description,
                        'cover' => $album->cover ? asset('storage/' . $album->cover) : '/default-album.png',
                        'releaseDate' => $album->release_date ? $album->release_date->format('Y-m-d') : null,
                        'songs' => $albumSongs,
                        'created_at' => $album->created_at->format('d M Y')
                    ];
                });
            
            $stats = $artist->getStats();
            
            $artistInfo = [
                'name' => $artist->name,
                'image' => $artist->avatar ?? '/default-artist.jpg',
                'bio' => $artist->description ?? "Cet artiste n'a pas encore ajouté de biographie.",
                'stats' => $stats
            ];
        }
        
        // Retourner la vue avec les données
        return Inertia::render('app/CreatorDashboard', [
            'songs' => $songs,
            'albums' => $albums,
            'artistInfo' => $artistInfo
        ]);
    }

    public function bio(Request $request)
    {
        $validated = $request->validate([
            'bio' => 'required|string|max:255'
        ]);

        $artist = Artist::find(Auth::id());
        $artist->bio = $validated['bio'];
        $artist->save();

        return redirect()->back()->with('success', 'Biographie mise à jour avec succès');
    }
}
