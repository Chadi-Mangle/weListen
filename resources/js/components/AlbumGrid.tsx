import React, { useRef, useState } from 'react';
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
  genre: {
    id: number;
    name: string;
  }
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
      transition={{ duration: 0.5, ease: "easeOut" }}
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
          alt={`${name} by ${artist}`}
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

const AlbumGrid = ( { albums = [] } ) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const filteredAlbums = filter 
    ? albums.filter(album => album.genre.name === filter) 
    : albums;
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
  const displayedAlbums = filteredAlbums.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  
  const handleNext = () => {
    playClickSound();
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
    playClickSound();
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleFilter = (category: string | null) => {
    playClickSound();
    setFilter(category);
    setCurrentPage(0); // Reset to first page when changing filters
  };
  
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
              <button 
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'Rap FR' ? 'bg-audio-accent text-white' : 'glass hover:bg-audio-surface-accent'}`}
                onClick={() => handleFilter('Rap FR')}
              >
                Rap FR
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'Rap US' ? 'bg-audio-accent text-white' : 'glass hover:bg-audio-surface-accent'}`}
                onClick={() => handleFilter('Rap US')}
              >
                Rap US
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all ${filter === null ? 'bg-audio-accent text-white' : 'glass hover:bg-audio-surface-accent'}`}
                onClick={() => handleFilter(null)}
              >
                Tout voir
              </button>
            </div>
          </div>
          <p className="text-audio-light/70 max-w-2xl">
            Explorez les albums les plus écoutés sur notre plateforme, avec une sélection de titres incontournables.
          </p>
        </div>
        
        <div className="relative">
          {totalPages > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-audio-surface/50 backdrop-blur-sm ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-audio-surface-accent'}`}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-audio-surface/50 backdrop-blur-sm ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-audio-surface-accent'}`}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          <div 
            ref={carouselRef} 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            {displayedAlbums.map(album => (
              <Album key={album.id} {...album} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPage(index);
                    playClickSound();
                  }}
                  className={`w-2.5 h-2.5 mx-1 rounded-full ${currentPage === index ? 'bg-audio-accent' : 'bg-audio-surface hover:bg-audio-accent/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


export default AlbumGrid;