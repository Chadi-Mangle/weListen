import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/contexts/AudioContext';
import { playSoundEffect } from '@/utils/soundEffects';

const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, previousTrack } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentTrack) return;

    const audio = document.getElementById('audio-player') as HTMLAudioElement;
    if (!audio) return;

    setAudioElement(audio);

    // Réinitialiser la progression
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    // Définir le gestionnaire d'événements
    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100 || 0;
      setProgress(progress);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    
    // Mettre à jour le temps de l'audio
    audioElement.currentTime = (newProgress / 100) * audioElement.duration;
    setProgress(newProgress);
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 px-6 py-3 z-50"
    >
      <audio 
        id="audio-player" 
        src={currentTrack.songUrl || ''} 
        autoPlay={isPlaying}
      />
      
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Informations sur la piste */}
        <div className="flex items-center gap-3">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <h4 className="font-medium text-sm text-white">{currentTrack.title}</h4>
            <p className="text-xs text-audio-light/60">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Contrôles */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <button 
              className="text-audio-light/60 hover:text-audio-light transition-colors"
              onClick={() => {
                previousTrack();
                playSoundEffect('click');
              }}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              className="w-10 h-10 bg-audio-accent/10 border border-audio-accent/30 rounded-full flex items-center justify-center text-audio-accent hover:bg-audio-accent/20 transition-colors"
              onClick={() => {
                togglePlayPause();
                playSoundEffect('click');
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            
            <button 
              className="text-audio-light/60 hover:text-audio-light transition-colors"
              onClick={() => {
                nextTrack();
                playSoundEffect('click');
              }}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Barre de progression */}
          <div className="w-96 mt-2 flex items-center gap-2 text-xs">
            <span className="text-audio-light/60 w-8">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-audio-accent rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-audio-light/60 w-8">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Contrôles de volume */}
        <div className="flex items-center gap-2 w-28">
          <button 
            className="text-audio-light/60 hover:text-audio-light transition-colors"
            onClick={() => {
              setVolume(volume === 0 ? 80 : 0);
              playSoundEffect('click');
            }}
          >
            {volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 50 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          
          <div className="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-audio-light/40 rounded-full"
              style={{ width: `${volume}%` }}
            ></div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;