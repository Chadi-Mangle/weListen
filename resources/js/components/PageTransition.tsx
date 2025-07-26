import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className 
}) => {
  const { url } = usePage();
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Reset scroll position when route changes
    window.scrollTo(0, 0);
  }, [url]);
  
  // Play sound on page load
  useEffect(() => {
    if (!showLoader) {
      try {
        const audio = new Audio('/sounds/swoosh.mp3');
        audio.volume = 0.3;
        audio.play();
      } catch (error) {
        console.error('Could not play sound:', error);
      }
    }
  }, [showLoader]);
  
  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Spring-like easing
        when: 'beforeChildren',
        staggerChildren: 0.15,
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        when: 'afterChildren',
        staggerChildren: 0.1,
        staggerDirection: -1,
      }
    }
  };
  
  const loaderVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };
  
  const progressVariants = {
    hidden: { width: '0%' },
    visible: { 
      width: '100%',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };
  
  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader ? (
          <motion.div
            key="loader"
            className="fixed inset-0 flex flex-col items-center justify-center bg-audio-dark z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loaderVariants}
          >
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 bg-gradient-audio rounded-full animate-pulse-soft"></div>
              <div className="absolute inset-2 bg-audio-dark rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-audio-light rounded-full"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6">WeListen</h2>
            <div className="w-48 h-1 bg-audio-surface/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-audio rounded-full"
                variants={progressVariants}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={url}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
            className={cn("min-h-screen", className)}
            onAnimationStart={() => setIsExiting(true)}
            onAnimationComplete={() => setIsExiting(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default PageTransition;