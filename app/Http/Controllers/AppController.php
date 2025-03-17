<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Music; // Importation manquante
use Illuminate\Support\Facades\Auth; // Importation manquante
use Illuminate\Support\Facades\Log; // Pour le logging

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
}
