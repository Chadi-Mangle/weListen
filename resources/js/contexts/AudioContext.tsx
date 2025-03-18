import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  songUrl: string | null;
  duration: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  queueTracks: (tracks: Track[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  queue: Track[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Créer un élément audio une seule fois
    const audio = new Audio();
    setAudioElement(audio);

    // Nettoyage
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  React.useEffect(() => {
    if (!audioElement) return;

    // Configurer l'audio quand la piste change
    if (currentTrack && currentTrack.songUrl) {
      audioElement.src = currentTrack.songUrl;
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, audioElement]);

  const playTrack = (track: Track) => {
    if (!track.songUrl) {
      console.error("Cette piste n'a pas d'URL audio");
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioElement) {
      // La source sera mise à jour par l'effet ci-dessus
      audioElement.play().catch(error => {
        console.error('Erreur lors de la lecture:', error);
        setIsPlaying(false);
      });
    }
  };

  const pauseTrack = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pauseTrack();
    } else {
      if (audioElement) {
        audioElement.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  };

  const queueTracks = (tracks: Track[]) => {
    setQueue(tracks);
    // Si aucune piste n'est en cours, jouer la première de la file
    if (!currentTrack && tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlayPause,
        queueTracks,
        nextTrack,
        previousTrack,
        queue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};