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

        $EDM = Genre::where('name', 'EDM')->first();
        
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
        

        $alban = User::firstOrCreate(
            ['name' => 'JustADog'],
            [
                'email' => 'alban@example.com',
                'password' => bcrypt('password'),
                'bio' => 'En vrai...',
                'avatar' => 'https://media.licdn.com/dms/image/v2/D4E03AQHX7O8uuI6hRg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718277998153?e=1747872000&v=beta&t=t0VtHIQ-MI7FhBOaIdYQElHeuevQR-z6VCLb7Arxkwk',
            ]
        );

        // Créer un nouveau morceau
        Music::create([
            'titre' => 'Woof Woof',
            'user_id' => $alban->id,
            'genre_id' => $EDM->id,
            'song' => 'songs/mona_lisa.mp3',
        ]);
        

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
