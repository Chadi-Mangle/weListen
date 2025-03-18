<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Album;
use App\Models\Artist;

class HomeController extends Controller
{
    public function index()
    {
        $albums = Album::with(['artist', 'musics'])->get();
        $formattedAlbums = $albums->map->formatted_for_list;

        $artists = Artist::get(); 
        $formattedArtist = $artists->map->formatted_for_list;
        return Inertia::render('welcome', [
            'albums' => $formattedAlbums,
            'artists' => $formattedArtist,
        ]);
    } 

    public function getArtist(Request $request)
    {
        $id = $request->input('id');
        $artist = Artist::with(['albums', 'musics'])->findOrFail($id);
        $formattedArtist = $artist->formatted_for_detail;
        
        return Inertia::render('welcome', [
            'artistData' => $formattedArtist
        ]);
    }

    public function getAlbum(Request $request) 
    {
        $id = $request->input('id', 1);
        $album = Album::with(['artist', 'musics'])->findOrFail($id);
        $formattedAlbum = $album->formatted_for_detail;
        
        return Inertia::render('welcome', [
            'albumData' => $formattedAlbum,
        ]);
    }
}
