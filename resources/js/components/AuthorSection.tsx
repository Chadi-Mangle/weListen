
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, TwitterIcon, Mail, Code } from 'lucide-react';
import { playClickSound, playHoverSound } from '@/utils/soundEffects';

interface AuthorProps {
  name: string;
  role: string;
  description: string;
  image: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

const Author = ({ name, role, description, image, github, linkedin, twitter, email }: AuthorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    playClickSound();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden bg-audio-surface border border-white/10 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => playHoverSound()}
      layout
    >
      <div 
        className="cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
          <motion.img 
            src={image} 
            alt={name}
            className="w-full h-64 object-cover object-center"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Interactive circles */}
          <motion.div 
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-audio-accent/20 blur-xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </div>
        
        <div className="p-6">
          <motion.h3 
            className="text-2xl font-bold mb-1"
            layout
          >
            {name}
          </motion.h3>
          <motion.p 
            className="text-audio-accent mb-3"
            layout
          >
            {role}
          </motion.p>
          
          <motion.p 
            className="text-audio-light/70"
            initial={{ height: "4.5rem", overflow: "hidden" }}
            animate={{ 
              height: isExpanded ? "auto" : "4.5rem",
              overflow: isExpanded ? "visible" : "hidden"
            }}
          >
            {description}
          </motion.p>
          
          <motion.button
            className="text-audio-accent mt-2 text-sm flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </motion.button>
        </div>
      </div>
      
      {/* Social links - only visible when expanded */}
      <motion.div 
        className="flex justify-center gap-4 p-4 border-t border-white/10"
        initial={{ opacity: 0, height: 0, padding: 0 }}
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
          padding: isExpanded ? 16 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {github && (
          <motion.a 
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center group"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
            }}
            onHoverStart={() => playHoverSound()}
          >
            <GithubIcon size={20} className="text-audio-light/70 group-hover:text-audio-accent transition-colors" />
          </motion.a>
        )}
        
        {linkedin && (
          <motion.a 
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center group"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
            }}
            onHoverStart={() => playHoverSound()}
          >
            <LinkedinIcon size={20} className="text-audio-light/70 group-hover:text-audio-accent transition-colors" />
          </motion.a>
        )}
        
        {twitter && (
          <motion.a 
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center group"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
            }}
            onHoverStart={() => playHoverSound()}
          >
            <TwitterIcon size={20} className="text-audio-light/70 group-hover:text-audio-accent transition-colors" />
          </motion.a>
        )}
        
        {email && (
          <motion.a 
            href={`mailto:${email}`}
            className="w-10 h-10 rounded-full glass flex items-center justify-center group"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
            }}
            onHoverStart={() => playHoverSound()}
          >
            <Mail size={20} className="text-audio-light/70 group-hover:text-audio-accent transition-colors" />
          </motion.a>
        )}
      </motion.div>
      
      {/* Animated background effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[-1] opacity-0"
        animate={{ 
          opacity: isExpanded ? 0.1 : 0
        }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-audio-accent/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
      </motion.div>
    </motion.div>
  );
};

const AuthorSection = () => {
  return (
    <section id="authors" className="py-24 px-6 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 text-xs font-medium rounded-full glass-accent text-audio-accent inline-block mb-4">
            Notre Équipe
          </span>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Les créateurs derrière <span className="text-transparent bg-clip-text bg-gradient-audio">WeListen</span>
          </motion.h2>
          <motion.p 
            className="text-audio-light/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez l'équipe passionnée derrière cette plateforme de streaming audio innovante
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Author 
            name="Nassim"
            role="Développeur Frontend & UI Designer"
            image="https://images.steamusercontent.com/ugc/914672103686079071/3D94A72C811C97A8F17C0B1B57C926CBF073CF0C/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
            description="Dites que vous aimez notre site web svp."
            github="https://github.com/NassimEH"
            linkedin="https://www.linkedin.com/in/nassim-elhaddad/"
            twitter="https://twitter.com/nassim"
            email="nassim@welisten.com"
          />
          
          <Author 
            name="Chadi"
            role="Développeur Backend & Architecte"
            image="https://benkei-studio.com/cdn/shop/articles/gto-onizuka-moto.jpg?v=1729586029"
            description="Chadi Manglon."
            github="https://github.com/chadi"
            linkedin="https://linkedin.com/in/chadi"
            twitter="https://twitter.com/chadi"
            email="chadi@welisten.com"
          />
        </div>
      </div>
      
      {/* Background elements */}
      <motion.div 
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-audio-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </section>
  );
};

export default AuthorSection;
