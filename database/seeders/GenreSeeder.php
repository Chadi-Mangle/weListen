<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Genres principaux
        $rock = Genre::create(['name' => 'Rock', 'description' => 'Genre musical caractérisé par un tempo marqué']);
        $hiphop = Genre::create(['name' => 'Hip-Hop', 'description' => 'Genre musical mêlant rythmes et paroles scandées']);
        $electronic = Genre::create(['name' => 'Électronique', 'description' => 'Musique produite principalement avec des instruments électroniques']);
        $jazz = Genre::create(['name' => 'Jazz', 'description' => 'Genre musical né au début du XXe siècle aux États-Unis']);
        
        // Sous-genres du Rock
        Genre::create(['name' => 'Hard Rock', 'description' => 'Style de rock plus agressif', 'parent_id' => $rock->id]);
        Genre::create(['name' => 'Alternative Rock', 'description' => 'Style de rock développé à partir des années 1980', 'parent_id' => $rock->id]);
        Genre::create(['name' => 'Metal', 'description' => 'Genre de musique issu du rock', 'parent_id' => $rock->id]);
        
        // Sous-genres du Hip-Hop
        $rap = Genre::create(['name' => 'Rap', 'description' => 'Style de musique caractérisé par la diction des paroles', 'parent_id' => $hiphop->id]);
        Genre::create(['name' => 'Trap', 'description' => 'Sous-genre du hip-hop originaire du Sud des États-Unis', 'parent_id' => $hiphop->id]);

        // Sous-genres du Rap
        Genre::create(['name' => 'Rap FR', 'description' => 'Rap en France', 'parent_id' => $rap->id]);
        Genre::create(['name' => 'Rap US', 'description' => 'Rap aux états-unis', 'parent_id' => $rap->id]);
        
        // Sous-genres de l'Électronique
        Genre::create(['name' => 'House', 'description' => 'Style de musique électronique avec un tempo de 110 à 130 BPM', 'parent_id' => $electronic->id]);
        Genre::create(['name' => 'Techno', 'description' => 'Genre de musique électronique apparu à Detroit', 'parent_id' => $electronic->id]);
        $edm = Genre::create(['name' => 'EDM', 'description' => 'Electronic Dance Music, style commercial de musique électronique', 'parent_id' => $electronic->id]);
        
        // Sous-sous-genre de l'EDM
        Genre::create(['name' => 'Future Bass', 'description' => 'Genre de musique électronique influencé par la trap', 'parent_id' => $edm->id]);
    }
}