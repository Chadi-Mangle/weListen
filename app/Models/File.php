<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
    ];
}

// Modèle pour les fichiers audio
class AudioFile extends File
{
    protected $table = 'files'; // Utilise la même table que le modèle parent

    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
        'duration',
        'artist_id', 
        'album_id', 
    ];

    // // Relation avec l'artiste
    // public function artist()
    // {
    //     return $this->belongsTo(Artist::class);
    // }

    // // Relation avec l'album
    // public function album()
    // {
    //     return $this->belongsTo(Album::class);
    // }
}

// Modèle pour les images (pochettes d'album, avatars)
class ImageFile extends File
{
    protected $table = 'files';

    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
        'width',  
        'height', 
        'type',
    ];

    // // Méthode pour redimensionner l'image
    // public function resize($width, $height)
    // {
    //     // Logique de redimensionnement
    // }
}