import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumHamburgerMenu from '../components/PremiumHamburgerMenu';

const HamburgerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 particle-effect opacity-30"></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-black text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red font-gaming mb-4">
              PREMIUM HAMBURGER MENU
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Ultra-Advanced Gaming UI for 2025 • God-Tier Design • Premium Branded • Fast
            </p>
          </motion.div>

          {/* Demo Navigation Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-6 mb-12 border border-white/20"
          >
            <div className="flex items-center justify-between">
              {/* Left: Hamburger Menu */}
              <div className="flex items-center space-x-6">
                <PremiumHamburgerMenu onClick={() => setIsOpen(!isOpen)} />
                
                {/* Brand Logo */}
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg font-gaming">FREE FIRE</h2>
                    <p className="text-neon-blue text-xs font-semibold">ULTIMATE ARENA</p>
                  </div>
                </div>
              </div>

              {/* Right: Mock Navigation */}
              <div className="flex items-center space-x-4">
                <div className="glass rounded-xl px-4 py-2 border border-neon-green/30">
                  <span className="text-neon-green font-semibold">₹25,000</span>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-neon-purple to-electric-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Morphing Animation",
                desc: "Lines transform from hamburger to X with spring physics",
                icon: "🔄",
                color: "from-neon-blue to-electric-blue"
              },
              {
                title: "Particle Burst",
                desc: "12 neon particles burst outward on click interaction",
                icon: "✨",
                color: "from-electric-purple to-neon-purple"
              },
              {
                title: "Kinetic Waves",
                desc: "Animated background waves with gradient effects",
                icon: "🌊",
                color: "from-neon-red to-pink-500"
              },
              {
                title: "Neon Glow",
                desc: "Hover effects with premium neon lighting",
                icon: "💫",
                color: "from-neon-green to-emerald-500"
              },
              {
                title: "Glassmorphic",
                desc: "Backdrop blur with translucent depth effects",
                icon: "🔮",
                color: "from-yellow-400 to-orange-500"
              },
              {
                title: "Mobile Optimized",
                desc: "Touch-friendly with device-specific animations",
                icon: "📱",
                color: "from-cyan-400 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 border border-neon-blue/30 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4 font-gaming">
              INTERACTIVE DEMO
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Click the hamburger menu above to experience the ultra-advanced animations:
              morphing lines, particle bursts, neon glow effects, and smooth state transitions.
              Test on different devices to see responsive optimizations.
            </p>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-neon-green animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-semibold text-white">
                  Menu: {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse"></div>
                <span className="text-sm font-semibold text-white">
                  Animations: ACTIVE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerDemo;