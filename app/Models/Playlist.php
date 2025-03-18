<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description', 
        'user_id', 
        'cover_image',
        'release_date',
        'is_public',
        'genre_id',
        'type',
    ];

    protected $appends = [
        'year',
        'formatted_duration',
        'songs_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    // Relation avec les musiques
    public function musics()
    {
        return $this->belongsToMany(Music::class, 'playlist_music', 'playlist_id', 'music_id')
            ->withPivot('position')
            ->orderBy('position')
            ->withTimestamps();
    }

    public function getSongsCountAttribute()
    {
        return $this->musics->count();
    }

    public function getYearAttribute()
    {
        return Carbon::parse($this->release_date)->format('Y');
    }

    /**
     * Calcule la durée totale de la playlist/album en secondes
     *
     * @return int
     */
    public function calculateDurationInSeconds()
    {
        return $this->musics->sum(function($music) {
            return $music->duration ?? 0;
        });
    }

    public function calculateDuration()
    {
        $totalSeconds = $this->calculateDurationInSeconds();
        
        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        
        if ($minutes < 1) {
            return sprintf("%d sec", $totalSeconds);
        }

        if ($hours > 0) {
            return sprintf("%dh %dmin", $hours, $minutes);
        }
        
        return sprintf("%d min", $minutes);
    }

    public function getFormattedDurationAttribute() 
    {
        return $this->calculateDuration();
    }
}