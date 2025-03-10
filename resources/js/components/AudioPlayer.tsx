
import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2 } from 'lucide-react';
import WaveAnimation from './WaveAnimation';
import { cn } from '@/lib/utils';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleSize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-spring",
        isMinimized 
          ? "h-16 md:h-20" 
          : "h-72 md:h-96"
      )}
    >
      {/* Background blur */}
      <div className="absolute inset-0 glass"></div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-audio-light/10">
        <div 
          className="h-full bg-audio-accent"
          style={{ width: '38%' }}
        />
      </div>
      
      <div className="container mx-auto h-full max-w-7xl px-4">
        {/* Compact player - always visible */}
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Song info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1598387846148-47e82ee120cc?q=80&w=500&auto=format&fit=crop" 
                alt="Cover art" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h4 className="font-medium">Levitating</h4>
              <p className="text-sm text-audio-light/70">Dua Lipa</p>
            </div>
            <WaveAnimation playing={isPlaying} className="sm:hidden h-6" />
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors hidden md:block">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-audio-accent flex items-center justify-center hover:bg-audio-accent-light transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="white" />}
            </button>
            <button className="p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors hidden md:block">
              <SkipForward size={20} />
            </button>
            
            {/* Progress text */}
            <div className="text-xs text-audio-light/70 hidden md:block">
              1:47 / 4:32
            </div>
          </div>
          
          {/* Volume and expand */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Volume2 size={18} className="text-audio-light/70" />
              <div className="w-24 h-1 bg-audio-light/10 rounded-full">
                <div className="h-full w-3/4 bg-audio-light/50 rounded-full"></div>
              </div>
            </div>
            <button 
              onClick={toggleSize}
              className="p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Expanded view */}
        <div 
          className={cn(
            "h-[calc(100%-5rem)] flex-col justify-between transition-opacity",
            isMinimized ? "hidden" : "flex"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full py-4">
            {/* Cover art */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-xs aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1598387846148-47e82ee120cc?q=80&w=500&auto=format&fit=crop" 
                  alt="Album cover"
                  className="w-full h-full object-cover rounded-xl shadow-soft"
                />
                <div 
                  className="absolute -inset-4 rounded-full opacity-20 blur-3xl -z-10"
                  style={{ background: 'linear-gradient(45deg, #0EA5E9, #8B5CF6)' }}
                ></div>
              </div>
            </div>
            
            {/* Song details and lyrics */}
            <div className="col-span-2 flex flex-col justify-between overflow-hidden">
              <div>
                <h3 className="text-2xl font-bold mb-1">Levitating</h3>
                <p className="text-audio-light/70 mb-6">Dua Lipa - Future Nostalgia (2020)</p>
                
                <div className="max-h-40 overflow-y-auto text-audio-light/60 pr-4 leading-relaxed">
                  <p className="mb-2">If you wanna run away with me, I know a galaxy</p>
                  <p className="mb-2">And I can take you for a ride</p>
                  <p className="mb-2">I had a premonition that we fell into a rhythm</p>
                  <p className="mb-2">Where the music don't stop for life</p>
                  <p className="mb-2 text-audio-light font-medium">Glitter in the sky, glitter in my eyes</p>
                  <p className="mb-2 text-audio-light font-medium">Shining just the way I like</p>
                  <p className="mb-2">If you're feeling like you need a little bit of company</p>
                  <p className="mb-2">You met me at the perfect time</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <div className="flex justify-between text-xs text-audio-light/70">
                  <span>1:47</span>
                  <span>4:32</span>
                </div>
                <div className="h-1.5 bg-audio-light/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-audio rounded-full"
                    style={{ width: '38%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
