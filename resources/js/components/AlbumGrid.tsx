import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disc, Play, Clock, Heart } from 'lucide-react';
import { playClickSound, playHoverSound } from '@/utils/soundEffects';

interface AlbumProps {
  id: number;
  name: string;
  artist: {
    id: number;
    name: string;
  };
  cover_image: string;
  year: number;
  songs_count: number;
  duration: string;
}

const Album = ({ id, name, artist, cover_image, year, songs_count, duration }: AlbumProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    console.log(`Playing ${name} by ${artist.name}`);
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
          src={cover_image} 
          alt={`${name} by ${artist.name}`}
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
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-audio-light/70">{artist.name}</p>
        
        <div className="mt-2 flex items-center text-xs text-audio-light/50 gap-3">
          <span className="flex items-center gap-1">
            <Disc size={12} />
            {songs_count} titres
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

const AlbumGrid = ({ albums }) => {
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