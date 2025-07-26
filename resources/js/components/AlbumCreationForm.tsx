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
import { router, useForm } from '@inertiajs/react';

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

  const form = useForm({
  title: '',
  cover: null as File | null,
  songIds: [] as number[]
});

const handleCreateAlbum = () => {
  // Validation du titre
  if (!form.data.title.trim()) {
    toast({
      title: "Titre requis",
      description: "Veuillez saisir un titre pour votre album.",
      variant: "destructive"
    });
    return;
  }
  
  // Validation de l'image
  if (!form.data.cover) {
    toast({
      title: "Image requise",
      description: "Veuillez sélectionner une image de couverture.",
      variant: "destructive"
    });
    return;
  }
  
  // Préparation des IDs des chansons
  form.data.songIds = selectedSongs.map(song => song.id);
  
  // Soumission du formulaire
  form.post(route('album.create'), {
    onSuccess: () => {
      playSoundEffect('click');
      toast({
        title: "Album créé avec succès",
        description: `Votre album "${form.data.title}" a bien été créé.`,
      });
      onClose();
    },
    onError: (errors) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'album.",
        variant: "destructive"
      });
      console.error(errors);
    },
    forceFormData: true
  });
};

// Pour mettre à jour le titre quand l'utilisateur le modifie
const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  form.setData('title', e.target.value);
};

// Pour mettre à jour l'image quand l'utilisateur la sélectionne
const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    form.setData('cover', e.target.files[0]);
  }
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
                value={form.data.title}
                onChange={handleTitleChange}
                className="w-full bg-audio-surface/20 border border-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50"
                placeholder="Entrez le titre de l'album"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-audio-light/70 mb-1">Image de couverture</label>
              <div className={`border border-dashed ${albumCover ? 'border-audio-accent' : 'border-white/10'} rounded-md p-4 text-center relative`}>
              {!albumCover ? (
                <>
                <Image size={20} className="mx-auto mb-2 text-audio-light/40" />
                <label className="cursor-pointer">
                  <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAlbumCover(URL.createObjectURL(file));
                      handleCoverChange(e);
                    }
                  }}
                  className="hidden"
                  />
                  <span className="px-3 py-1 border border-audio-accent/30 bg-transparent text-audio-accent rounded-full text-xs hover:bg-audio-accent/10 transition-colors">
                  Parcourir
                  </span>
                </label>
                </>
              ) : (
                <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-1 overflow-hidden rounded">
                  <img 
                  src={albumCover} 
                  alt="Prévisualisation" 
                  className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-audio-light/60 hover:text-audio-light mt-1"
                  onClick={() => setAlbumCover('')}
                >
                  Supprimer
                </button>
                </div>
              )}
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
              variant="default" 
              size="sm"
              className="text-xs rounded-full shadow-glow bg-audio-accent hover:bg-audio-accent/90"
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