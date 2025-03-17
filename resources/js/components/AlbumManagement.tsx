import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, CheckSquare, Square, Album as AlbumIcon, Music, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp, Song } from '@/contexts/AppContext';
import AlbumCreationForm from './AlbumCreationForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { playSoundEffect } from '@/utils/soundEffects';

interface AlbumManagementProps {
  onClose: () => void;
}

const AlbumManagement: React.FC<AlbumManagementProps> = ({ onClose }) => {
  const { songs } = useApp();
  const { toast } = useToast();
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const toggleSongSelection = (song: Song) => {
    if (selectedSongs.some(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
      playSoundEffect('hover');
    }
  };

  const handleNextStep = () => {
    if (selectedSongs.length === 0) {
      toast({
        title: "Aucun titre sélectionné",
        description: "Veuillez sélectionner au moins un titre pour créer un album.",
        variant: "destructive"
      });
      return;
    }
    
    playSoundEffect('click');
    setShowAlbumForm(true);
  };

  const handleCloseAlbumForm = () => {
    // Fermer complètement le flux de création d'album, y compris la sélection des morceaux
    onClose();
    setSelectedSongs([]);
    setShowAlbumForm(false);
  };

  if (showAlbumForm) {
    return <AlbumCreationForm selectedSongs={selectedSongs} onClose={handleCloseAlbumForm} />;
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-transparent backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-glow"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-medium text-audio-light text-base">Créer un album</h3>
          <button 
            className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/5"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-audio-light/70 mb-4">
            Sélectionnez les titres que vous souhaitez inclure dans votre album.
          </p>
          
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-audio-light/60">
              <Music size={48} className="mb-4 opacity-30" />
              <p>Vous n'avez pas encore de titres.</p>
              <p className="text-sm">Téléchargez votre musique pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {songs.map((song) => {
                const isSelected = selectedSongs.some(s => s.id === song.id);
                
                return (
                  <div 
                    key={song.id}
                    className={cn(
                      "flex items-center justify-between p-3 transition-colors rounded-lg cursor-pointer",
                      isSelected ? "bg-audio-accent/10" : "hover:bg-white/5"
                    )}
                    onClick={() => toggleSongSelection(song)}
                    onMouseEnter={() => setHoveredSong(song.id)}
                    onMouseLeave={() => setHoveredSong(null)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                        {hoveredSong === song.id && !isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={16} fill="white" className="ml-0.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{song.title}</p>
                        <p className="text-xs text-audio-light/60">{song.duration}</p>
                      </div>
                    </div>
                    <div>
                      {isSelected ? (
                        <CheckSquare className="text-audio-accent" size={18} />
                      ) : (
                        <Square className="text-audio-light/60" size={18} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex justify-between p-4 border-t border-white/10">
          <div className="text-sm text-audio-light/70">
            {selectedSongs.length} titre{selectedSongs.length !== 1 ? 's' : ''} sélectionné{selectedSongs.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full border-white/10 hover:bg-white/5"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="accent"
              size="sm"
              className="text-xs rounded-full shadow-glow flex items-center gap-1"
              onClick={handleNextStep}
              disabled={selectedSongs.length === 0}
            >
              Suivant
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumManagement;