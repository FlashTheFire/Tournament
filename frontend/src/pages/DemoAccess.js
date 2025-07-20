import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Wallet, 
  Target, 
  Crown, 
  Gamepad2, 
  Users,
  Star,
  Shield,
  Zap,
  QrCode,
  Eye,
  Award,
  TrendingUp,
  Lock,
  CheckCircle
} from 'lucide-react';

const DemoAccess = () => {
  const demoCredentials = {
    email: 'demo@tournament.com',
    password: 'demo123'
  };

  const features = [
    {
      title: 'Ultra-Premium Hamburger Menu',
      description: 'God-tier animated hamburger with morphing lines, particle bursts, neon glow effects, and kinetic waves',
      icon: '🍔',
      status: 'Enhanced',
      color: 'from-neon-blue to-electric-blue'
    },
    {
      title: 'Enhanced Paytm Payment Integration', 
      description: 'Premium QR code generation, real-time payment status checking, gaming-themed UI with battle coins',
      icon: '💳',
      status: 'New',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Live Tournament Brackets',
      description: 'Real-time tournament brackets with live match tracking, player stats, and spectator mode',
      icon: '🏆',
      status: 'Live',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Advanced Player Analytics',
      description: 'Comprehensive statistics, weapon analysis, achievements, rank progression, and performance metrics',
      icon: '📊',
      status: 'Active',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'AI-Powered Features',
      description: 'Smart matchmaking (94% accuracy), tournament predictions (87% accuracy), and player analytics',
      icon: '🤖',
      status: 'AI',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Premium Wallet System',
      description: 'Enhanced wallet with battle coins, transaction history, quick payment packs, and gaming themes',
      icon: '💰',
      status: 'Premium',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Achievement & Rewards System',
      description: 'Unlock achievements, earn rewards, rank progression, and showcase gaming prowess with 150+ achievements',
      icon: '🏅',
      status: 'Active',
      color: 'from-pink-500 to-red-500'
    },
    {
      title: 'Team Formation Hub',
      description: 'Create and manage teams, recruit players, participate in squad tournaments with 456+ active teams',
      icon: '👥',
      status: 'Active',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const quickStats = [
    { label: 'Total Players', value: '12,847', icon: Users },
    { label: 'Active Tournaments', value: '23', icon: Trophy },
    { label: 'Live Matches', value: '67', icon: Target },
    { label: 'Prize Pools', value: '₹2,45,000', icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 particle-effect opacity-20"></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-32 w-32 mx-auto mb-8 bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red rounded-3xl flex items-center justify-center"
            >
              <Gamepad2 className="h-16 w-16 text-white" />
            </motion.div>

            <h1 className="text-7xl font-black text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red font-gaming mb-6">
              FREE FIRE ARENA
            </h1>
            <h2 className="text-3xl font-bold text-white mb-4 font-gaming">
              ULTRA-ADVANCED GAMING PLATFORM 2025
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the future of online gaming tournaments with cutting-edge AI features,<br/>
              premium Paytm integration, and god-tier UI design optimized for all devices
            </p>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block glass rounded-2xl p-8 border border-neon-green/30 bg-gradient-to-r from-neon-green/10 to-emerald-500/10 mb-12"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-gaming">DEMO ACCESS</h3>
                  <p className="text-neon-green text-sm font-semibold">Full access to all premium features</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-4 border border-white/20">
                  <p className="text-gray-400 text-sm mb-2">Email Address</p>
                  <div className="flex items-center space-x-3">
                    <code className="text-xl font-mono text-white bg-black/30 px-4 py-2 rounded-lg flex-1">
                      {demoCredentials.email}
                    </code>
                    <CheckCircle className="h-5 w-5 text-neon-green" />
                  </div>
                </div>
                
                <div className="glass rounded-xl p-4 border border-white/20">
                  <p className="text-gray-400 text-sm mb-2">Password</p>
                  <div className="flex items-center space-x-3">
                    <code className="text-xl font-mono text-white bg-black/30 px-4 py-2 rounded-lg flex-1">
                      {demoCredentials.password}
                    </code>
                    <CheckCircle className="h-5 w-5 text-neon-green" />
                  </div>
                </div>
              </div>
              
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 mt-6 px-8 py-4 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl text-white font-bold text-lg shadow-glow"
              >
                <span>🚀 Launch Demo</span>
                <Zap className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-neon-blue mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-8 font-gaming">
              🚀 PREMIUM FEATURES SHOWCASE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${
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
                  
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
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
            className="text-center glass rounded-3xl p-12 border border-neon-blue/30 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-gaming">
              READY TO ENTER THE BATTLEFIELD? ⚔️
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the most advanced Free Fire tournament platform with premium features,<br/>
              AI-powered matchmaking, and ultra-responsive design across all devices
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl text-white font-bold text-xl shadow-glow"
              >
                <Trophy className="h-6 w-6" />
                <span>Start Gaming</span>
              </motion.a>
              
              <motion.a
                href="/hamburger-demo"
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-12 py-4 glass border border-white/20 rounded-xl text-white font-bold text-xl hover:border-neon-purple/50"
              >
                <Eye className="h-6 w-6" />
                <span>View Demo</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DemoAccess;