<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use JamesHeinrich\GetID3\GetID3;

class Music extends Model
{
    /** @use HasFactory<\Database\Factories\MusicFactory> */
    use HasFactory;

    protected $table = 'music';

    protected $fillable = [
        'titre',
        'song',
        'cover_image',
        'description',
        'duration',
        'user_id',
        'genre_id',
    ];

    protected $appends = ['formatted_duration', "likes_count"];

        protected static function booted()
    {
        static::created(function ($music) {
            if (empty($music->duration)) {
                $music->getDuration();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artist()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function playlists()
    {
        return $this->belongsToMany(Playlist::class, 'playlist_music', 'music_id', 'playlist_id')
            ->withPivot('position')
            ->withTimestamps();
    }

    public function album()
    {
        return $this->playlists()->where('type', 'album')->first();
    }

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    private function likedBy()
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

    public function getLikesCountAttribute()
    {
        return $this->likedBy()->count();
    }
    
    public function getDuration()
    {
        if (!empty($this->duration)) {
            return $this->duration;
        }

        $path = storage_path('app/public/' . $this->song);
        
        // Vérifier que le fichier existe
        if (!file_exists($path)) {
            return 0;
        }
        
        // Analyser le fichier avec getID3
        $getID3 = new \getID3();
        $fileInfo = $getID3->analyze($path);
        
        if (isset($fileInfo['playtime_seconds'])) {
            $seconds = (int) $fileInfo['playtime_seconds'];
            $this->duration = $seconds;
            $this->save();
            
            return $seconds;
        }
        
        return 0;
    }

    public function getFormattedDurationAttribute()
    {
        $seconds = floor($this->duration % 60);
        $minutes = floor(($this->duration / 60));
        $duration = sprintf('%02d:%02d', $minutes, $seconds);

        return $duration;
    }
}