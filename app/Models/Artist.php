<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artist extends User
{
    protected $table = 'users';


    protected $appends = [
        'formatted_for_list',
        'formatted_for_detail'
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::addGlobalScope('artist', function ($query) {
            $query->whereHas('musics');
        });
    }
    
    public function musics()
    {
        return $this->hasMany(Music::class, 'user_id');
    }
    
    public function albums()
    {
        return $this->hasMany(Album::class, 'user_id')->where('type', 'album');
    }
    
    public function getStats()
    {
        return [
            'total_musics' => $this->musics()->count(),
            'total_albums' => $this->albums()->count(),
            'first_upload' => $this->musics()->oldest()->first()?->created_at,
            'latest_upload' => $this->musics()->latest()->first()?->created_at,
        ];
    }
    
    public function getTopMusics($limit = 5)
    {
        return $this->musics()
            ->leftJoin('likes', 'music.id', '=', 'likes.music_id')
            ->select('music.*', \DB::raw('COUNT(likes.id) as likes_count'))
            ->groupBy('music.id')
            ->orderByDesc('likes_count')
            ->limit($limit)
            ->get();
    }

    public function getFormattedForListAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->avatar ?? '/images/default-artist.jpg',
            'backgroundColor' => getRandomColor($this->id),
        ];
    }

    public function getFormattedForDetailAttribute()
    {
        $topTracks = $this->getTopMusics()->map(function($music) {
            return [
                'id' => $music->id,
                'title' => $music->titre,
                'duration' => $music->formatted_duration,
            ];
        });

        $stats = $this->getStats();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->bio ?? 'Cet artiste n\'a pas encore ajouté de biographie.',
            'image' => $this->avatar ?? '/images/default-artist.jpg',
            'backgroundColor' => getRandomColor($this->id),
            'topTracks' => $topTracks,
            'stats' => [
                'total_musics' => $stats['total_musics'],
                'total_albums' => $stats['total_albums'],
            ]
        ];
    }
}