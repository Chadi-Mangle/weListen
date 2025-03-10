
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, X, Heart, Share2, Clock, Music2 } from 'lucide-react';
import WaveAnimation from './WaveAnimation';

interface ArtistData {
  id: number;
  name: string;
  description: string;
  image: string;
  topTracks: { title: string; duration: string }[];
  backgroundColor: string;
}

const artists: ArtistData[] = [
  {
    id: 1,
    name: "Mme Melis",
    description: "Artiste novatrice aux sonorités électroniques uniques, Mme Melis repousse les frontières de la musique expérimentale avec son approche minimaliste et ses mélodies captivantes.",
    image: "data:image/jpeg;base64,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",
    backgroundColor: "#9d4edd",
    topTracks: [
      { title: "Je vais me moucher", duration: "3:24" },
      { title: "J'apprends à conduire !", duration: "4:05" },
      { title: "Hey", duration: "2:58" },
      { title: "Tête d'oeuf", duration: "2:58" },
      { title: "Nassim trop beau", duration: "2:58" },
      { title: "Ouais renoi là", duration: "2:58" }
    ]
  },
  {
    id: 2,
    name: "JustADog",
    description: "Véritable phénomène de la scène rap underground, JustADog se démarque par ses paroles incisives et ses productions avant-gardistes qui mêlent trap et sons organiques.",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHX7O8uuI6hRg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718264793884?e=1746662400&v=beta&t=JmqCG040UQ8ve_uj9bGyhS8lZOw0HeldtUf40iOa0KE",
    backgroundColor: "#4361ee",
    topTracks: [
      { title: "Woof Woof", duration: "2:47" },
      { title: "Canine Flow", duration: "3:32" },
      { title: "Unleashed", duration: "3:18" }
    ]
  },
  {
    id: 3,
    name: "Manglon",
    description: "Explorateur sonore aux influences multiples, Manglon fusionne habilement les genres dans ses compositions hypnotiques et envoûtantes, créant un univers musical unique et immersif.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=500&auto=format&fit=crop",
    backgroundColor: "#f77f00",
    topTracks: [
      { title: "Sweet Taste", duration: "3:51" },
      { title: "Honey Loops", duration: "4:22" },
      { title: "Pasta Dream", duration: "3:07" }
    ]
  }
];

interface ArtistModalProps {
  artist: ArtistData | null;
  onClose: () => void;
}

const ArtistModal = ({ artist, onClose }: ArtistModalProps) => {
  if (!artist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden glass border border-white/10 animate-scale-in"
        style={{ maxHeight: '90vh' }}
      >
        <div className="relative">
          <div 
            className="absolute inset-0 opacity-70"
            style={{ background: `linear-gradient(to bottom, ${artist.backgroundColor}60, #0A0A0B)` }}
          ></div>
          <img 
            src={artist.image} 
            alt={artist.name}
            className="w-full h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-4xl font-bold mb-2">{artist.name}</h2>
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
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">À propos</h3>
            <p className="text-audio-light/80">{artist.description}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Titres populaires</h3>
            <div className="space-y-2">
              {artist.topTracks.map((track, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist }: { artist: ArtistData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div 
        className="rounded-xl overflow-hidden group transition-all duration-500 hover-scale"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPlaying(false);
        }}
        onClick={() => setShowModal(true)}
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
        <ArtistModal artist={artist} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

const ArtistsSection = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Découvrez les artistes WeListen</h2>
          <p className="text-audio-light/70 max-w-2xl mx-auto text-balance">
            Explorez notre catalogue d'artistes exclusifs et plongez dans leurs univers sonores uniques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
