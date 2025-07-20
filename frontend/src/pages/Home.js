import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Clock, 
  Play, 
  Star,
  TrendingUp,
  Calendar,
  Zap,
  Target,
  Shield,
  Crown,
  Gamepad2,
  Flame,
  Crosshair,
  Scope,
  Swords,
  Skull,
  Award,
  Activity,
  Timer,
  MapPin,
  Headphones,
  ChevronRight,
  ArrowRight,
  Brain,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import safeToast from '../utils/safeToast';

const Home = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [matchmakingStatus, setMatchmakingStatus] = useState('ready');
  const [liveStats, setLiveStats] = useState({
    totalTournaments: 0,
    totalPrizePool: 0,
    activePlayers: 0,
    liveMatches: 0
  });

  useEffect(() => {
    loadData();
    loadAIFeatures();
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 5) - 2,
        liveMatches: Math.max(45, prev.liveMatches + Math.floor(Math.random() * 3) - 1)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [tournamentsData, leaderboardData] = await Promise.all([
        apiService.getTournaments({ limit: 6 }),
        apiService.getLeaderboards('free_fire', null, 8)
      ]);

      setTournaments(tournamentsData.tournaments || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      
      // Enhanced Free Fire stats for 2025
      setLiveStats({
        totalTournaments: 347,
        totalPrizePool: 4850000,
        activePlayers: 42947,
        liveMatches: 89
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      safeToast.error('Failed to load battle data');
    } finally {
      setLoading(false);
    }
  };

  const loadAIFeatures = async () => {
    // Simulate AI predictions and matchmaking
    setAiPredictions([
      {
        id: 1,
        type: 'tournament_prediction',
        title: 'High Win Probability',
        description: 'Based on your gameplay, you have 78% chance to reach top 10',
        confidence: 78,
        tournament: 'Battle Royale Championship'
      },
      {
        id: 2,
        type: 'skill_analysis',
        title: 'Aim Improvement Detected',
        description: 'Your accuracy improved by 15% this week. Keep practicing!',
        confidence: 92,
        trend: 'up'
      },
      {
        id: 3,
        type: 'matchmaking',
        title: 'Perfect Match Found',
        description: 'Found teammates with similar skill level and playstyle',
        confidence: 85,
        players: 3
      }
    ]);
  };

  // Premium Free Fire hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1548003693-b55d51032288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1558008412-f42c059a9d02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1636036824578-d0d300a4effb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85"
  ];

  // Mobile-First Responsive StatCard Component
  const StatCard = ({ icon: Icon, label, value, color, description, animate = false, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 2, rotateX: 1 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden
        /* Mobile-first styles */
        rounded-2xl
        sm:rounded-3xl
        lg:rounded-3xl
      "
    >
      {/* Responsive glass background */}
      <div className="absolute inset-0 
        glass-mobile
        group-hover:border-white/30 
        transition-all duration-500
        rounded-2xl sm:rounded-3xl lg:rounded-3xl
      "></div>
      
      {/* Animated border glow - desktop only */}
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 hidden lg:block bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ padding: '2px' }}
      />

      <div className="relative text-center
        /* Mobile: compact padding */
        p-4
        /* Tablet: medium padding */
        sm:p-6
        /* Desktop: spacious padding */
        lg:p-8
      ">
        <div className={`mx-auto ${color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110
          /* Mobile: smaller icon container */
          w-12 h-12
          /* Tablet: medium icon container */
          sm:w-16 sm:h-16
          /* Desktop: large icon container */
          lg:w-20 lg:h-20
        `}>
          <Icon className="text-white drop-shadow-2xl
            /* Mobile: small icon */
            h-6 w-6
            /* Tablet: medium icon */
            sm:h-8 sm:w-8
            /* Desktop: large icon */
            lg:h-10 lg:w-10
          " />
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <motion.h3 
            className="text-white font-gaming font-black
              /* Mobile: compact title */
              text-xl
              /* Tablet: medium title */
              sm:text-3xl
              /* Desktop: large title */
              lg:text-4xl
            "
            animate={animate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.h3>
          {trend && (
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="hidden sm:block"
            >
              {trend === 'up' ? 
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-neon-green" /> : 
                <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-neon-red" />
              }
            </motion.div>
          )}
        </div>
        
        <p className="text-neon-blue font-bold uppercase tracking-wider mb-2
          /* Mobile: small label */
          text-2xs
          /* Tablet: medium label */
          sm:text-sm
        ">{label}</p>
        <p className="text-gray-300 opacity-90
          /* Mobile: tiny description */
          text-2xs hidden
          /* Tablet: show description */
          sm:block sm:text-xs
        ">{description}</p>
        
        {animate && (
          <motion.div
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );

  // Mobile-First AI Insight Card
  const AIInsightCard = ({ insight, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden
        /* Mobile: compact card */
        rounded-xl
        /* Desktop: larger card */
        lg:rounded-2xl
      "
    >
      {/* Mobile-first glass effect */}
      <div className="absolute inset-0 glass-mobile group-hover:border-neon-blue/40 transition-all duration-500 
        rounded-xl lg:rounded-2xl
      "></div>
      
      <div className="relative
        /* Mobile: compact padding */
        p-4
        /* Desktop: spacious padding */
        lg:p-6
      ">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className={`rounded-lg sm:rounded-xl flex items-center justify-center ${
            insight.type === 'tournament_prediction' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
            insight.type === 'skill_analysis' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            'bg-gradient-to-r from-purple-500 to-indigo-600'
          } group-hover:shadow-glow transition-shadow duration-300
            /* Mobile: smaller icon container */
            w-10 h-10
            /* Desktop: larger icon container */
            sm:w-12 sm:h-12
          `}>
            {insight.type === 'tournament_prediction' && <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
            {insight.type === 'skill_analysis' && <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
            {insight.type === 'matchmaking' && <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-bold group-hover:text-neon-blue transition-colors
                /* Mobile: compact title */
                text-sm
                /* Desktop: larger title */
                lg:text-lg
              ">
                {insight.title}
              </h4>
              <div className="flex items-center space-x-1">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-neon-purple" />
                <span className="text-neon-purple font-bold text-2xs sm:text-sm">{insight.confidence}%</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-3
              /* Mobile: small text */
              text-2xs
              /* Desktop: normal text */
              sm:text-sm
            ">{insight.description}</p>
            
            {/* Confidence bar */}
            <div className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1.5 }}
              />
            </div>
            
            {insight.tournament && (
              <p className="text-gray-400 mt-2 text-2xs sm:text-xs">Tournament: {insight.tournament}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Mobile-First Tournament Card with Dramatically Different Layouts
  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 80 }}
      whileHover={{ 
        y: -15, 
        scale: 1.02,
        rotateX: 5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="group relative overflow-hidden
        /* Mobile: compact card */
        rounded-2xl
        /* Desktop: larger rounded corners */
        lg:rounded-3xl
      "
    >
      {/* Mobile-first card background */}
      <div className="absolute inset-0 glass-mobile group-hover:border-white/40 transition-all duration-500
        rounded-2xl lg:rounded-3xl
      "></div>
      
      <div className="relative">
        <div className="relative overflow-hidden
          /* Mobile: shorter image for more compact layout */
          h-48
          /* Tablet: medium height */
          sm:h-64
          /* Desktop: tall image for cinematic effect */
          lg:h-80
          rounded-t-2xl lg:rounded-t-3xl
        ">
          <motion.img
            src={heroImages[index % heroImages.length]}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
          />
          
          {/* Enhanced overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-red/10 via-transparent to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Mobile-optimized badges */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-wrap gap-2 sm:gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-white shadow-2xl bg-gradient-to-r from-red-500 to-pink-600 backdrop-blur-sm border border-red-300/30
                /* Mobile: smaller badge */
                text-2xs
                /* Desktop: larger badge */
                sm:text-sm
              "
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                <span className="uppercase tracking-wide">🔴 LIVE</span>
              </div>
            </motion.div>
          </div>

          {/* Mobile-optimized prize pool */}
          <motion.div 
            className="absolute top-3 right-3 sm:top-6 sm:right-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl font-black shadow-2xl flex items-center space-x-1 sm:space-x-2 backdrop-blur-sm
              /* Mobile: smaller prize badge */
              text-2xs
              /* Desktop: larger prize badge */
              sm:text-sm
            ">
              <Crown className="h-3 w-3 sm:h-5 sm:w-5" />
              <span>₹{tournament.prize_pool?.toLocaleString()}</span>
            </div>
          </motion.div>
          
          {/* Mobile-first title and info positioning */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
            <h3 className="text-white font-black drop-shadow-2xl leading-tight mb-3 sm:mb-4
              /* Mobile: compact title */
              text-lg
              /* Desktop: large title */
              lg:text-2xl
            ">
              {tournament.name}
            </h3>
            
            {/* Mobile: Stack info vertically for space efficiency */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
              <motion.div 
                className="flex items-center space-x-2 bg-black/50 backdrop-blur-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/30"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
                <span className="text-white font-bold text-xs sm:text-sm">{tournament.current_participants}/{tournament.max_participants}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-black/50 backdrop-blur-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/30"
                whileHover={{ scale: 1.05 }}
              >
                <Crosshair className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green" />
                <span className="text-white font-bold text-xs sm:text-sm">₹{tournament.entry_fee}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6
          /* Mobile: compact padding */
          p-4
          /* Desktop: spacious padding */
          lg:p-8
        ">
          <Link
            to={`/tournaments/${tournament.tournament_id}`}
            className="block w-full btn-premium text-center ripple mobile-friendly group relative z-10 overflow-hidden
              /* Mobile: smaller button */
              py-3 px-4 text-sm
              /* Desktop: larger button */
              lg:py-4 lg:px-6 lg:text-base
            "
          >
            <motion.div 
              className="flex items-center justify-center space-x-2 sm:space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform" />
              <span className="font-black tracking-wide">ENTER BATTLE</span>
              <Flame className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-6 sm:mb-8
              /* Mobile: smaller spinner */
              w-12 h-12
              /* Desktop: larger spinner */
              sm:w-16 sm:h-16
            "
          />
          <h2 className="text-white mb-4 font-gaming font-bold
            /* Mobile: compact loading text */
            text-2xl
            /* Desktop: large loading text */
            sm:text-3xl
          ">Loading Arena...</h2>
          <p className="text-gray-400
            /* Mobile: small description */
            text-sm
            /* Desktop: normal description */
            sm:text-base
          ">Preparing the ultimate battle experience</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      {/* Mobile-First Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
        className="relative flex items-center justify-center overflow-hidden
          /* Mobile: shorter hero for better mobile UX */
          min-h-[80vh]
          /* Desktop: full-screen hero */
          lg:min-h-screen
        "
      >
        {/* Mobile-optimized background */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${heroImages[0]}')`
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-black/85 via-cosmic-dark/70 to-cosmic-deep/85"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-red/8 via-transparent to-electric-blue/8"></div>
        </div>

        {/* Mobile-first hero content */}
        <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8">
          {/* Desktop: Horizontal layout with compact text sizes */}
          <motion.h1 
            className="font-black font-gaming leading-none mb-6 sm:mb-8
              /* Mobile: compact hero title */
              text-4xl
              /* Tablet: medium hero title */
              sm:text-5xl md:text-6xl
              /* Desktop: reduced hero title */
              lg:text-7xl xl:text-8xl
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="text-white drop-shadow-2xl block">FREE FIRE</span>
            <motion.span 
              className="text-gradient bg-gradient-to-r from-neon-red via-electric-purple to-neon-blue block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              ULTIMATE ARENA
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-200 leading-relaxed drop-shadow-lg max-w-5xl mx-auto font-medium mb-6 sm:mb-12
              /* Mobile: compact description */
              text-sm
              /* Tablet: medium description */
              sm:text-lg md:text-xl
              /* Desktop: reduced description size */
              lg:text-2xl
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Experience the most intense Free Fire tournaments with{' '}
            <span className="text-neon-blue font-bold">AI-powered matchmaking</span>, 
            real-time analytics, and massive prize pools!
          </motion.p>
          
          {/* Horizontal stats layout on desktop */}
          <motion.div
            className="mb-6 sm:mb-12 max-w-6xl mx-auto
              /* Mobile: single column stack */
              grid grid-cols-1 gap-3
              /* Tablet: 3 columns */
              sm:grid-cols-3 sm:gap-4
              /* Desktop: horizontal 4 columns with reduced spacing */
              lg:grid-cols-4 lg:gap-6
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {[
              { icon: Activity, label: 'Live Battles', value: liveStats.liveMatches, color: 'text-neon-green', gradient: 'from-neon-green/20 to-emerald-500/20', border: 'border-neon-green/30' },
              { icon: Users, label: 'Elite Warriors', value: `${Math.floor(liveStats.activePlayers/1000)}K+`, color: 'text-neon-purple', gradient: 'from-neon-purple/20 to-electric-purple/20', border: 'border-neon-purple/30' },
              { icon: Crown, label: 'Prize Pool', value: `₹${Math.floor(liveStats.totalPrizePool/100000)/10}M`, color: 'text-yellow-400', gradient: 'from-yellow-400/20 to-orange-500/20', border: 'border-yellow-400/30' },
              { icon: Trophy, label: 'Tournaments', value: liveStats.totalTournaments, color: 'text-neon-blue', gradient: 'from-neon-blue/20 to-cyan-500/20', border: 'border-neon-blue/30' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`glass bg-gradient-to-br ${stat.gradient} border ${stat.border} relative overflow-hidden backdrop-blur-2xl text-center
                  /* Mobile: compact stat card */
                  rounded-xl p-3
                  /* Tablet: medium card */
                  sm:rounded-2xl sm:p-4
                  /* Desktop: compact horizontal card */
                  lg:rounded-2xl lg:p-4
                `}
                whileHover={{ scale: 1.05, y: -5 }}
                animate={{ y: [-2, 2, -2] }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, delay: index * 0.7 },
                  scale: { duration: 0.3 }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: index * 3 }}
                  className="relative z-10"
                >
                  <stat.icon className={`${stat.color} mx-auto mb-2 drop-shadow-2xl
                    /* Mobile: smaller icon */
                    h-6 w-6
                    /* Tablet: medium icon */
                    sm:h-8 sm:w-8
                    /* Desktop: compact icon */
                    lg:h-10 lg:w-10
                  `} />
                </motion.div>
                <div className="relative z-10">
                  <motion.p 
                    className={`${stat.color} font-gaming font-black drop-shadow-2xl mb-1
                      /* Mobile: compact stat value */
                      text-xl
                      /* Tablet: medium value */
                      sm:text-2xl
                      /* Desktop: compact value */
                      lg:text-3xl
                    `}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >{stat.value}</motion.p>
                  <p className="text-white font-semibold
                    /* Mobile: small label */
                    text-xs
                    /* Tablet: medium label */
                    sm:text-sm
                    /* Desktop: compact label */
                    lg:text-base
                  ">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Compact CTA buttons */}
          <motion.div 
            className="flex justify-center items-center mb-6 sm:mb-12
              /* Mobile: stack buttons vertically */
              flex-col gap-3
              /* Desktop: side-by-side buttons with reduced gap */
              lg:flex-row lg:gap-6
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <Link
              to="/tournaments"
              className="btn-premium ripple mobile-friendly group relative overflow-hidden w-full sm:w-auto
                /* Mobile: compact button */
                text-sm px-6 py-3
                /* Desktop: medium button */
                lg:text-lg lg:px-10 lg:py-4
              "
            >
              <motion.div 
                className="flex items-center justify-center space-x-2 sm:space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Crosshair className="group-hover:animate-spin
                  /* Mobile: smaller icon */
                  h-5 w-5
                  /* Desktop: medium icon */
                  lg:h-6 lg:w-6
                " />
                <span className="font-black tracking-wide">JOIN ELITE BATTLE</span>
                <Flame className="group-hover:animate-bounce
                  /* Mobile: smaller icon */
                  h-5 w-5
                  /* Desktop: medium icon */
                  lg:h-6 lg:w-6
                " />
              </motion.div>
            </Link>
            
            <Link
              to="/leaderboards"
              className="glass border-2 border-neon-blue/50 hover:border-neon-blue hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 sm:space-x-3 mobile-friendly group backdrop-blur-xl w-full sm:w-auto
                /* Mobile: compact secondary button */
                px-6 py-3 rounded-xl font-bold text-sm
                /* Desktop: medium secondary button */
                lg:px-10 lg:py-4 lg:rounded-2xl lg:text-lg
              "
            >
              <Trophy className="text-yellow-400 group-hover:animate-pulse
                /* Mobile: smaller icon */
                h-5 w-5
                /* Desktop: medium icon */
                lg:h-6 lg:w-6
              " />
              <span>VIEW CHAMPIONS</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform
                /* Mobile: smaller icon */
                h-5 w-5
                /* Desktop: medium icon */
                lg:h-6 lg:w-6
              " />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Compact content sections */}
      <div className="
        /* Mobile: compact spacing and padding */
        space-y-8 px-4 py-8
        /* Tablet: medium spacing */
        sm:space-y-12 sm:px-6 sm:py-12
        /* Desktop: reduced spacing for horizontal layout */
        lg:space-y-16 lg:px-8 lg:py-16
      ">
        <section>
          <motion.div 
            className="text-center mb-6 sm:mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full mb-4 sm:mb-6
              /* Mobile: compact badge */
              px-4 py-2 text-xs
              /* Desktop: medium badge */
              lg:px-6 lg:py-2 lg:text-sm
            ">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              <span className="text-purple-300 font-bold uppercase tracking-wide">AI-Powered Gaming</span>
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            </div>
            <h2 className="text-white font-gaming font-black mb-3 sm:mb-4
              /* Mobile: compact section title */
              text-2xl
              /* Desktop: medium section title */
              lg:text-4xl
            ">SMART BATTLE SYSTEM</h2>
            <p className="text-gray-400 max-w-3xl mx-auto
              /* Mobile: compact description */
              text-sm
              /* Desktop: medium description */
              lg:text-lg
            ">
              Experience next-generation gaming with AI-driven matchmaking, predictive analytics, and personalized insights
            </p>
          </motion.div>
          
          <div className="max-w-7xl mx-auto
            /* Mobile: single column */
            grid grid-cols-1 gap-3
            /* Desktop: horizontal layout */
            lg:grid-cols-3 lg:gap-6
          ">
            {aiPredictions.map((insight, index) => (
              <AIInsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </div>
        </section>

        {/* Enhanced Stats Section - Mobile-First Grid */}
        <section>
          <motion.div 
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white font-gaming font-black mb-4 sm:mb-6
              /* Mobile: compact title */
              text-3xl
              /* Desktop: large title */
              lg:text-6xl
            ">LIVE BATTLE STATS</h2>
            <p className="text-gray-400
              /* Mobile: small description */
              text-sm
              /* Desktop: larger description */
              lg:text-xl
            ">Real-time battlefield intelligence</p>
          </motion.div>
          
          <div className="max-w-7xl mx-auto
            /* Mobile: 2 columns for better mobile layout */
            grid grid-cols-2 gap-4
            /* Desktop: 4 columns */
            lg:grid-cols-4 lg:gap-8
          ">
            <StatCard
              icon={Trophy}
              label="Active Tournaments"
              value={liveStats.totalTournaments}
              description="Epic battles ongoing"
              color="bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600"
              trend="up"
            />
            <StatCard
              icon={DollarSign}
              label="Prize Pool"
              value={`₹${(liveStats.totalPrizePool / 1000000).toFixed(1)}M`}
              description="Battle rewards waiting"
              color="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600"
              trend="up"
            />
            <StatCard
              icon={Users}
              label="Warriors Online"
              value={`${Math.floor(liveStats.activePlayers/1000)}K+`}
              description="Players battling now"
              color="bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-600"
              animate={true}
            />
            <StatCard
              icon={Activity}
              label="Live Matches"
              value={liveStats.liveMatches}
              description="Battles in progress"
              color="bg-gradient-to-br from-red-500 via-pink-600 to-purple-600"
              animate={true}
            />
          </div>
        </section>

        {/* Featured Tournaments - Mobile-First Layout */}
        <section>
          <motion.div 
            className="mb-8 sm:mb-12 lg:mb-16
              /* Mobile: center everything */
              text-center
              /* Desktop: flex layout with space between */
              lg:flex lg:items-center lg:justify-between lg:text-left
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <h2 className="text-white font-gaming font-black mb-4
                /* Mobile: compact title */
                text-3xl
                /* Desktop: large title */
                lg:text-6xl lg:mb-4
              ">FEATURED BATTLES</h2>
              <p className="text-gray-400
                /* Mobile: small description */
                text-sm mb-4
                /* Desktop: larger description, no bottom margin */
                lg:text-xl lg:mb-0
              ">Elite tournaments for champions</p>
            </div>
            <Link
              to="/tournaments"
              className="text-neon-blue hover:text-electric-blue font-bold flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-300 group
                /* Mobile: smaller link */
                text-sm
                /* Desktop: larger link */
                lg:text-xl
              "
            >
              <span>View All Tournaments</span>
              <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="max-w-7xl mx-auto
            /* Mobile: single column for better mobile experience */
            grid grid-cols-1 gap-6
            /* Tablet: 2 columns */
            md:grid-cols-2 md:gap-8
            /* Desktop: 3 columns */
            xl:grid-cols-3 xl:gap-10
          ">
            {tournaments.slice(0, 6).map((tournament, index) => (
              <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section - Mobile-First */}
        <section className="text-center
          /* Mobile: compact padding */
          py-12
          /* Desktop: spacious padding */
          lg:py-20
        ">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-white font-gaming font-black mb-6 sm:mb-8
              /* Mobile: compact CTA title */
              text-3xl
              /* Desktop: large CTA title */
              lg:text-6xl
            ">
              READY TO DOMINATE?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 sm:mb-12
              /* Mobile: compact description */
              text-base
              /* Desktop: large description */
              lg:text-2xl
            ">
              Join thousands of elite warriors in the ultimate Free Fire tournament experience
            </p>
            <div className="flex justify-center">
              <Link
                to="/tournaments"
                className="btn-premium ripple mobile-friendly group
                  /* Mobile: full-width button */
                  w-full text-lg px-8 py-4
                  /* Tablet: auto width */
                  sm:w-auto
                  /* Desktop: large button */
                  lg:text-2xl lg:px-16 lg:py-8
                "
              >
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  <Target className="group-hover:rotate-45 transition-transform
                    /* Mobile: smaller icon */
                    h-6 w-6
                    /* Desktop: larger icon */
                    lg:h-8 lg:w-8
                  " />
                  <span className="font-black">START BATTLING</span>
                </div>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default Home;