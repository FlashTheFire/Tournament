import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumHamburgerMenu = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setClickEffect(true);
    onClick();
    
    // Reset click effect
    setTimeout(() => setClickEffect(false), 600);
  };

  // Particle burst effect on click
  const ParticleBurst = ({ active }) => {
    if (!active) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
              x: Math.cos(i * 30 * Math.PI / 180) * 40,
              y: Math.sin(i * 30 * Math.PI / 180) * 40,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-neon-blue rounded-full"
            style={{
              background: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#8b5cf6' : '#ff0080',
              boxShadow: `0 0 6px ${i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#8b5cf6' : '#ff0080'}`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Particle Burst Effect */}
      <ParticleBurst active={clickEffect} />
      
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative p-4 rounded-2xl group overflow-hidden mobile-friendly"
        style={{
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(139, 92, 246, 0.15))' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.2)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Kinetic Background Wave */}
        <motion.div
          animate={{
            background: isHovered
              ? [
                  'linear-gradient(45deg, rgba(0, 212, 255, 0.05), rgba(139, 92, 246, 0.05))',
                  'linear-gradient(45deg, rgba(139, 92, 246, 0.05), rgba(255, 0, 128, 0.05))',
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.05), rgba(0, 212, 255, 0.05))'
                ]
              : 'transparent',
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
          className="absolute inset-0 rounded-2xl"
        />

        {/* Premium Hamburger Lines */}
        <div className="relative w-6 h-6 flex flex-col justify-center items-center">
          {/* Top Line */}
          <motion.span
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0,
              scaleX: isOpen ? 1.1 : 1,
            }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="block h-0.5 w-6 rounded-full mb-1.5 origin-center"
            style={{
              background: isOpen || isHovered 
                ? 'linear-gradient(90deg, #00d4ff, #8b5cf6, #ff0080)' 
                : 'rgba(255, 255, 255, 0.8)',
              boxShadow: isOpen || isHovered 
                ? '0 0 10px rgba(0, 212, 255, 0.5)' 
                : 'none'
            }}
          />

          {/* Middle Line */}
          <motion.span
            animate={{
              opacity: isOpen ? 0 : 1,
              scaleX: isOpen ? 0 : 1,
            }}
            transition={{ 
              duration: 0.15,
              delay: isOpen ? 0 : 0.1
            }}
            className="block h-0.5 w-6 rounded-full mb-1.5"
            style={{
              background: isHovered 
                ? 'linear-gradient(90deg, #8b5cf6, #ff0080, #00d4ff)' 
                : 'rgba(255, 255, 255, 0.8)',
              boxShadow: isHovered 
                ? '0 0 10px rgba(139, 92, 246, 0.5)' 
                : 'none'
            }}
          />

          {/* Bottom Line */}
          <motion.span
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0,
              scaleX: isOpen ? 1.1 : 1,
            }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="block h-0.5 w-6 rounded-full origin-center"
            style={{
              background: isOpen || isHovered 
                ? 'linear-gradient(90deg, #ff0080, #00d4ff, #8b5cf6)' 
                : 'rgba(255, 255, 255, 0.8)',
              boxShadow: isOpen || isHovered 
                ? '0 0 10px rgba(255, 0, 128, 0.5)' 
                : 'none'
            }}
          />
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Click Pulse Effect */}
        <AnimatePresence>
          {clickEffect && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl border-2 border-neon-blue pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Touch Feedback Ring */}
      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl border border-neon-blue pointer-events-none md:hidden"
      />
    </div>
  );
};

export default PremiumHamburgerMenu;