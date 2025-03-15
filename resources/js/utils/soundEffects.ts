
// Sound effect utility for playing audio effects throughout the app

/**
 * Play a sound effect from the public sounds directory
 * @param sound The name of the sound file without extension
 * @param volume Volume level between 0 and 1
 */
export const playSoundEffect = (sound: 'click' | 'hover' | 'pop' | 'swoosh', volume: number = 0.3) => {
  try {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.volume = volume;
    audio.play().catch(e => {
      console.log('Error playing sound:', e);
    });
  } catch (error) {
    console.log('Error with sound effect:', error);
  }
};

// Named convenience functions
export const playClickSound = () => playSoundEffect('click');
export const playHoverSound = () => playSoundEffect('hover');
export const playPopSound = () => playSoundEffect('pop');
export const playSwooshSound = () => playSoundEffect('swoosh');
