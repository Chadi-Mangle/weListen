
import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, LogOut, Settings, Heart, PlayCircle, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionButton } from './ConnectionButton';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current && 
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    const audio = new Audio('/sounds/pop.mp3');
    audio.volume = 0.2;
    audio.play();
    setIsSearchOpen(!isSearchOpen);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-spring',
        isScrolled ? 'glass backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-audio-light font-bold text-xl flex items-center gap-2"
            >
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-audio rounded-full animate-pulse-soft"></div>
                <div className="absolute inset-1 bg-audio-dark rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-audio-light rounded-full"></div>
                </div>
              </div>
              <span className="animate-fade-in">WeListen</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#discover" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('discover');
              }}
              className="text-audio-light/80 hover:text-audio-light transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-audio-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Découvrir
            </a>
            <a 
              href="#artists" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('artists');
              }}
              className="text-audio-light/80 hover:text-audio-light transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-audio-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Nos Artistes
            </a>
            <a 
              href="#trending" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('trending');
              }}
              className="text-audio-light/80 hover:text-audio-light transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-audio-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Tendances
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('testimonials');
              }}
              className="text-audio-light/80 hover:text-audio-light transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-audio-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Témoignages
            </a>
            <a 
              href="#newsletter" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('newsletter');
              }}
              className="text-audio-light/80 hover:text-audio-light transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-audio-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Newsletter
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors glass hover-scale"
                onClick={toggleSearch}
                aria-label="Search"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
              
              {/* Animated Search Bar */}
              <div 
                className={cn(
                  "absolute right-0 top-full mt-2 overflow-hidden transition-all duration-500 ease-spring",
                  isSearchOpen 
                    ? "w-72 opacity-100 translate-y-0 scale-100" 
                    : "w-0 opacity-0 -translate-y-2 scale-95"
                )}
              >
                <div className="relative glass border border-white/10 rounded-full shadow-lg overflow-hidden">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full bg-transparent px-5 py-3 pr-10 focus:outline-none text-audio-light"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-audio-light/70">
                    <Search size={16} />
                  </div>
                  
                  {/* Animated background effect */}
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-audio-accent/10 via-transparent to-purple-500/10 animate-spin-slow"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">

              <ConnectionButton />
              
              {/* <button 
                ref={profileButtonRef}
                className="p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors glass hover-scale"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={20} />
              </button> */}
              
              {/* Profile Dropdown Menu */}
              <div 
                ref={profileMenuRef}
                className={cn(
                  "absolute right-0 top-full mt-2 glass border border-white/10 rounded-lg shadow-lg overflow-hidden transition-all duration-300 w-60 z-50",
                  isProfileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
                )}
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-audio-accent/20 flex items-center justify-center mr-3">
                      <UserRound size={20} className="text-audio-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium">Utilisateur</h4>
                      <p className="text-sm text-audio-light/70">utilisateur@example.com</p>
                    </div>
                  </div>
                </div>
                <nav className="py-2">
                  <a href="#profile" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <UserRound size={18} />
                    <span>Profil</span>
                  </a>
                  <a href="#favorites" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <Heart size={18} />
                    <span>Favoris</span>
                  </a>
                  <a href="#playlists" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <PlayCircle size={18} />
                    <span>Mes playlists</span>
                  </a>
                  <a href="#settings" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <Settings size={18} />
                    <span>Paramètres</span>
                  </a>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <a href="#logout" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-red-400">
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
            <button 
              className="md:hidden p-2 text-audio-light/80 hover:text-audio-light rounded-full transition-colors glass"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "absolute top-full left-0 right-0 glass md:hidden overflow-hidden transition-all duration-300 ease-spring",
          isMenuOpen ? "max-h-[300px] py-4" : "max-h-0 py-0"
        )}
      >
        <nav className="flex flex-col space-y-4 px-6">
          <a 
            href="#discover" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('discover');
            }}
            className="text-audio-light/80 hover:text-audio-light py-2 transition-colors duration-200"
          >
            Découvrir
          </a>
          <a 
            href="#artists" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('artists');
            }}
            className="text-audio-light/80 hover:text-audio-light py-2 transition-colors duration-200"
          >
            Nos Artistes
          </a>
          <a 
            href="#trending" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('trending');
            }}
            className="text-audio-light/80 hover:text-audio-light py-2 transition-colors duration-200"
          >
            Tendances
          </a>
          <a 
            href="#testimonials" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('testimonials');
            }}
            className="text-audio-light/80 hover:text-audio-light py-2 transition-colors duration-200"
          >
            Témoignages
          </a>
          <a 
            href="#newsletter" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('newsletter');
            }}
            className="text-audio-light/80 hover:text-audio-light py-2 transition-colors duration-200"
          >
            Newsletter
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
