<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description', 
        'user_id', 
        'cover_image',
        'is_public',
        'type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec les musiques
    public function musics()
    {
        return $this->belongsToMany(Music::class, 'playlist_music', 'playlist_id', 'music_id')
            ->withPivot('position')
            ->orderBy('position')
            ->withTimestamps();
    }
}