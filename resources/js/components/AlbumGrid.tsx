
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disc, Play, Clock, Heart } from 'lucide-react';
import { playClickSound, playHoverSound } from '@/utils/soundEffects';

// Données des albums
const albums = [
  {
    id: 1,
    title: "Ultra",
    artist: "Booba",
    cover: "https://www.artistikrezo.com/wp-content/uploads/2021/05/ULTRA-BOOBA-585x552-1.jpeg",
    year: 2021,
    songs: 15,
    duration: "53 min",
  },
  {
    id: 2,
    title: "Kamikaze",
    artist: "Eminem",
    cover: "data:image/jpeg;base64,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",
    year: 2018,
    songs: 13,
    duration: "45 min",
  },
  {
    id: 3,
    title: "Trône",
    artist: "Booba",
    cover: "data:image/jpeg;base64,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",
    year: 2017,
    songs: 14,
    duration: "49 min",
  },
  {
    id: 4,
    title: "Music To Be Murdered By",
    artist: "Eminem",
    cover: "https://upload.wikimedia.org/wikipedia/en/8/80/Eminem_-_Music_to_Be_Murdered_By.png",
    year: 2020,
    songs: 20,
    duration: "64 min",
  },
  {
    id: 5,
    title: "Nero Nemesis",
    artist: "Booba",
    cover: "https://m.media-amazon.com/images/I/814wfNaENVL._UF1000,1000_QL80_.jpg",
    year: 2015,
    songs: 14,
    duration: "58 min",
  },
  {
    id: 6,
    title: "Recovery",
    artist: "Eminem",
    cover: "https://m.media-amazon.com/images/I/61fXEwg-lAL._UF1000,1000_QL80_.jpg",
    year: 2010,
    songs: 17,
    duration: "62 min",
  },
];

interface AlbumProps {
  id: number;
  title: string;
  artist: string;
  cover: string;
  year: number;
  songs: number;
  duration: string;
}

const Album = ({ id, title, artist, cover, year, songs, duration }: AlbumProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    console.log(`Playing ${title} by ${artist}`);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setIsLiked(!isLiked);
  };
  
  return (
    <motion.div 
      className="group relative rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      <div className="aspect-square relative overflow-hidden rounded-xl">
        <motion.img 
          src={cover} 
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover object-center"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-14 h-14 rounded-full bg-audio-accent flex items-center justify-center hover:bg-audio-accent-light transition-colors relative z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
          >
            <Play size={26} fill="white" className="text-white ml-1" />
          </motion.button>
        </motion.div>
        
        <motion.div
          className="absolute top-3 right-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-audio-surface-accent transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
          >
            <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
          </motion.button>
        </motion.div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-audio-light/70">{artist}</p>
        
        <div className="mt-2 flex items-center text-xs text-audio-light/50 gap-3">
          <span className="flex items-center gap-1">
            <Disc size={12} />
            {songs} titres
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {duration}
          </span>
          <span>{year}</span>
        </div>
      </div>
    </motion.div>
  );
};

const AlbumGrid = () => {
  return (
    <section id="discover" className="py-20 px-6 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-audio-dark via-audio-dark/90 to-audio-dark"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="px-3 py-1 text-xs font-medium rounded-full glass-accent text-audio-accent inline-block mb-4">
            Découvrir
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <h2 className="text-4xl font-bold">Albums Populaires</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass rounded-lg hover:bg-audio-surface-accent transition-colors">Rap FR</button>
              <button className="px-4 py-2 glass rounded-lg hover:bg-audio-surface-accent transition-colors">Rap US</button>
              <button className="px-4 py-2 glass rounded-lg hover:bg-audio-surface-accent transition-colors">Tout voir</button>
            </div>
          </div>
          <p className="text-audio-light/70 max-w-2xl">
            Explorez les albums les plus écoutés sur notre plateforme, avec une sélection de titres incontournables.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {albums.map(album => (
            <Album key={album.id} {...album} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlbumGrid;
