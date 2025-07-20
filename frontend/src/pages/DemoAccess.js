import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Gamepad2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import safeToast from '../utils/safeToast';

const DemoAccess = () => {
  const [formData, setFormData] = useState({
    email: 'demo@tournament.com',
    password: 'demo123'
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
        safeToast.error(result.error);
      }
    } catch (error) {
      console.error('🔴 Login catch block error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
      {/* Advanced Particle Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="kinetic-waves"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-neon-blue rounded-full animate-particle"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-neon-purple rounded-full animate-particle" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-neon-red rounded-full animate-particle" style={{animationDelay: '2s'}}></div>
      
      {/* Left-aligned Login Form Container */}
      <div className="min-h-screen flex items-center justify-start relative z-10 px-4 py-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md lg:max-w-lg"
        >
          {/* Enhanced Login Form - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="glass rounded-3xl p-8 space-y-8 kinetic-waves relative"
          >
            <div className="text-left">
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoAccess;