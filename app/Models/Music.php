<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    /** @use HasFactory<\Database\Factories\MusicFactory> */
    use HasFactory;

    protected $table = 'music';

    protected $fillable = [
        'titre',
        'file_path',
        'user_id',
        'album_id',
        'genre_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artist()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }
}