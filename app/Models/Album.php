<?php

namespace App\Models;


class Album extends Playlist
{
    protected $table = 'playlists';
    
    protected $attributes = [
        'type' => 'album',
    ];
    
    public function artist()
    {
        return $this->user();
    }

    public static function query()
    {
        return parent::query()->where('type', 'album');
    }
}