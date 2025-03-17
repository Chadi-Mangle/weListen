import React from 'react';
import Header from '@/components/Header';
import { usePage } from '@inertiajs/react';
import AudioPlayer from '@/components/AudioPlayer';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  logo?: React.ReactNode;
  navigationItems?: NavigationItem[];
}

const getDefaultNavigation = (currentPath: string) => {
  // Navigation par défaut pour la page d'accueil
  const landingNavigation = [
    { id: 'discover', label: 'Découvrir', href: '#discover' },
    { id: 'artists', label: 'Nos Artistes', href: '#artists' },
    { id: 'trending', label: 'Tendances', href: '#trending' },
    { id: 'testimonials', label: 'Témoignages', href: '#testimonials' },
    { id: 'newsletter', label: 'Newsletter', href: '#newsletter' }
  ];
  
  // Navigation pour le dashboard auditeur
  const consumerNavigation = [
    { id: 'discover', label: 'Découvrir', href: '/app/consumer/discover' },
    { id: 'playlists', label: 'Mes Playlists', href: '/app/consumer/playlists' },
    { id: 'liked', label: 'Titres Aimés', href: '/app/consumer/liked' }
  ];
  
  // Navigation pour le dashboard créateur
  const creatorNavigation = [
    { id: 'dashboard', label: 'Tableau de bord', href: '/app/creator/dashboard' },
    { id: 'upload', label: 'Télécharger', href: '/app/creator/upload' },
    { id: 'analytics', label: 'Statistiques', href: '/app/creator/analytics' }
  ];
  
  // Détecter la page courante et retourner la navigation appropriée
  if (route().current("home")) {
    return landingNavigation
  } else {
    return [];
  }
};

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showSearch,
  logo = 'WeListen',
  navigationItems
}) => {
  const { url } = usePage();
  // Utiliser les items de navigation fournis ou déterminer les items par défaut basés sur le chemin
  const navItems = navigationItems || getDefaultNavigation(url);
  
  return (
    <div className="min-h-screen bg-audio-dark text-audio-light">
      <Header 
        navigationItems={navItems}
        showSearch={showSearch}
        logo={logo}
      />
      <main>
        {children}
      </main>
      <AudioPlayer />
    </div>
  );
};

export default MainLayout;