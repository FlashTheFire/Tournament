import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Gamepad2, Trophy, Zap, Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Welcome back! 🎮');
        // Navigate to home page after successful login
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
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
      <div className="min-h-screen flex items-center justify-center relative z-10 
        /* Mobile: vertical layout with padding */
        px-4 py-8
        /* Desktop: horizontal layout */
        lg:px-12
      ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="
            /* Mobile: standard vertical layout */
            w-full max-w-md space-y-6
            /* Desktop: horizontal card layout */
            lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-12 lg:space-y-0 lg:items-center
          "
        >
        {/* Enhanced Header with Logo on Left Side */}
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Logo moved to left side */}
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="h-16 w-16 bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-3xl flex items-center justify-center shadow-glow-lg relative flex-shrink-0"
            >
              <Trophy className="h-8 w-8 text-white drop-shadow-lg" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-white/20 rounded-3xl"
              />
            </motion.div>
            
            {/* Title alongside logo */}
            <div className="text-left">
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold text-white font-gaming leading-tight"
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
                className="text-lg sm:text-xl font-bold text-white"
              >
                ULTIMATE ARENA
              </motion.h2>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 text-sm sm:text-base"
          >
            Enter the battlefield and claim victory
          </motion.p>
        </div>

        {/* Enhanced Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="glass rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 kinetic-waves relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-neon-blue" />
                <span>Email Address</span>
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
                  placeholder="Enter your email"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border border-neon-blue/0 pointer-events-none"
                  whileFocus={{ borderColor: 'rgba(0, 212, 255, 0.5)' }}
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
                  className="w-full pl-12 pr-14 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple transition-all duration-300"
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
              className="w-full btn-premium py-4 text-lg font-bold ripple mobile-friendly group relative overflow-hidden"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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

          {/* Enhanced Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass rounded-full text-gray-400 border border-white/10">
                Or continue with
              </span>
            </div>
          </div>

          {/* Enhanced Google Sign In */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full glass border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all duration-300 ripple mobile-friendly group"
          >
            <div className="flex items-center justify-center space-x-3">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="h-6 w-6 group-hover:scale-110 transition-transform"
              />
              <span>Continue with Google</span>
              <Crown className="h-5 w-5 text-yellow-400 group-hover:animate-pulse" />
            </div>
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

        {/* Enhanced Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6 text-center text-sm border border-neon-green/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-neon-green" />
              <p className="font-bold text-white">Demo Access</p>
              <Star className="h-5 w-5 text-neon-green" />
            </div>
            <div className="space-y-1 text-gray-300">
              <p><span className="font-medium text-neon-blue">Email:</span> demo@tournament.com</p>
              <p><span className="font-medium text-neon-purple">Password:</span> demo123</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Quick access to explore the arena
            </p>
          </div>
        </motion.div>

        {/* Added bottom spacing to prevent glitching */}
        <div className="h-16 sm:h-20"></div>
      </motion.div>
    </div>
  );
};

export default Login;