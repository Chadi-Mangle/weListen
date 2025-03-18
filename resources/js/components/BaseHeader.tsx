import React from 'react';
import { motion } from 'framer-motion';

interface BaseHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const BaseHeader: React.FC<BaseHeaderProps> = ({ children, className = '' }) => {
  return (
    <header className="w-full">
      <div className="container mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex justify-between items-center py-4 mb-4 ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </header>
  );
};

export default BaseHeader;