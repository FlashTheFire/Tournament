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

  // Free Fire regions with country flags (removed Middle East and CIS as requested)
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
    { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'bd', name: 'Bangladesh', flag: '🇧🇩' }
  ];

  // Debounced Free Fire UID validation
  useEffect(() => {
    const validateUID = async () => {
      if (formData.free_fire_uid && formData.region && formData.free_fire_uid.length >= 8) {
        setValidationState(prev => ({ ...prev, uidValidation: 'validating' }));
        
        try {
          const response = await apiService.validateFreeFireUID(formData.free_fire_uid, formData.region);
          console.log('🔑 Free Fire validation response:', response);
          
          if (response.valid) {
            setValidationState(prev => ({
              ...prev,
              uidValidation: 'valid',
              playerInfo: response.player_info
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
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden register-scrollbar">
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

                {/* Free Fire UID and Region Row - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  {/* Free Fire UID Field */}
                  <div>
                    <label htmlFor="free_fire_uid" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <User className="h-3 w-3 text-neon-blue" />
                      <span>Free Fire UID</span>
                    </label>
                    <div className="relative">
                      <input
                        id="free_fire_uid"
                        name="free_fire_uid"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={formData.free_fire_uid}
                        onChange={(e) => {
                          // Only allow numeric input
                          const numericValue = e.target.value.replace(/[^0-9]/g, '');
                          // Limit to 12 digits
                          if (numericValue.length <= 12) {
                            setFormData(prev => ({
                              ...prev,
                              free_fire_uid: numericValue
                            }));
                          }
                        }}
                        className={`w-full px-4 py-2.5 lg:py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                          validationState.uidValidation === 'valid' ? 'focus:ring-green-500 border-green-500' :
                          validationState.uidValidation === 'invalid' ? 'focus:ring-red-500 border-red-500' :
                          'focus:ring-neon-blue'
                        }`}
                        placeholder="Enter Free Fire UID (8-12 digits)"
                        autoComplete="off"
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

                      {/* UID Length Helper Text */}
                      {formData.free_fire_uid && (
                        <div className="absolute -bottom-5 left-0 text-xs">
                          <span className={`${
                            formData.free_fire_uid.length >= 8 && formData.free_fire_uid.length <= 12 
                              ? 'text-green-400' 
                              : 'text-yellow-400'
                          }`}>
                            {formData.free_fire_uid.length}/12 digits
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Region Field with Advanced Dropdown */}
                  <div>
                    <label htmlFor="region" className="block text-xs font-semibold text-white mb-2 flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-neon-purple" />
                      <span>Region</span>
                    </label>
                    <div className="relative">
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 lg:py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all duration-300 text-sm lg:text-base bg-cosmic-dark appearance-none cursor-pointer pr-12"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          backgroundSize: '16px'
                        }}
                      >
                        {regions.map(region => (
                          <option 
                            key={region.code} 
                            value={region.code} 
                            className="bg-cosmic-dark text-white py-2 hover:bg-cosmic-light"
                          >
                            {region.flag} {region.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* Custom Dropdown Styling Overlay */}
                      <div className="absolute inset-0 rounded-xl border border-gray-600/30 pointer-events-none bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
                      
                      {/* Selected Region Flag Display */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none">
                        {regions.find(r => r.code === formData.region)?.flag}
                      </div>
                    </div>
                  </div>
                </div>

                {/* UID Validation Error Display */}
                <AnimatePresence>
                  {validationState.uidValidation === 'invalid' && formData.free_fire_uid && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/30 backdrop-blur-xl"
                    >
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 via-orange-400/5 to-red-400/5"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-orange-400 to-red-400"></div>
                      
                      {/* Main Content */}
                      <div className="relative p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-400/30"
                            >
                              <AlertCircle className="h-4 w-4 text-white" />
                            </motion.div>
                            <div>
                              <h4 className="text-red-400 font-bold text-sm">Invalid UID or Region</h4>
                              <p className="text-gray-400 text-xs">Please check your Free Fire UID and region</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="text-xl"
                          >
                            ⚠️
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Advanced Player Info Display */}
                <AnimatePresence>
                  {validationState.uidValidation === 'valid' && validationState.playerInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-500/30 backdrop-blur-xl"
                    >
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-blue-400/5 to-purple-400/5"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                      
                      {/* Main Content */}
                      <div className="relative p-3 lg:p-4">
                        {/* Header with Verified Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="w-7 h-7 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-400/30"
                            >
                              <CheckCircle className="h-4 w-4 text-white" />
                            </motion.div>
                            <div>
                              <h4 className="text-green-400 font-bold text-sm lg:text-base">Player Verified</h4>
                              <p className="text-gray-400 text-xs">Free Fire account authenticated</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-400/30 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-blue-500/20"
                          >
                            {/* Secure inbuilt avatar - no external API exposure */}
                            <div className="w-full h-full flex items-center justify-center text-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Player Stats Grid with separate level display */}
                        <div className="grid grid-cols-2 gap-2 lg:gap-3">
                          {/* Nickname Card */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass rounded-lg p-2 lg:p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <User className="h-3 w-3 text-blue-400" />
                                <span className="text-gray-400 text-xs font-medium">Nickname</span>
                              </div>
                              <span className="text-blue-300 text-xs font-bold">Lv.{validationState.playerInfo.level}</span>
                            </div>
                            <p className="text-white font-bold text-sm truncate">
                              {validationState.playerInfo.nickname.length > 15 
                                ? `${validationState.playerInfo.nickname.slice(0, 15)}.` 
                                : validationState.playerInfo.nickname}
                            </p>
                          </motion.div>
                          
                          {/* Total Likes Card */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-lg p-2 lg:p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span className="text-gray-400 text-xs font-medium">Total Likes</span>
                            </div>
                            <p className="text-white font-bold text-sm">{validationState.playerInfo.liked?.toLocaleString() || '0'}</p>
                          </motion.div>
                          
                          {/* Guild Card */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass rounded-lg p-2 lg:p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <Crown className="h-3 w-3 text-purple-400" />
                                <span className="text-gray-400 text-xs font-medium">Guild</span>
                              </div>
                              <span className="text-purple-300 text-xs font-bold">Lv.{validationState.playerInfo.clan_level}</span>
                            </div>
                            <p className="text-white font-bold text-sm truncate">
                              {validationState.playerInfo.clan_name && validationState.playerInfo.clan_name !== "No Guild" 
                                ? (validationState.playerInfo.clan_name.length > 15 
                                    ? `${validationState.playerInfo.clan_name.slice(0, 15)}.` 
                                    : validationState.playerInfo.clan_name)
                                : 'No Guild'}
                            </p>
                          </motion.div>
                          
                          {/* Experience Card */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass rounded-lg p-2 lg:p-3 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Zap className="h-3 w-3 text-green-400" />
                              <span className="text-gray-400 text-xs font-medium">Experience</span>
                            </div>
                            <p className="text-white font-bold text-sm">{validationState.playerInfo.exp?.toLocaleString() || '0'}</p>
                          </motion.div>
                        </div>
                        
                        {/* Floating Particles */}
                        <div className="absolute top-2 right-4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-3 left-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 right-8 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
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

                {/* Enhanced Submit Button - Same as Login */}
                <motion.button
                  type="submit"
                  disabled={loading || validationState.uidValidation !== 'valid' || validationState.passwordMatch !== 'match'}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 text-xl font-bold ripple mobile-friendly group relative overflow-hidden transition-all duration-300 rounded-xl ${
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
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Entering Arena...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-3"
                      >
                        <Gamepad2 className="h-6 w-6 group-hover:animate-pulse" />
                        <span>JOIN ARENA</span>
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
    </div>
  );
};

export default Register;