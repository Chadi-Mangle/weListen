import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Menu, Home, Music, User, Settings, Heart, PlayCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { router } from '@inertiajs/react';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole, setUserRole } = useApp();
  
  const goBack = () => {
    window.history.back();
  };
  
  const switchRole = () => {
    if (userRole === 'consumer') {
      setUserRole('creator');
      router.visit('/app/creator');
    } else if (userRole === 'creator') {
      setUserRole('consumer');
      router.visit('/app/consumer');
    } else {
      router.visit('/app');
    }
  };
  
//   const menuItems = userRole === 'creator' 
//     ? [
//         { icon: Home, label: 'Accueil', path: '/app/creator' },
//         { icon: Music, label: 'Vos titres', path: '#' },
//         { icon: User, label: 'Profil', path: '#' },
//         { icon: Settings, label: 'Paramètres', path: '#' }
//       ]
//     : [
//         { icon: Home, label: 'Accueil', path: '/app/consumer' },
//         { icon: Heart, label: 'Favoris', path: '#' },
//         { icon: PlayCircle, label: 'Playlists', path: '#' },
//         { icon: User, label: 'Profil', path: '#' },
//         { icon: Settings, label: 'Paramètres', path: '#' }
//       ];

  return (
    
    <main className="flex-grow pt-16">
    <div className="container mx-auto px-6 relative">
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center py-4 mb-4"
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={goBack}
          className="flex items-center gap-2 text-audio-light/70 hover:text-audio-light transition-colors group backdrop-blur-sm bg-transparent hover:bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xs font-medium">Retour</span>
        </button>
        
        {/* <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-audio-light/70 hover:text-audio-light transition-colors backdrop-blur-sm bg-transparent hover:bg-white/5 border border-white/10 rounded-full w-8 h-8 justify-center"
        >
          <Menu size={14} />
        </button> */}
        
        {title && (
          <h1 className="ml-2 text-sm font-medium text-audio-light">{title}</h1>
        )}
      </div>
      
      <button 
        onClick={switchRole}
        className="text-xs border border-audio-accent/30 text-audio-accent hover:text-audio-accent-light transition-colors rounded-full px-3 py-1.5 backdrop-blur-sm bg-transparent hover:bg-audio-accent/10"
      >
        {userRole === 'creator' ? 'Passer en mode Auditeur' : 'Passer en mode Créateur'}
      </button>

    </motion.div>
    </div>
    </main>
  );
};

export default AppHeader;