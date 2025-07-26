import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, X, Heart, Share2, Music2, ChevronLeft, ChevronRight } from 'lucide-react';
import WaveAnimation from './WaveAnimation';
import { useForm, usePage, router } from '@inertiajs/react';

interface ArtistData {
  id: number;
  name: string;
  description: string;
  image: string;
  backgroundColor: string;
  topTracks?: { title: string; duration: string }[];
}

// Interface pour les props de la page
interface PageProps {
  artistData?: ArtistData;
}

interface ArtistModalProps {
  artist: ArtistData;
  onClose: () => void;
  artistData?: ArtistData;
}

const ArtistModal = ({ artist, onClose, artistData }: ArtistModalProps) => {
  // Effet pour désactiver le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (artist) {
      // Sauvegarder la position de défilement actuelle
      const scrollY = window.scrollY;
      
      // Désactiver le défilement sur le body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Nettoyer et restaurer le scroll quand on ferme la modale
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [artist]);

  if (!artist) return null;
  
  // Utiliser artist comme fallback quand artistData est undefined
  const displayArtist = artistData || artist;
  const hasDetailedData = !!artistData;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background sans animation */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal content sans animation */}
      <div 
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden glass border border-white/10"
        style={{ maxHeight: '90vh' }}
      >
        <div className="relative">
          <div 
            className="absolute inset-0 opacity-70"
            style={{ background: `linear-gradient(to bottom, ${displayArtist.backgroundColor}60, #0A0A0B)` }}
          ></div>
          <img 
            src={displayArtist.image} 
            alt={displayArtist.name}
            className="w-full h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-4xl font-bold mb-2">{displayArtist.name}</h2>
            <div className="flex gap-4 mb-4">
              <button className="px-6 py-2 bg-audio-accent hover:bg-audio-accent-light transition-colors rounded-full font-medium flex items-center gap-2 shadow-neon hover-scale">
                <Play size={18} fill="white" /> Écouter
              </button>
              <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                <Heart size={18} />
              </button>
              <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">À propos</h3>
            <p className="text-audio-light/80">{displayArtist.description}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Titres populaires</h3>
            
            {!displayArtist.topTracks ? (
              // Afficher un état de chargement pendant que les détails sont récupérés
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-3 animate-pulse">
                    <div className="w-8 h-8 bg-white/10 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-white/10 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-white/5 rounded w-1/4"></div>
                    </div>
                    <div className="w-12 h-4 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              // Afficher les titres si nous avons les détails
              <div className="space-y-2">
                {displayArtist.topTracks.map((track, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors rounded-lg group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center text-audio-light/60 group-hover:opacity-0 group-hover:hidden">
                        {index + 1}
                      </div>
                      <button className="w-8 h-8 rounded-full bg-audio-accent opacity-0 hidden group-hover:flex group-hover:opacity-100 items-center justify-center transition-all duration-300">
                        <Play size={16} fill="white" />
                      </button>
                      <div>
                        <p className="font-medium">{track.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-audio-light/60 text-sm">{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist }: { artist: ArtistData }) => {
  const { props } = usePage<PageProps>();
  const { artistData } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Inertia useForm pour la requête des détails
  const { data, setData, post } = useForm({
      id: artist.id
  });

  // Obtenir les détails de l'artiste
  const getArtistDetails = () => {
      setShowModal(true);
      post(route('get-artist-info'), {
          preserveState: true,
          preserveScroll: true,
          only: ['artistData'],
      });
  };
    
  return (
    <>
      <div 
        className="rounded-xl overflow-hidden group transition-all duration-500 hover-scale"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPlaying(false);
        }}
        onClick={getArtistDetails}
      >
        <div className="relative aspect-[4/5]">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
          />
          
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-300 rounded-xl",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            style={{ background: `linear-gradient(to top, ${artist.backgroundColor}E6, transparent)` }}
          ></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className={cn(
              "text-2xl font-bold mb-2 transition-transform duration-500",
              isHovered ? "translate-y-0" : "translate-y-8 opacity-0"
            )}>
              {artist.name}
            </h3>
            
            <div className={cn(
              "flex gap-4 transition-all duration-500",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center glass border border-white/20 shadow-lg hover:bg-audio-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? (
                  <WaveAnimation className="h-6" />
                ) : (
                  <Play size={24} fill="white" className="ml-1" />
                )}
              </button>
              
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center glass border border-white/20 hover:bg-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Music2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Animated particles effect */}
          <div className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {showModal && (
        <ArtistModal 
          artist={artist} 
          onClose={() => setShowModal(false)}
          artistData={artistData && artistData.id === artist.id ? artistData : undefined}
        />
      )}
    </>
  );
};

const ArtistsSection = ({ artists = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(artists.length / itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const currentArtists = artists.slice(
    currentIndex * itemsPerPage, 
    (currentIndex + 1) * itemsPerPage
  );
  
  return (
    <section id="discover" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-audio-dark/90 via-audio-dark to-audio-dark/95"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 text-xs font-medium rounded-full glass-accent text-audio-accent inline-block mb-4">
            Artistes exclusifs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Découvrez les artistes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">WeListen</span></h2>
          <p className="text-audio-light/70 max-w-2xl mx-auto text-balance">
            Explorez notre catalogue d'artistes exclusifs et plongez dans leurs univers sonores uniques.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
          
          {/* Carousel Navigation - n'afficher que si totalPages > 1 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={goToPrevious}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-audio-accent/20 transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-audio-accent w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={goToNext}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-audio-accent/20 transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
