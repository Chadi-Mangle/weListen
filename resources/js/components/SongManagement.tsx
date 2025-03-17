import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp, Song } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { playSoundEffect } from '@/utils/soundEffects';

interface SongManagementProps {
  onClose: () => void;
}

const SongManagement: React.FC<SongManagementProps> = ({ onClose }) => {
  const { songs, removeSong } = useApp();
  const { toast } = useToast();
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const handleDeleteSong = (song: Song) => {
    removeSong(song.id);
    playSoundEffect('click');
    
    toast({
      title: "Titre supprimé",
      description: `${song.title}" a été supprimé de votre bibliothèque.`
    });
  };

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
          <h3 className="font-medium text-audio-light text-base">Gérer vos titres</h3>
          <button 
            className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/5"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-audio-light/60">
              <Music size={48} className="mb-4 opacity-30" />
              <p>Vous n'avez pas encore de titres.</p>
              <p className="text-sm">Téléchargez votre musique pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {songs.map((song) => (
                <div 
                  key={song.id}
                  className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors rounded-lg group"
                  onMouseEnter={() => setHoveredSong(song.id)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                      {hoveredSong === song.id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play size={20} fill="white" className="ml-1" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{song.title}</p>
                      <p className="text-xs text-audio-light/60">{song.duration}</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleDeleteSong(song)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end p-4 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-full"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SongManagement;