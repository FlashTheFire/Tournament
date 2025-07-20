import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

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
        className="relative rounded-2xl group overflow-hidden mobile-friendly
          /* Mobile: compact padding */
          p-2.5
          /* Desktop: spacious padding */
          sm:p-3 lg:p-4
        "
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

        {/* Brand Logo Toggle */}
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{ 
            duration: 0.4, 
            type: "spring", 
            stiffness: 200, 
            damping: 20 
          }}
        >
          <motion.div
            className="bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-xl flex items-center justify-center
              /* Mobile: smaller logo */
              w-6 h-6
              /* Desktop: larger logo */
              sm:w-7 sm:h-7 lg:w-8 lg:h-8
            "
            animate={{
              boxShadow: isOpen || isHovered 
                ? '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)' 
                : '0 0 0px rgba(0, 212, 255, 0)',
            }}
            transition={{ duration: 0.3 }}
          >
            <Gamepad2 
              className="text-white drop-shadow-lg
                /* Mobile: smaller icon */
                h-3.5 w-3.5
                /* Desktop: larger icon */
                sm:h-4 sm:w-4 lg:h-5 lg:w-5
              " 
            />
          </motion.div>
          
          {/* Rotating ring effect */}
          <motion.div
            animate={{ rotate: isOpen ? -360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-white/20 rounded-xl
              /* Mobile: smaller ring */
              w-6 h-6
              /* Desktop: larger ring */
              sm:w-7 sm:h-7 lg:w-8 lg:h-8
            "
          />
        </motion.div>

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