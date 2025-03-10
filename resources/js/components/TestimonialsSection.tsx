
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star, MessageCircle, ThumbsUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playHoverSound, playPopSound } from '@/utils/soundEffects';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  className?: string;
}

const Testimonial = ({ name, role, content, rating, image, className }: TestimonialProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      card.style.transition = 'none';
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleExpandClick = () => {
    playClickSound();
    setIsExpanded(!isExpanded);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      playPopSound();
    } else {
      playClickSound();
    }
    setIsLiked(!isLiked);
  };

  return (
    <motion.div 
      ref={cardRef}
      className={cn(
        "glass border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group",
        "transition-all duration-500 ease-spring",
        isExpanded ? "z-10" : "",
        className
      )}
      whileHover={{ translateY: -10 }}
      onClick={handleExpandClick}
      layout
      onHoverStart={() => playHoverSound()}
    >
      {/* Glow effects */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-audio-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <motion.div layout className="flex items-start gap-4 mb-4 relative z-10">
        <motion.div layout className="flex-shrink-0">
          <motion.div 
            layout
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <motion.img 
              src={image} 
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-audio-accent/30"
              whileHover={{ 
                borderColor: "rgba(14, 165, 233, 0.8)",
                transition: { duration: 0.2 }
              }}
            />
            <motion.div 
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-audio-dark border-2 border-audio-accent flex items-center justify-center"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Quote size={12} className="text-audio-accent" />
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div layout>
          <motion.h3 layout className="font-bold text-lg">{name}</motion.h3>
          <motion.p layout className="text-audio-light/60 text-sm">{role}</motion.p>
          <motion.div layout className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  size={14}
                  className={i < rating ? "text-audio-accent fill-audio-accent" : "text-audio-light/20"}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div layout className="relative z-10">
        <motion.p 
          className="text-audio-light/80 italic text-balance"
          animate={{ height: isExpanded ? "auto" : "3.6rem" }}
          style={{ 
            overflow: isExpanded ? "visible" : "hidden",
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "unset" : 3,
            WebkitBoxOrient: "vertical"
          }}
        >
          {content}
        </motion.p>
        
        {!isExpanded && content.length > 150 && (
          <motion.button
            className="text-audio-accent text-sm mt-1 flex items-center gap-1"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Lire plus
          </motion.button>
        )}
      </motion.div>
      
      {/* Actions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className={`flex items-center gap-1.5 ${isLiked ? 'text-audio-accent' : 'text-audio-light/60'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLikeClick}
            >
              <ThumbsUp size={16} className={isLiked ? 'fill-audio-accent' : ''} />
              <span className="text-sm">{isLiked ? 'Aimé' : 'J\'aime'}</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-1.5 text-audio-light/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
              }}
            >
              <MessageCircle size={16} />
              <span className="text-sm">Répondre</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-1.5 text-audio-light/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
              }}
            >
              <User size={16} />
              <span className="text-sm">Profil</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Interactive particles */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-audio-accent/60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-audio-dark via-audio-dark/95 to-audio-dark"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            className="px-3 py-1 text-xs font-medium rounded-full glass-accent text-audio-accent inline-block mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Témoignages
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Ce que disent nos utilisateurs
          </motion.h2>
          <motion.p 
            className="text-audio-light/70 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez les expériences de notre communauté et pourquoi ils ont choisi WeListen pour leur expérience musicale.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Testimonial 
              name="Emilie Melis" 
              role="Auditrice passionnée"
              image="https://media.licdn.com/dms/image/v2/D4E03AQFdclJ5pLKQmA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715625357073?e=1746662400&v=beta&t=6spDfNVuKQ6Q2oXY6n6TLIWmvaltH0kKkLcIS6smaOk"
              rating={5}
              content="Le site je m'en fous par contre Nassim est grave beau et musclé. Ah si, pourquoi y'a pas Seventeen ?"
              className="md:translate-y-8"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Testimonial 
              name="Rebecca Ringuet" 
              role="Productrice de musique"
              image="https://media.licdn.com/dms/image/v2/D4D03AQEl5s2vc0UxlQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714584081558?e=1746662400&v=beta&t=akvPTf0s1wthmZa1C1nMWH6gLRZSXLYi_LWKW3mFKGU"
              rating={5}
              content="En tant que productrice, WeListen me permet de suivre les tendances actuelles et de m'inspirer. J'ai déjà beaucoup miaulé mais Nassim est vraiment beau et séduisant pour conclure..."
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Testimonial 
              name="Lucas Dréano" 
              role="DJ & Musicien"
              image="https://media.licdn.com/dms/image/v2/D4E03AQGuGYFOiJgiMQ/profile-displayphoto-shrink_200_200/B4EZSW.y8BHgAY-/0/1737699832455?e=1746662400&v=beta&t=vu6fCpV8zqUt3KYqMtyO10tw1ESnP7W3Usyyp2DgBho"
              rating={4}
              content="Oui d'accord où sont les femmes et l'alcool ?"
              className="md:translate-y-8"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute -bottom-20 right-10 w-40 h-40 bg-audio-accent/15 rounded-full blur-3xl opacity-70"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.7, 0.4, 0.7],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute -top-20 left-10 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl opacity-70"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.3, 0.7],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
    </section>
  );
};

export default TestimonialsSection;
