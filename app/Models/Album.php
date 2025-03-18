<?php

namespace App\Models;


class Album extends Playlist
{
    protected $table = 'playlists';
    
    protected $attributes = [
        'type' => 'album',
    ];
    

    protected $appends = [
        'year',
        'formatted_for_list',
        'formatted_for_detail',
    ];

    public function artist()
    {
        return $this->user();
    }

    public static function query()
    {
        return parent::query()->where('type', 'album');
    }

    public function getFormattedForListAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'artist' => [
                'id' => $this->artist->id,
                'name' => $this->artist->name,
            ],
            'cover_image' => $this->cover_image ?? '/images/default-album-cover.jpg',
            'genre' => $this->genre ? [
                'id' => $this->genre->id,
                'name' => $this->genre->name,
            ] : null,
            'year' => $this->year,
            'songs_count' => $this->musics->count(),
            'duration' => $this->formatted_duration,
        ];
    }

    public function getFormattedForDetailAttribute()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'artist' => [
                'id' => $this->artist->id,
                'name' => $this->artist->name,
            ],
            'cover_image' => $this->cover_image ?? '/images/default-album-cover.jpg',
            'description' => $this->description,
            'year' => $this->year ?? date('Y'),
            'genre' => [
                'id' => $this->genre->id,
                'name' => $this->genre->name,
            ],
            'songs' => $this->musics->map(function ($music) {
                return [
                    'id' => $music->id,
                    'title' => $music->title,
                    'duration' => $music->duration,
                    'artist' => $music->user->name,
                    'position' => $music->pivot->position
                ];
            }),
            'duration' => $this->formatted_duration,
        ];
    }
}