import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { playSoundEffect } from '@/utils/soundEffects';
import { router, useForm } from '@inertiajs/react';

interface SongManagementProps {
  onClose: () => void;
}

interface Song {
  id: string;
  title: string;
  cover: string;
  duration: string;
  songUrl: string | null;
  streams: number | string;
  genre: string;
}

const SongManagement: React.FC<SongManagementProps> = ({ onClose }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  
  // Charger les titres depuis la route user_songs
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = () => {
    setLoading(true);
    
    // Utiliser la route Inertia pour récupérer les titres de l'utilisateur
    router.post(route('songs.fetch'), {}, {
      preserveState: true,
      onSuccess: (page) => {
        if (page.props.songs) {
          setSongs(page.props.songs);
        }
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos titres. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    });
  };

  const handleDeleteSong = (song: Song) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${song.title}" ?`)) {
      return;
    }
    
    // Indiquer quel titre est en cours de suppression
    setDeletingSongId(song.id);

    // Utiliser router.post directement, sans useForm
    router.post(route('songs.delete'), {
      id: song.id
    }, {
      preserveState: true,
      onSuccess: () => {
        // Mettre à jour l'état local
        setSongs(songs.filter(s => s.id !== song.id));
        
        playSoundEffect('click');
        toast({
          title: "Titre supprimé",
          description: `"${song.title}" a été supprimé de votre bibliothèque.`
        });
        
        // Réinitialiser l'état de suppression
        setDeletingSongId(null);
      },
      onError: (errors) => {
        console.error("Erreurs:", errors);
        toast({
          title: "Erreur",
          description: errors.id || "Impossible de supprimer ce titre. Veuillez réessayer.",
          variant: "destructive"
        });
        
        // Réinitialiser l'état de suppression
        setDeletingSongId(null);
      }
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin w-8 h-8 border-2 border-audio-accent/20 border-t-audio-accent rounded-full mb-4"></div>
              <p className="text-audio-light/70">Chargement de vos titres...</p>
            </div>
          ) : songs.length === 0 ? (
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
                        <div 
                          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            // Logique pour jouer le titre
                            playSoundEffect('click');
                          }}
                        >
                          <Play size={20} fill="white" className="ml-1" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{song.title}</p>
                      <div className="flex items-center gap-2 text-xs text-audio-light/60">
                       <span>{song.duration}</span>
                       <span className="bg-audio-accent/20 text-audio-accent rounded-full px-2 py-0.5 text-[10px]">
                        {song.genre}
                       </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleDeleteSong(song)}
                      disabled={deletingSongId === song.id}
                    >
                      <Trash2 size={14} className="mr-1" />
                      {deletingSongId === song.id ? 'Suppression...' : 'Supprimer'}
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