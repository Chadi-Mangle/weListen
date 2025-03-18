<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Music; 
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Album;
use App\Models\Playlist;
use App\Models\Like;
use App\Models\User;
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
                'bio' => $user->bio ?? "",
                'stats' => [
                    'albumCount' => 0,
                    'tracks' => 0,
                    'likes' => 0,
                ]
            ];
        } else {
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
                        'duration' => Music::find($song->id)->formatted_duration ?? '0:00',
                        'streams' => Music::find($song->id)->likes_count,
                        'created_at' => $song->created_at->format('d M Y')
                    ];
                });
                
            // Récupérer les albums
            // $albums = $artist->albums()->get()->map(function($album) {
            //     return $album->formatted_for_list;
            // });
            $albums = $artist->albums()
                ->select('id', 'name as title', 'description', 'cover_image as cover', 'release_date', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($album) {
                    // Récupérer les chansons de l'album
                    $albumSongs = $album->musics()
                        ->select('music.id', 'titre as title', 'duration')
                        ->get()
                        ->map(function ($song) {
                            return [
                                'id' => $song->id,
                                'title' => $song->title,
                                // 'duration' => $song->formatted_duration ?? '0:00'
                            ];
                        });
                        
                    return [
                        'id' => $album->id,
                        'title' => $album->title,
                        'trackCount' => 1,
                        'releaseDate' => $album->release_date ? $album->release_date : null,
                        'cover' => $album->cover ? $album->cover : '/default-album.png',
                    ];
                });
            
            $artistInfo = [
                'name' => $artist->name,
                'image' => $artist->avatar ?? '/default-artist.jpg',
                'bio' => $artist->bio ?? "Cet artiste n'a pas encore ajouté de biographie.",
                'stats' => [
                    'albumCount' => $albums->count(), // Utilise directement le nombre d'albums
                    'tracks' => $songs->count(), // Utilise directement le nombre de chansons
                    'likes' => $songs->sum(function($song) {
                        return is_numeric($song['streams']) ? $song['streams'] : 0;
                    }),
                ]
            ];
        }
        
        // Retourner la vue avec les données
        return Inertia::render('app/CreatorDashboard', [
            'songs' => $songs,
            'albums' => $albums,
            'artistInfo' => $artistInfo
        ]);
    }

    public function user_songs(Request $request)
    {
        $user = Auth::user();
        $songs = Artist::find($user->id)->musics()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($song) {
                return [
                    'id' => $song->id,
                    'title' => $song->title,
                    'genre' => $song->genre,
                    // 'releaseDate' => $song->release_date ? $song->release_date->format('Y-m-d') : null,
                    'cover' => $song->cover ? asset('storage/' . $song->cover) : '/default-cover.png',
                    'songUrl' => $song->song ? asset('storage/' . $song->song) : null,
                    'duration' => Music::find($song->id)->formatted_duration ?? '0:00',
                    'streams' => Music::find($song->id)->likes_count,
                    'created_at' => $song->created_at->format('d M Y')
                ];
            });
        
        Inertia::render('app/CreatorDashboard', [
            'songs' => $songs
        ]);
    }


    public function consumer() 
    {
        $userId = Auth::id();
        
        // Recommandations 
        $recommendations = Music::  // Préchargez explicitement la relation likes
            inRandomOrder() 
            ->limit(5)
            ->get()
            ->shuffle() 
            ->map(function ($track) {
                $artist = $track->user;
                return [
                    'id' => $track->id,
                    'title' => $track->titre,
                    'artist' => $artist ? $artist->name : 'Artiste inconnu',
                    'album' => $track->album_id ? Album::find($track->album_id)->name : 'Single',
                    'cover' => $track->cover_image ? asset('storage/' . $track->cover_image) : '/default-cover.png',
                    'songUrl' => $track->song ? asset('storage/' . $track->song) : null,
                    'duration' => $track->formatted_duration ?? '0:00',
                    'streams' => $track->likes ? $track->likes->count() : 0,
                ];
            })
            ->values();
        
        // Playlists par genre (4 genres aléatoires)
        $genres = Genre::inRandomOrder()
            ->limit(4)
            ->get();
            
        $popularPlaylists = $genres->map(function($genre) {
            // Récupérer quelques chansons de ce genre
            $songs = Music::where('genre_id', $genre->id)
                ->inRandomOrder()
                ->limit(10)
                ->get();
            
            // Prendre la première chanson pour la couverture
            $coverImage = null;
            if ($songs->count() > 0) {
                $firstSong = $songs->first();
                $coverImage = $firstSong->cover_image;
            }
            
            return [
                'id' => 'genre-'.strtolower(str_replace(' ', '-', $genre->name)),
                'name' => 'Top '.$genre->name,
                'description' => 'Collection de musiques '.$genre->name,
                'cover' => $coverImage ? asset('storage/'.$coverImage) : \getRandomImage($genre->id),
                'songCount' => $songs->count(),
                'genre' => $genre->name
            ];
        });

        // Playlists personnelles de l'utilisateur
        $userPlaylists = Playlist::where('user_id', $userId)
            ->where('type', 'playlist')
            ->get()
            ->map(function ($playlist) {
                // Récupérer la première chanson pour la cover si aucune cover n'est définie
                $coverImage = $playlist->cover_image;
                if (!$coverImage && $playlist->musics()->count() > 0) {
                    $firstSong = $playlist->musics()->first();
                    if ($firstSong) {
                        $coverImage = $firstSong->cover_image;
                    }
                }

                return [
                    'id' => $playlist->id,
                    'name' => $playlist->name,
                    'description' => $playlist->description ?? 'Votre playlist',
                    'cover' => $coverImage ? asset('storage/' . $coverImage) : '/default-playlist.png',
                    'songCount' => $playlist->musics()->count(),
                ];
            });

        // Titres aimés par l'utilisateur
        $likedSongs = Like::where('user_id', $userId)
            ->with('music.user')
            ->get()
            ->map(function ($like) {
                $track = $like->music;
                if (!$track) return null;
                
                $artist = $track->user;
                return [
                    'id' => $track->id,
                    'title' => $track->titre,
                    'artist' => $artist ? $artist->name : 'Artiste inconnu',
                    'album' => $track->album_id ? Album::find($track->album_id)->name : 'Single',
                    'cover' => $track->cover_image ? asset('storage/' . $track->cover_image) : '/default-cover.png',
                    'songUrl' => $track->song ? asset('storage/' . $track->song) : null,
                    'duration' => $track->formatted_duration ?? '0:00',
                ];
            })
            ->filter() 
            ->values();

        // (à implémenter)
        $listenHistory = [];

        // Anecdotes musicales (statiques pour le moment)
        $musicAnecdotes = [
            [
                'id' => '1',
                'title' => 'Le saviez-vous?',
                'content' => 'Michael Jackson a breveté un système qui lui permettait de se pencher à 45 degrés dans le clip "Smooth Criminal".',
                'icon' => 'Sparkles'
            ],
            [
                'id' => '2',
                'title' => 'Anecdote musicale',
                'content' => 'La chanson "Happy Birthday" a longtemps été protégée par copyright jusqu\'en 2016, générant environ 2 millions $ par an.',
                'icon' => 'BookOpen'
            ],
            [
                'id' => '3',
                'title' => 'Fait intéressant',
                'content' => 'Les Beatles ont été refusés par Decca Records qui a déclaré "les groupes de guitare sont sur le déclin".',
                'icon' => 'LightbulbIcon'
            ],
            [
                'id' => '4',
                'title' => 'Le saviez-vous?',
                'content' => 'Le premier CD produit pour la vente commerciale était "The Visitors" d\'ABBA en 1982.',
                'icon' => 'Disc'
            ]
        ];

        // Artistes populaires
        $popularArtists = Artist::withCount('musics')
            ->orderBy('musics_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($artist) {
                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'image' => $artist->avatar ? $artist->avatar : '/default-artist.jpg',
                    'trackCount' => $artist->musics_count,
                ];
            });

        // Récupérer les informations de l'utilisateur
        $user = Auth::user();
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : '/default-avatar.jpg',
        ];

        return Inertia::render('app/ConsumerDashboard', [
            'recommendations' => $recommendations,
            'popularPlaylists' => $popularPlaylists,
            'userPlaylists' => $userPlaylists,
            'likedSongs' => $likedSongs,
            'listenHistory' => $listenHistory,
            'musicAnecdotes' => $musicAnecdotes,
            'popularArtists' => $popularArtists,
            'userData' => $userData
        ]);
    }

    public function bio(Request $request)
    {
        $validated = $request->validate([
            'bio' => 'required|string|max:255'
        ]);
        

        $user = Auth::user();
        Log::info('Bio mise à jour: ' . $validated['bio'] . ' pour l\'utilisateur ' . $user->id);
        $user->bio = $validated['bio'];
        $user->save();

        return redirect()->back()->with('success', 'Biographie mise à jour avec succès');
    }

    public function song_destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer'
        ]);
        $id = $validated['id'];
        Log::info('Suppression de la chanson ' . $id);
        $song = Music::find($validated['id']);
        $song->delete();

        return redirect()->back()->with('success', 'Titre supprimé avec succès');
    }

    public function createAlbum(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover' => 'required|image',
            'songIds' => 'required|array',
            'songIds.*' => 'integer'
        ]);
        
        // Créer un nouvel album
        $album = new Album();
        $album->name = $validated['title'];
        $album->user_id = Auth::id();
        
        // Stocker le nouvel avatar
        $path = $request->file('cover')->store('covers', 'public');
        
        $album->cover_image = '/storage/' .  $path;
        $album->release_date = now();
        $album->save();
        
        // Attacher les chansons à l'album
        for ($index = 0; $index < count($validated['songIds']); $index++) {
            $songId = $validated['songIds'][$index];
            $music = Music::find($songId);
            if ($music && $music->user_id === Auth::id()) {
                $album->musics()->attach($music->id, ['position' => $index + 1]);
            }
        }
    }
}

