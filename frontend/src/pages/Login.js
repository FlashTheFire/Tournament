import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Gamepad2, Trophy, Zap, Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import safeToast from '../utils/safeToast';
import { formatNumber, formatPrizePool } from '../utils/numberFormatter';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔵 Starting login process...');
      console.log('Form data:', formData);
      
      const result = await login(formData.email, formData.password);
      console.log('🔵 Login result received:', result);
      
      if (result.success) {
        safeToast.success('Welcome back! 🎮');
        navigate('/');
      } else {
        console.log('🔴 Login failed with error:', result.error);
        console.log('🔴 Error type:', typeof result.error);
        
        // Use safe toast for error messages
        console.log('🔵 Processed error message:', result.error);
        safeToast.error(result.error);
      }
    } catch (error) {
      console.error('🔴 Login catch block error:', error);
      console.error('🔴 Error type:', typeof error);
      console.error('🔴 Error structure:', JSON.stringify(error, null, 2));
      safeToast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
      {/* Advanced Particle Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="kinetic-waves"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-neon-blue rounded-full animate-particle"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-neon-purple rounded-full animate-particle" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-neon-red rounded-full animate-particle" style={{animationDelay: '2s'}}></div>
      
      {/* Horizontal Layout Container */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md space-y-6 lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16 lg:space-y-0 lg:items-center"
        >
          {/* Left Section - Brand/Hero */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Enhanced Brand Logo */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="h-20 w-20 lg:h-24 lg:w-24 bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-3xl flex items-center justify-center shadow-glow-lg relative"
              >
                <Trophy className="h-10 w-10 lg:h-12 lg:w-12 text-white drop-shadow-lg" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/20 rounded-3xl"
                />
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold text-white font-gaming leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gradient bg-gradient-to-r from-neon-blue to-electric-purple">
                    FREE FIRE
                  </span>
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl lg:text-3xl font-bold text-white"
                >
                  ULTIMATE ARENA
                </motion.h2>
              </div>
            </div>
            
            {/* Hero Text - Desktop Only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden lg:block space-y-6"
            >
              <p className="text-xl text-gray-300 leading-relaxed">
                Enter the battlefield and claim victory in the ultimate Free Fire tournament experience
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Trophy, label: 'Tournaments', value: '150+', color: 'text-yellow-400' },
                  { icon: Gamepad2, label: 'Players', value: '45K+', color: 'text-neon-blue' },
                  { icon: Crown, label: 'Prize Pool', value: '₹5M', color: 'text-neon-green' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center glass rounded-xl p-4"
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-md mx-auto lg:max-w-lg"
          >
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 text-base"
              >
                Enter the battlefield and claim victory
              </motion.p>
            </div>

            {/* Enhanced Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="glass rounded-3xl p-8 space-y-8 kinetic-waves relative"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-gaming">
                  Welcome Back
                </h3>
                <p className="text-gray-400">Sign in to your gaming account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enhanced Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-neon-blue" />
                    <span>Email or Username</span>
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 text-lg"
                      placeholder="Enter email or username"
                    />
                  </motion.div>
                </div>

                {/* Enhanced Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-neon-purple" />
                    <span>Password</span>
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-14 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple transition-all duration-300 text-lg"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-premium py-4 text-xl font-bold ripple mobile-friendly group relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Entering Arena...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-3"
                      >
                        <Gamepad2 className="h-6 w-6 group-hover:animate-pulse" />
                        <span>ENTER ARENA</span>
                        <Zap className="h-6 w-6 group-hover:animate-bounce" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Separator Line */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              </div>

              {/* Premium Google Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold transition-all duration-300 ripple mobile-friendly group flex items-center justify-center space-x-3 shadow-lg"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="h-6 w-6 group-hover:scale-110 transition-transform"
                />
                <span className="text-lg">Continue with Google</span>
                <Crown className="h-5 w-5 text-yellow-500 group-hover:animate-pulse" />
              </motion.button>

              {/* Enhanced Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-400">
                  New warrior?{' '}
                  <Link
                    to="/register"
                    className="text-neon-blue hover:text-electric-blue font-semibold transition-colors relative group"
                  >
                    <span className="relative z-10">Join the Arena</span>
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-blue to-electric-purple group-hover:w-full transition-all duration-300"
                      whileHover={{ width: '100%' }}
                    />
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;