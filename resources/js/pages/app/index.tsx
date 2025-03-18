import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useApp, AppProvider } from '@/contexts/AppContext'; // Importez AppProvider
import { Music, Mic2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import StarBackground from '@/components/StarBackground';
// import { playSoundEffect } from '@/utils/soundEffects';

// Nouveau composant qui utilise le contexte
const RoleSelectionContent = () => {
  const { setUserRole, userRole } = useApp();

  useEffect(() => {
    // Reset userRole when entering this page to avoid automatic redirects
    setUserRole(null);
  }, [setUserRole]);

  const handleRoleSelect = (role: 'consumer' | 'creator') => {
    setUserRole(role);
    router.visit(`/app/${role}`);
  };

  const handleBack = () => {
    router.visit('/');
  };

  return (
    <div className="relative min-h-screen bg-audio-dark flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-audio-dark via-audio-dark to-black opacity-90 z-0"></div>
      
      <StarBackground intensity={2} speed={0.5} />
      
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-audio-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-6 left-6 text-audio-light/70 hover:text-white flex items-center gap-2 z-50 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm bg-white/5 hover:bg-white/10"
        onClick={handleBack}
        // onMouseEnter={() => playSoundEffect('hover')}
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Retour</span>
      </motion.button> */}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 container px-6"
      >
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-audio-light"
          >
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-audio-accent to-audio-accent-light">WeListen</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-audio-light/70 max-w-2xl mx-auto"
          >
            Choisissez votre expérience pour profiter pleinement de la plateforme
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-sm border border-white/10 bg-white/5 rounded-xl p-8 text-center cursor-pointer hover:bg-white/10 transition-all"
            onClick={() => handleRoleSelect('consumer')}
          >
            <div className="w-16 h-16 mx-auto border border-audio-accent/20 bg-audio-accent/10 rounded-full flex items-center justify-center mb-6">
              <Music size={28} className="text-audio-accent" />
            </div>
            <h3 className="text-xl font-medium mb-4 text-audio-light">Auditeur</h3>
            <p className="text-audio-light/60 mb-6 text-sm">
              Découvrez de nouvelles musiques, créez des playlists et profitez d'une expérience d'écoute personnalisée.
            </p>
            <div className="py-2 px-4 rounded-full border border-audio-accent/30 bg-transparent hover:bg-audio-accent/10 inline-block font-medium text-audio-accent text-sm transition-colors">
              Commencer
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-sm border border-white/10 bg-white/5 rounded-xl p-8 text-center cursor-pointer hover:bg-white/10 transition-all"
            onClick={() => handleRoleSelect('creator')}
          >
            <div className="w-16 h-16 mx-auto border border-purple-500/20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <Mic2 size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-medium mb-4 text-audio-light">Créateur</h3>
            <p className="text-audio-light/60 mb-6 text-sm">
              Partagez votre musique avec le monde, suivez vos statistiques et connectez-vous avec vos fans.
            </p>
            <div className="py-2 px-4 rounded-full border border-purple-500/30 bg-transparent hover:bg-purple-500/10 inline-block font-medium text-purple-400 text-sm transition-colors">
              Commencer
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Composant wrapper qui fournit le contexte
const RoleSelection = () => {
  return (
    <AppProvider>
      <RoleSelectionContent />
    </AppProvider>
  );
};

export default RoleSelection;
