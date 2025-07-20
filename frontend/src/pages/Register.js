import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Trophy, Gamepad2, Zap, Crown, Shield, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    full_name: '',
    free_fire_uid: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        full_name: formData.full_name,
        free_fire_uid: formData.free_fire_uid || null
      };

      const result = await register(userData);
      if (result.success) {
        toast.success('Welcome to the Arena! Account created successfully! 🎉🔥');
        // Navigate to home page after successful registration
        navigate('/');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
      {/* Advanced Particle Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="kinetic-waves"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-neon-blue rounded-full animate-particle"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-neon-purple rounded-full animate-particle" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-neon-red rounded-full animate-particle" style={{animationDelay: '2s'}}></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-lg space-y-8 relative z-10"
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
              <Crown className="h-8 w-8 text-white drop-shadow-lg" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-white/20 rounded-3xl"
              />
            </motion.div>
            
            {/* Title alongside logo */}
            <div className="text-left">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-gaming leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-gradient bg-gradient-to-r from-neon-blue to-electric-purple">
                  JOIN THE ARENA
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm sm:text-base lg:text-xl font-bold text-white"
              >
                BECOME AN ELITE WARRIOR
              </motion.h2>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 text-sm sm:text-base"
          >
            Enter your details to join the ultimate Free Fire battles
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
            {/* Grid Layout for Name and Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <User className="h-4 w-4 text-neon-blue" />
                  <span>Full Name</span>
                </label>
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </motion.div>
              </div>

              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <UserPlus className="h-4 w-4 text-neon-purple" />
                  <span>Username</span>
                </label>
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple transition-all duration-300"
                    placeholder="Choose a username"
                  />
                </motion.div>
              </div>
            </div>

            {/* Email Input */}
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
                  placeholder="Enter your email address"
                />
              </motion.div>
            </div>

            {/* Free Fire UID Input */}
            <div>
              <label htmlFor="free_fire_uid" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4 text-neon-green" />
                <span>Free Fire UID</span>
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Gamepad2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="free_fire_uid"
                  name="free_fire_uid"
                  type="text"
                  value={formData.free_fire_uid}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all duration-300"
                  placeholder="Enter your Free Fire UID"
                />
              </motion.div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Input */}
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
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-neon-red" />
                  <span>Confirm Password</span>
                </label>
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-14 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-neon-red transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </motion.div>
              </div>
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
                    <span>Joining Arena...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center space-x-3"
                  >
                    <Crown className="h-6 w-6 group-hover:animate-pulse" />
                    <span>CREATE ELITE ACCOUNT</span>
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

          {/* Enhanced Google Sign Up */}
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
              <span>Sign up with Google</span>
              <Crown className="h-5 w-5 text-yellow-400 group-hover:animate-pulse" />
            </div>
          </motion.button>

          {/* Enhanced Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already a warrior?{' '}
              <Link
                to="/login"
                className="text-neon-blue hover:text-electric-blue font-semibold transition-colors relative group"
              >
                <span className="relative z-10">Enter the Arena</span>
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-blue to-electric-purple group-hover:w-full transition-all duration-300"
                  whileHover={{ width: '100%' }}
                />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Enhanced Benefits Card */}
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
              <p className="font-bold text-white">Join Elite Warriors</p>
              <Star className="h-5 w-5 text-neon-green" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 text-xs">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Exclusive Tournaments</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <Zap className="h-4 w-4 text-neon-blue" />
                <span>AI Matchmaking</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <Crown className="h-4 w-4 text-neon-purple" />
                <span>Premium Features</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Added bottom spacing to prevent glitching */}
        <div className="h-16 sm:h-20"></div>
      </motion.div>
    </div>
  );
};

export default Register;