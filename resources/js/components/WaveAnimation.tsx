
import React from 'react';
import { cn } from '@/lib/utils';

interface WaveAnimationProps {
  className?: string;
  playing?: boolean;
}

const WaveAnimation = ({ className, playing = true }: WaveAnimationProps) => {
  return (
    <div className={cn('flex items-end h-8 gap-[3px]', className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-[3px] bg-audio-accent h-full rounded-full',
            {
              [`animate-wave-${i + 1}`]: playing,
              'h-2': !playing
            }
          )}
          style={{ 
            opacity: playing ? 1 : 0.5,
            transition: 'height 0.2s ease, opacity 0.2s ease'
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
