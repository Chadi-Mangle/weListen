<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Genre extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'parent_id'
    ];

    /**
     * Relation avec le genre parent
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Genre::class, 'parent_id');
    }

    /**
     * Relation avec les sous-genres
     */
    public function subgenres(): HasMany
    {
        return $this->hasMany(Genre::class, 'parent_id');
    }

    /**
     * Relation avec les musiques de ce genre
     */
    public function music(): HasMany
    {
        return $this->hasMany(Music::class);
    }

    /**
     * Récupérer tous les genres parents (qui n'ont pas de parent)
     */
    public static function parents()
    {
        return static::whereNull('parent_id')->get();
    }

    /**
     * Vérifier si ce genre est un genre parent
     */
    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Vérifier si ce genre est un sous-genre
     */
    public function isSubgenre(): bool
    {
        return !is_null($this->parent_id);
    }

    /**
     * Récupérer la hiérarchie complète du genre (pour les sous-genres)
     */
    public function hierarchy(): array
    {
        $hierarchy = [$this];
        
        if ($this->isSubgenre()) {
            $parent = $this->parent;
            array_unshift($hierarchy, $parent);
            
            // Continuer à remonter dans la hiérarchie si nécessaire
            while ($parent->isSubgenre()) {
                $parent = $parent->parent;
                array_unshift($hierarchy, $parent);
            }
        }
        
        return $hierarchy;
    }
}
