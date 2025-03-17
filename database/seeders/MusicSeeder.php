<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Album;
use App\Models\User;
use App\Models\Genre;
use App\Models\Music;

class MusicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les artistes existants
        $booba = User::where('name', 'Booba')->first();
        
        // Récupérer les genres
        $rapFR = Genre::where('name', 'Rap FR')->first();
        
        // Récupérer les albums existants
        $ultraAlbum = Album::where('name', 'Ultra')->first();       
        
        // Vérification des données nécessaires
        if (!$booba || !$rapFR || !$ultraAlbum) {
            $this->command->error('Données manquantes. Assurez-vous d\'exécuter GenreSeeder et AlbumSeeder d\'abord.');
            return;
        }
       
        // Supprimer les relations existantes pour éviter les doublons
        DB::table('playlist_music')->whereIn('playlist_id', [$ultraAlbum->id])->delete();
        
        // Supprimer les titres existants
        Music::where('titre', 'Mona Lisa')->delete();
        
        // Créer un nouveau morceau
        $music = Music::create([
            'titre' => 'Mona Lisa',
            'user_id' => $booba->id,
            'genre_id' => $rapFR->id,
            'song' => 'songs/mona_lisa.mp3',
        ]);
        
        // Associer le morceau à l'album via la table pivot
        $ultraAlbum->musics()->attach($music->id, ['position' => 1]);
        
    }
}
