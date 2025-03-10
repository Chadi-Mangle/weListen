
// Sound effect utility for playing interaction sounds throughout the app

// Pre-load sounds for better performance
const clickSound = new Audio('/sounds/click.mp3');
const hoverSound = new Audio('/sounds/hover.mp3');
const popSound = new Audio('/sounds/pop.mp3');
const swooshSound = new Audio('/sounds/swoosh.mp3');

// Set volume levels
clickSound.volume = 0.2;
hoverSound.volume = 0.1;
popSound.volume = 0.15;
swooshSound.volume = 0.2;

export const playClickSound = () => {
  clickSound.currentTime = 0;
  clickSound.play().catch(err => console.log('Audio play failed:', err));
};

export const playHoverSound = () => {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(err => console.log('Audio play failed:', err));
};

export const playPopSound = () => {
  popSound.currentTime = 0;
  popSound.play().catch(err => console.log('Audio play failed:', err));
};

export const playSwooshSound = () => {
  swooshSound.currentTime = 0;
  swooshSound.play().catch(err => console.log('Audio play failed:', err));
};
