import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp, Song, Album } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { playSoundEffect } from '@/utils/soundEffects';
// Remplacer useNavigate par router d'Inertia
import { router } from '@inertiajs/react';

interface AlbumCreationFormProps {
  selectedSongs: Song[];
  onClose: () => void;
}

const AlbumCreationForm: React.FC<AlbumCreationFormProps> = ({ selectedSongs, onClose }) => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const { addAlbum } = useApp();
  const { toast } = useToast();
  // Supprimer cette ligne: const navigate = useNavigate();

  const handleCreateAlbum = () => {
    if (!albumTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour votre album.",
        variant: "destructive"
      });
      return;
    }

    const newAlbum: Album = {
      id: Date.now().toString(),
      title: albumTitle,
      cover: albumCover || selectedSongs[0]?.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      songs: selectedSongs
    };

    addAlbum(newAlbum);
    playSoundEffect('click');
    
    toast({
      title: "Album créé avec succès",
      description: `Votre album "${albumTitle}" a bien été créé.`,
    });
    
    // Fermer d'abord l'interface modale
    onClose();
    
    // Remplacer navigate par router.visit d'Inertia
    setTimeout(() => {
      router.visit(route('creator-dashboard'));
      // Ou si vous préférez utiliser l'URL directement:
      // router.visit('/app/creator');
    }, 100);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-transparent backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-glow"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-medium text-audio-light text-sm">Créer un nouvel album</h3>
          <button 
            className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/5"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-5">
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs text-audio-light/70 mb-1">Titre de l'album *</label>
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full bg-audio-surface/20 border border-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50"
                placeholder="Entrez le titre de l'album"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-audio-light/70 mb-1">Image de couverture</label>
              <div className="border border-dashed border-white/10 rounded-md p-4 text-center">
                <Image size={20} className="mx-auto mb-2 text-audio-light/40" />
                <input 
                  type="text"
                  value={albumCover}
                  onChange={(e) => setAlbumCover(e.target.value)}
                  className="w-full bg-audio-surface/20 border border-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50 mt-2"
                  placeholder="URL de l'image de couverture"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-audio-light/70 mb-1">Titres sélectionnés ({selectedSongs.length})</label>
              <div className="max-h-48 overflow-y-auto p-1">
                {selectedSongs.map((song) => (
                  <div 
                    key={song.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5"
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{song.title}</p>
                      <p className="text-xs text-audio-light/60">{song.duration}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-audio-accent/20 text-audio-accent flex items-center justify-center">
                      <Check size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs rounded-full border-white/10 hover:bg-white/5"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="accent" 
              size="sm"
              className="text-xs rounded-full shadow-glow"
              onClick={handleCreateAlbum}
            >
              Créer l'album
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumCreationForm;