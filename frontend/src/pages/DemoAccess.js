import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Target, 
  Crown, 
  Gamepad2, 
  Users,
  Zap,
  Eye,
  Lock,
  CheckCircle,
  Rocket,
  Menu,
  CreditCard,
  BarChart3,
  Gift,
  UserPlus,
  Wallet,
  Award,
  Shield
} from 'lucide-react';
import safeToast from '../utils/safeToast';

const DemoAccess = () => {
  const { login } = useAuth();
  
  const demoCredentials = {
    email: 'demo@tournament.com',
    password: 'demo123'
  };

  const handleDemoLogin = async () => {
    try {
      safeToast.success('Launching Demo Arena...');
      const result = await login(demoCredentials.email, demoCredentials.password);
      if (result.success) {
        safeToast.success('Welcome to the Elite Arena!');
      } else {
        safeToast.error(result.error || 'Demo login failed');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      safeToast.error('Failed to launch demo. Please try again.');
    }
  };

  const features = [
    {
      title: 'Ultra-Premium Hamburger Menu',
      description: 'God-tier animated hamburger with morphing lines, particle bursts, neon glow effects, and kinetic waves',
      icon: Menu,
      status: 'Enhanced',
      color: 'from-neon-blue to-electric-blue'
    },
    {
      title: 'Enhanced Paytm Payment Integration', 
      description: 'Premium QR code generation, real-time payment status checking, gaming-themed UI with battle coins',
      icon: CreditCard,
      status: 'New',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Live Tournament Brackets',
      description: 'Real-time tournament brackets with live match tracking, player stats, and spectator mode',
      icon: Trophy,
      status: 'Live',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Advanced Player Analytics',
      description: 'Comprehensive statistics, weapon analysis, achievements, rank progression, and performance metrics',
      icon: BarChart3,
      status: 'Active',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'AI-Powered Features',
      description: 'Smart matchmaking (94% accuracy), tournament predictions (87% accuracy), and player analytics',
      icon: Zap,
      status: 'AI',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Premium Wallet System',
      description: 'Enhanced wallet with battle coins, transaction history, quick payment packs, and gaming themes',
      icon: Wallet,
      status: 'Premium',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Achievement & Rewards System',
      description: 'Unlock achievements, earn rewards, rank progression, and showcase gaming prowess with 150+ achievements',
      icon: Award,
      status: 'Active',
      color: 'from-pink-500 to-red-500'
    },
    {
      title: 'Team Formation Hub',
      description: 'Create and manage teams, recruit players, participate in squad tournaments with 456+ active teams',
      icon: UserPlus,
      status: 'Active',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const quickStats = [
    { label: 'Total Players', value: '12,847', icon: Users },
    { label: 'Prize Pools', value: '₹2,45,000', icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative">
      {/* Particle Background */}
      <div className="absolute inset-0 particle-effect opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-20 w-20 md:h-32 md:w-32 mx-auto mb-6 bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red rounded-2xl md:rounded-3xl flex items-center justify-center"
            >
              <Gamepad2 className="h-10 w-10 md:h-16 md:w-16 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red font-gaming mb-4">
              FREE FIRE ARENA
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 font-gaming">
              ULTRA-ADVANCED GAMING PLATFORM 2025
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed px-4">
              Experience the future of online gaming tournaments with cutting-edge AI features,<br className="hidden md:block"/>
              premium Paytm integration, and god-tier UI design optimized for all devices
            </p>
          </motion.div>

          {/* Quick Stats - Removed "Active Tournaments" and "Live Matches" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 justify-center max-w-2xl mx-auto"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center glass rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-neon-blue mx-auto mb-2 md:mb-3" />
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-xs md:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6 md:mb-8 font-gaming">
              <div className="flex items-center justify-center space-x-3">
                <Rocket className="h-6 w-6 md:h-8 md:w-8 text-neon-blue" />
                <span>PREMIUM FEATURES SHOWCASE</span>
              </div>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                        feature.status === 'Live' ? 'bg-red-500 animate-pulse' :
                        feature.status === 'New' ? 'bg-green-500' :
                        feature.status === 'AI' ? 'bg-cyan-400' :
                        'bg-blue-500'
                      }`}></div>
                      <span className={`text-xs font-bold uppercase ${
                        feature.status === 'Live' ? 'text-red-400' :
                        feature.status === 'New' ? 'text-green-400' :
                        feature.status === 'AI' ? 'text-cyan-400' :
                        'text-blue-400'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white mb-2 md:mb-3 group-hover:text-neon-blue transition-colors leading-tight
                    /* Mobile: smaller, more compact text */
                    text-xs
                    /* Small mobile: slightly larger */
                    sm:text-sm 
                    /* Desktop: larger text */
                    md:text-lg
                  ">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed
                    /* Mobile: tiny text, 2 lines max */
                    text-2xs line-clamp-2
                    /* Small mobile: small text */
                    sm:text-xs sm:line-clamp-3
                    /* Desktop: normal text */
                    md:text-sm md:line-clamp-none
                  ">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center glass rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-neon-blue/30 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 font-gaming">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-neon-red" />
                <span>READY TO ENTER THE BATTLEFIELD?</span>
                <Target className="h-6 w-6 md:h-8 md:w-8 text-neon-blue" />
              </div>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed px-2">
              Experience the most advanced Free Fire tournament platform with premium features,<br className="hidden md:block"/>
              AI-powered matchmaking, and ultra-responsive design across all devices
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <motion.button
                onClick={handleDemoLogin}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl text-white font-bold text-lg md:text-xl shadow-glow w-full sm:w-auto justify-center group hover:shadow-glow-lg transition-all duration-300"
              >
                <Rocket className="h-5 w-5 md:h-6 md:w-6 group-hover:animate-bounce" />
                <span>Launch Demo</span>
                <Zap className="h-5 w-5 md:h-6 md:w-6 group-hover:animate-pulse" />
              </motion.button>
              
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-8 md:px-12 py-3 md:py-4 glass border border-white/20 rounded-xl text-white font-bold text-lg md:text-xl hover:border-neon-purple/50 w-full sm:w-auto justify-center group"
              >
                <Eye className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                <span>Manual Login</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DemoAccess;