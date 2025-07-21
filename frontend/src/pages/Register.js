import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, Trophy, Gamepad2, Zap, Crown, Shield, Star, User, MapPin, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import safeToast from '../utils/safeToast';
import { apiService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    free_fire_uid: '',
    region: 'ind' // default to India
  });
  
  const [validationState, setValidationState] = useState({
    passwordMatch: 'initial', // 'initial', 'match', 'no-match'
    uidValidation: 'initial', // 'initial', 'validating', 'valid', 'invalid'
    playerInfo: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Free Fire regions with country flags
  const regions = [
    { code: 'ind', name: 'India', flag: '🇮🇳' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
    { code: 'ru', name: 'Russia', flag: '🇷🇺' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'tw', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'vn', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'th', name: 'Thailand', flag: '🇹🇭' },
    { code: 'me', name: 'Middle East', flag: '🌍' },
    { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'cis', name: 'CIS', flag: '🌍' },
    { code: 'bd', name: 'Bangladesh', flag: '🇧🇩' }
  ];

  // Debounced Free Fire UID validation
  useEffect(() => {
    const validateUID = async () => {
      if (formData.free_fire_uid && formData.region && formData.free_fire_uid.length >= 8) {
        setValidationState(prev => ({ ...prev, uidValidation: 'validating' }));
        
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/validate-freefire?uid=${formData.free_fire_uid}&region=${formData.region}`
          );
          const data = await response.json();
          
          if (data.valid) {
            setValidationState(prev => ({
              ...prev,
              uidValidation: 'valid',
              playerInfo: data.player_info
            }));
          } else {
            setValidationState(prev => ({
              ...prev,
              uidValidation: 'invalid',
              playerInfo: null
            }));
          }
        } catch (error) {
          console.error('UID validation error:', error);
          setValidationState(prev => ({
            ...prev,
            uidValidation: 'invalid',
            playerInfo: null
          }));
        }
      } else {
        setValidationState(prev => ({
          ...prev,
          uidValidation: 'initial',
          playerInfo: null
        }));
      }
    };

    const timeout = setTimeout(validateUID, 500); // Debounce for 500ms
    return () => clearTimeout(timeout);
  }, [formData.free_fire_uid, formData.region]);

  // Password match validation
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        setValidationState(prev => ({ ...prev, passwordMatch: 'match' }));
      } else {
        setValidationState(prev => ({ ...prev, passwordMatch: 'no-match' }));
      }
    } else {
      setValidationState(prev => ({ ...prev, passwordMatch: 'initial' }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate Free Fire UID is valid
    if (validationState.uidValidation !== 'valid') {
      safeToast.error('Please enter a valid Free Fire UID and region');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (validationState.passwordMatch !== 'match') {
      safeToast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      safeToast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        free_fire_uid: formData.free_fire_uid,
        region: formData.region
      };

      const result = await register(userData);
      if (result.success) {
        safeToast.success(`Welcome to the Arena, ${validationState.playerInfo?.nickname}! 🎉🔥`);
        navigate('/');
      } else {
        // Check if it's a validation error from backend
        if (result.error && result.error.includes('Free Fire')) {
          safeToast.error(result.error);
        } else {
          safeToast.error(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      safeToast.error('Registration failed. Please try again.');
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
      <div className="absolute top-20 left-20 w-2 h-2 bg-neon-purple rounded-full animate-particle"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-neon-blue rounded-full animate-particle" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-neon-red rounded-full animate-particle" style={{animationDelay: '2s'}}></div>
      
      {/* Horizontal Layout Container with reduced mobile height */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-4 lg:px-12 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md space-y-4 lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16 lg:space-y-0 lg:items-center"
        >
          {/* Left Section - Brand/Hero */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            {/* Enhanced Brand Logo */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="h-16 w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-neon-purple via-electric-blue to-neon-red rounded-3xl flex items-center justify-center shadow-glow-lg relative"
              >
                <UserPlus className="h-8 w-8 lg:h-10 lg:w-10 text-white drop-shadow-lg" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/20 rounded-3xl"
                />
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-3xl lg:text-5xl font-bold text-white font-gaming leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gradient bg-gradient-to-r from-neon-purple to-electric-blue">
                    JOIN THE
                  </span>
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl lg:text-2xl font-bold text-white"
                >
                  ELITE WARRIORS
                </motion.h2>
              </div>
            </div>
            
            {/* Hero Text - Desktop Only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden lg:block space-y-4"
            >
              <p className="text-lg text-gray-300 leading-relaxed">
                Create your account and join thousands of elite warriors in the ultimate Free Fire arena
              </p>
              
              {/* Benefits List */}
              <div className="space-y-2">
                {[
                  { icon: Trophy, text: 'Access to premium tournaments' },
                  { icon: Zap, text: 'AI-powered matchmaking system' },
                  { icon: Crown, text: 'Exclusive rewards and prizes' },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-400"
                  >
                    <benefit.icon className="h-5 w-5 text-neon-blue" />
                    <span>{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-md mx-auto lg:max-w-lg"
          >
            {/* Mobile Header */}
            <div className="text-center mb-4 lg:hidden">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 text-sm"
              >
                Join the ultimate gaming arena
              </motion.p>
            </div>

            {/* Enhanced Form with reduced mobile height */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="glass rounded-3xl p-6 lg:p-8 space-y-4 lg:space-y-6 kinetic-waves relative"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 font-gaming">
                  Create Account
                </h3>
                <p className="text-gray-400 text-sm">Start your gaming journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-neon-green" />
                    <span>Email</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 lg:py-3 glass rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all duration-300 text-sm lg:text-base"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Free Fire UID and Region Row */}
                <div className="grid grid-cols-3 gap-3 lg:gap-4">
                  <div className="col-span-2">
                    <label htmlFor="free_fire_uid" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <User className="h-3 w-3 text-neon-blue" />
                      <span>Free Fire UID</span>
                    </label>
                    <div className="relative">
                      <input
                        id="free_fire_uid"
                        name="free_fire_uid"
                        type="text"
                        required
                        value={formData.free_fire_uid}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 lg:py-3 glass rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                          validationState.uidValidation === 'valid' ? 'focus:ring-green-500 border-green-500' :
                          validationState.uidValidation === 'invalid' ? 'focus:ring-red-500 border-red-500' :
                          'focus:ring-neon-blue'
                        }`}
                        placeholder="Enter Free Fire UID"
                      />
                      
                      {/* Validation Icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validationState.uidValidation === 'validating' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                          />
                        )}
                        {validationState.uidValidation === 'valid' && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                        {validationState.uidValidation === 'invalid' && (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-neon-purple" />
                      <span>Region</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 lg:py-3 glass rounded-lg lg:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all duration-300 text-sm lg:text-base bg-cosmic-dark"
                    >
                      {regions.map(region => (
                        <option key={region.code} value={region.code} className="bg-cosmic-dark text-white">
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Player Info Display */}
                <AnimatePresence>
                  {validationState.uidValidation === 'valid' && validationState.playerInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass rounded-lg p-3 bg-green-500/10 border border-green-500/30"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-semibold text-sm">Player Verified</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Nickname:</span>
                          <span className="text-white font-semibold ml-2">{validationState.playerInfo.nickname}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white font-semibold ml-2">{validationState.playerInfo.level}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rank:</span>
                          <span className="text-white font-semibold ml-2">#{validationState.playerInfo.rank}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Region:</span>
                          <span className="text-white font-semibold ml-2">{validationState.playerInfo.region}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password and Confirm Password Row */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <Lock className="h-3 w-3 text-neon-red" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 pr-12 py-2.5 lg:py-3 glass rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                          validationState.passwordMatch === 'initial' ? 'focus:ring-yellow-400 border-yellow-400' :
                          validationState.passwordMatch === 'match' ? 'focus:ring-green-500 border-green-500' :
                          'focus:ring-red-500 border-red-500'
                        }`}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <Lock className="h-3 w-3 text-neon-red" />
                      <span>Confirm Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 pr-12 py-2.5 lg:py-3 glass rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                          validationState.passwordMatch === 'initial' ? 'focus:ring-yellow-400 border-yellow-400' :
                          validationState.passwordMatch === 'match' ? 'focus:ring-green-500 border-green-500' :
                          'focus:ring-red-500 border-red-500'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {(formData.password || formData.confirmPassword) && (
                  <div className="flex items-center space-x-2 text-xs">
                    {validationState.passwordMatch === 'initial' && (
                      <>
                        <Clock className="h-3 w-3 text-yellow-400" />
                        <span className="text-yellow-400">Enter passwords to validate</span>
                      </>
                    )}
                    {validationState.passwordMatch === 'match' && (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">Passwords match</span>
                      </>
                    )}
                    {validationState.passwordMatch === 'no-match' && (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || validationState.uidValidation !== 'valid' || validationState.passwordMatch !== 'match'}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 lg:py-4 text-lg lg:text-xl font-bold ripple mobile-friendly group relative overflow-hidden mt-4 transition-all duration-300 ${
                    loading || validationState.uidValidation !== 'valid' || validationState.passwordMatch !== 'match'
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'btn-premium'
                  }`}
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
                        <span>Creating Account...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-3"
                      >
                        <UserPlus className="h-5 w-5 group-hover:animate-pulse" />
                        <span>JOIN ARENA</span>
                        <Zap className="h-5 w-5 group-hover:animate-bounce" />
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

              {/* Premium Google Sign Up Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 py-3 lg:py-4 px-6 rounded-xl font-bold transition-all duration-300 ripple mobile-friendly group flex items-center justify-center space-x-3 shadow-lg"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                />
                <span className="text-base lg:text-lg">Sign up with Google</span>
                <Crown className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
              </motion.button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already a warrior?{' '}
                  <Link
                    to="/login"
                    className="text-neon-blue hover:text-electric-blue font-semibold transition-colors relative group"
                  >
                    <span className="relative z-10">Sign In</span>
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
  );
};

export default Register;