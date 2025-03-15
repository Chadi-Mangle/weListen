<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Album;
use App\Models\User;

class AlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les artistes si nécessaire
        $booba = User::firstOrCreate(
            ['name' => 'Booba'],
            [
                'email' => 'booba@example.com',
                'password' => bcrypt('password'),
            ]
        );
        
        $eminem = User::firstOrCreate(
            ['name' => 'Eminem'],
            [
                'email' => 'eminem@example.com',
                'password' => bcrypt('password'),
            ]
        );
        
        // Supprimer les albums existants avec les mêmes noms pour éviter les doublons
        Album::where('name', 'Ultra')->orWhere('name', 'Kamikaze')->delete();
        
        // Créer les albums
        $ultraAlbum = Album::create([
            'name' => 'Ultra',
            'description' => 'Ultra est le dixième album studio du rappeur français Booba, sorti en 2021.',
            'user_id' => $booba->id,
            'cover_image' => 'https://www.artistikrezo.com/wp-content/uploads/2021/05/ULTRA-BOOBA-585x552-1.jpeg',
            'type' => 'album',
        ]);
        
        $kamikazeAlbum = Album::create([
            'name' => 'Kamikaze',
            'description' => 'Kamikaze est le dixième album studio du rappeur américain Eminem, sorti en 2018.',
            'user_id' => $eminem->id,
            'cover_image' => 'https://upload.wikimedia.org/wikipedia/en/6/62/Eminem_-_Kamikaze.jpg',
            'type' => 'album',
        ]);
    }
}
