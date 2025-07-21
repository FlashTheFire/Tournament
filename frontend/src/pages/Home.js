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
  ChevronLeft,
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

  // Professional Carousel State Management - Auto-play disabled
  const [aiCurrentIndex, setAiCurrentIndex] = useState(0);
  const [tournamentCurrentIndex, setTournamentCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    loadData();
    // Removed auto-refresh interval as requested
  }, []);

  // Auto-advance disabled as requested by user - no automatic refreshing
  // AI Carousel and Tournament Carousel will only respond to manual navigation

  // Professional Touch Handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (type) => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (type === 'ai') {
      if (isLeftSwipe) {
        setAiCurrentIndex((prev) => (prev + 1) % aiPredictions.length);
      } else if (isRightSwipe) {
        setAiCurrentIndex((prev) => (prev - 1 + aiPredictions.length) % aiPredictions.length);
      }
    } else if (type === 'tournament') {
      if (isLeftSwipe) {
        setTournamentCurrentIndex((prev) => (prev + 1) % Math.min(tournaments.length, 3));
      } else if (isRightSwipe) {
        setTournamentCurrentIndex((prev) => (prev - 1 + Math.min(tournaments.length, 3)) % Math.min(tournaments.length, 3));
      }
    }
  };

  // Manual Navigation Functions - Auto-play disabled
  const nextAiSlide = () => {
    setAiCurrentIndex((prev) => (prev + 1) % aiPredictions.length);
  };

  const prevAiSlide = () => {
    setAiCurrentIndex((prev) => (prev - 1 + aiPredictions.length) % aiPredictions.length);
  };

  const nextTournamentSlide = () => {
    setTournamentCurrentIndex((prev) => (prev + 1) % Math.min(tournaments.length, 3));
  };

  const prevTournamentSlide = () => {
    setTournamentCurrentIndex((prev) => (prev - 1 + Math.min(tournaments.length, 3)) % Math.min(tournaments.length, 3));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTournaments(),
        loadLeaderboard(),
        loadAIPredictions(),
        loadLiveStats()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
      safeToast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadTournaments = async () => {
    try {
      const data = await apiService.getTournaments();
      const mockTournaments = [
        {
          tournament_id: 'ff-legends-cup',
          name: 'Free Fire Legends Cup 2025',
          prize_pool: 100000,
          current_participants: 1240,
          max_participants: 2000,
          entry_fee: 500,
          status: 'live',
          start_time: new Date().toISOString(),
          battle_map: 'Bermuda Remastered',
          game_type: 'battle_royale'
        },
        {
          tournament_id: 'clash-masters',
          name: 'Clash Squad Masters',
          prize_pool: 50000,
          current_participants: 856,
          max_participants: 1000,
          entry_fee: 250,
          status: 'upcoming',
          start_time: new Date(Date.now() + 86400000).toISOString(),
          battle_map: 'Purgatory',
          game_type: 'clash_squad'
        },
        {
          tournament_id: 'weekly-warriors',
          name: 'Weekly Warriors Challenge',
          prize_pool: 25000,
          current_participants: 445,
          max_participants: 500,
          entry_fee: 150,
          status: 'upcoming',
          start_time: new Date(Date.now() + 172800000).toISOString(),
          battle_map: 'Kalahari',
          game_type: 'solo'
        }
      ];
      setTournaments([...mockTournaments, ...(data.tournaments || [])]);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await apiService.getLeaderboard();
      const mockLeaderboard = [
        { rank: 1, username: 'FF_LEGEND_2025', points: 24500, matches: 156, wins: 124 },
        { rank: 2, username: 'BOOYAH_MASTER', points: 23800, matches: 142, wins: 118 },
        { rank: 3, username: 'HEADSHOT_KING', points: 22950, matches: 134, wins: 109 },
        { rank: 4, username: 'ELITE_SNIPER', points: 22100, matches: 128, wins: 102 },
        { rank: 5, username: 'SQUAD_LEADER', points: 21650, matches: 125, wins: 98 }
      ];
      setLeaderboard([...mockLeaderboard, ...(data.leaderboard || [])]);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const loadAIPredictions = async () => {
    const mockPredictions = [
      {
        id: 'ai-1',
        type: 'matchmaking',
        title: 'Smart Match Ready',
        prediction: 'Perfect opponents found with 94% skill match',
        confidence: 94,
        action: 'Start Battle',
        icon: Brain,
        gradient: 'from-cyan-500 to-blue-600'
      },
      {
        id: 'ai-2',
        type: 'performance',
        title: 'Win Probability',
        prediction: 'High chance of victory in next tournament',
        confidence: 78,
        action: 'View Strategy',
        icon: Target,
        gradient: 'from-green-500 to-emerald-600'
      },
      {
        id: 'ai-3',
        type: 'tournament',
        title: 'Tournament Alert',
        prediction: 'New high-prize tournament in 2 hours',
        confidence: 100,
        action: 'Register Now',
        icon: Trophy,
        gradient: 'from-yellow-500 to-orange-600'
      }
    ];
    setAiPredictions(mockPredictions);
  };

  const loadLiveStats = async () => {
    const stats = {
      totalTournaments: 89,
      totalPrizePool: 4800000,
      activePlayers: 42000,
      liveMatches: 156
    };
    setLiveStats(stats);
  };

  const updateLiveStats = () => {
    setLiveStats(prev => ({
      ...prev,
      liveMatches: prev.liveMatches + Math.floor(Math.random() * 5) - 2,
      activePlayers: prev.activePlayers + Math.floor(Math.random() * 100) - 50
    }));
  };

  const StatCard = ({ icon: Icon, label, value, description, color, trend, index }) => (
    <motion.div
      className={`relative overflow-hidden rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-center border border-white/10 ${color} shadow-2xl backdrop-blur-xl`}
      whileHover={{ scale: 1.05, y: -10 }}
      animate={{ y: [-2, 2, -2] }}
      transition={{ 
        y: { duration: 4, repeat: Infinity },
        scale: { duration: 0.3 },
        hover: { duration: 0.3 }
      }}
    >
      {/* Professional Pulse Animation Effect instead of round effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl lg:rounded-3xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
            delay: (index || 0) * 0.5
          }}
          style={{ width: '120%' }}
        />
      </div>
      
      {/* Professional branded glow border */}
      <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-neon-blue/20 via-transparent to-electric-purple/20 animate-pulse"></div>
      
      <div className="relative z-10">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-4 lg:mb-6"
        >
          <Icon className="h-12 w-12 lg:h-16 lg:w-16 text-white mx-auto drop-shadow-2xl" />
        </motion.div>
        
        <motion.p 
          className="text-white font-gaming font-black text-2xl lg:text-4xl xl:text-5xl mb-2 lg:mb-4 drop-shadow-2xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {value}
        </motion.p>
        <p className="text-white/90 font-bold text-lg lg:text-xl xl:text-2xl mb-2">{label}</p>
        <p className="text-white/70 text-sm lg:text-base">{description}</p>
        
        {trend && (
          <motion.div 
            className="flex items-center justify-center mt-3 lg:mt-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-green-400 mr-2" />
            ) : (
              <TrendingDown className="h-5 w-5 lg:h-6 lg:w-6 text-red-400 mr-2" />
            )}
            <span className={`font-bold text-sm lg:text-base ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? '+12.5%' : '-3.2%'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Additional premium floating shine particles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  const AIInsightCard = ({ insight, index }) => (
    <motion.div
      className={`glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-white/10 bg-gradient-to-br ${insight.gradient}/20 shadow-2xl`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-r ${insight.gradient} flex items-center justify-center shadow-glow`}>
          <insight.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <motion.div 
          className={`px-3 py-1 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r ${insight.gradient} text-white font-bold text-sm lg:text-base`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {insight.confidence}%
        </motion.div>
      </div>
      
      <h3 className="text-white font-bold text-lg lg:text-xl xl:text-2xl mb-3 lg:mb-4">{insight.title}</h3>
      <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base leading-relaxed">{insight.prediction}</p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full btn-premium bg-gradient-to-r ${insight.gradient} text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base transition-all duration-300`}
      >
        {insight.action}
      </motion.button>
    </motion.div>
  );

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      className="tournament-card glass rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 hover:border-neon-blue/50 group shadow-2xl"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <div className="relative h-40 lg:h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85"
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Lighter overlay backgrounds - no black boxes */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/20 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 lg:top-6 left-4 lg:left-6">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm lg:text-base font-bold text-white shadow-glow ${
              tournament.status === 'live' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse-glow'
                : 'bg-gradient-to-r from-blue-500 to-cyan-600'
            }`}
          >
            {tournament.status === 'live' ? 'LIVE BATTLE' : 'STARTING SOON'}
          </motion.div>
        </div>

        {/* Prize Pool */}
        <motion.div 
          className="absolute top-4 lg:top-6 right-4 lg:right-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-sm lg:text-base font-bold shadow-glow flex items-center space-x-1">
            <Crown className="h-4 w-4" />
            <span>₹{tournament.prize_pool?.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Battle Map */}
        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6">
          <div className="flex items-center space-x-2 text-white/90 mb-1">
            <MapPin className="h-3 w-3 text-neon-green" />
            <span className="text-xs lg:text-sm font-medium backdrop-blur-sm px-2 py-0.5 rounded">
              {tournament.battle_map}
            </span>
          </div>
        </div>
        
        {/* Tournament Title */}
        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
          <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl mb-2 drop-shadow-2xl leading-tight">
            {tournament.name}
          </h3>
          
          {/* Mobile: Stack info vertically for space efficiency */}
          <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
            <motion.div 
              className="flex items-center space-x-2 backdrop-blur-lg px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/30"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-neon-blue" />
              <span className="text-white font-bold text-xs sm:text-sm">{tournament.current_participants}/{tournament.max_participants}</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 backdrop-blur-lg px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/30"
              whileHover={{ scale: 1.05 }}
            >
              <Crosshair className="h-3 w-3 sm:h-4 sm:w-4 text-neon-green" />
              <span className="text-white font-bold text-xs sm:text-sm">₹{tournament.entry_fee}</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4
        /* Mobile: compact padding */
        p-4
        /* Desktop: spacious padding */
        lg:p-6
      ">
        <Link
          to={`/tournaments/${tournament.tournament_id}`}
          className="block w-full btn-premium text-center ripple mobile-friendly group relative z-10 overflow-hidden
            /* Mobile: smaller button */
            py-2.5 px-4 text-sm
            /* Desktop: larger button */
            lg:py-3 lg:px-6 lg:text-base
          "
        >
          <motion.div 
            className="flex items-center justify-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
            <span className="font-black tracking-wide">ENTER BATTLE</span>
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          </motion.div>
        </Link>
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
      {/* Mobile-First Hero Section - Clean background */}
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
        {/* Clean background - background colored objects removed as requested */}

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
          
          {/* Updated Hero Stats - 2x2 Grid on Mobile */}
          <motion.div
            className="mb-6 sm:mb-12 max-w-6xl mx-auto
              /* Mobile: 2x2 grid layout as requested */
              grid grid-cols-2 gap-3
              /* Tablet: 4 columns */
              sm:grid-cols-4 sm:gap-6
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
                  className="relative z-10"
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    delay: index * 0.5 
                  }}
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
          
          {/* Professional Touch-Enabled AI Carousel - Mobile-First with Scroll Snap */}
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Professional Touch-Enabled Carousel with Scroll Snap */}
            <div className="lg:hidden">
              <div 
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/40 via-cosmic-dark/60 to-black/40 border border-white/10 backdrop-blur-xl mx-2 sm:mx-4"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd('ai')}
              >
                {/* Professional carousel container - 100% width cards with proper padding and snap alignment */}
                <motion.div
                  className="flex"
                  animate={{
                    x: `${-aiCurrentIndex * 100}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{ 
                    width: `${aiPredictions.length * 100}%`,
                    scrollSnapAlign: 'start'
                  }}
                >
                  {aiPredictions.map((insight, index) => (
                    <div 
                      key={insight.id} 
                      className="w-full flex-shrink-0"
                      style={{
                        scrollSnapAlign: 'center'
                      }}
                    >
                      {/* Mobile-First Card with 100% width and proper padding */}
                      <div className="px-3 py-3 sm:px-4 sm:py-4">
                        <motion.div
                          className="relative overflow-hidden border border-white/20 bg-gradient-to-br from-black/60 via-cosmic-dark/40 to-black/60 shadow-2xl backdrop-blur-xl rounded-2xl w-full
                            /* Mobile: Optimized height and full width */
                            min-h-[200px] max-w-full
                            /* Small phones: Better proportions */
                            xs:min-h-[220px]
                            /* Medium phones: Standard sizing */
                            sm:min-h-[240px]
                          "
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ 
                            opacity: index === aiCurrentIndex ? 1 : 0.7,
                            scale: index === aiCurrentIndex ? 1 : 0.95 
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Professional Shine Animation */}
                          <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12"
                              animate={{
                                x: ['-200%', '200%'],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 4,
                                ease: "easeInOut",
                              }}
                              style={{ width: '150%' }}
                            />
                          </div>
                          
                          {/* Mobile-First Content Layout - Vertical Stacking */}
                          <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                            {/* Top Section - Icon and Badge */}
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${insight.gradient} flex items-center justify-center shadow-glow-lg border border-white/30 flex-shrink-0`}>
                                <insight.icon className="h-6 w-6 text-white drop-shadow-lg" />
                              </div>
                              <motion.div 
                                className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${insight.gradient} text-white font-bold text-sm shadow-glow-lg border border-white/30 flex-shrink-0`}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {insight.confidence}%
                              </motion.div>
                            </div>
                            
                            {/* Middle Section - Content (Vertically Stacked) */}
                            <div className="flex-grow flex flex-col justify-center text-center mb-4">
                              <h3 className="text-white font-bold text-lg mb-3 drop-shadow-lg leading-tight">
                                {insight.title}
                              </h3>
                              <p className="text-gray-300 text-sm leading-relaxed mx-auto max-w-full">
                                {insight.prediction}
                              </p>
                            </div>
                            
                            {/* Bottom Section - Centered Button */}
                            <div className="flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full bg-gradient-to-r ${insight.gradient} text-white font-bold py-3 rounded-xl text-sm transition-all duration-300 shadow-glow hover:shadow-glow-lg border border-white/20 max-w-xs`}
                              >
                                {insight.action}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Bottom-Aligned AI Progress Dots - Mobile-First */}
                <div className="flex justify-center items-center pt-4 pb-6">
                  <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
                    {aiPredictions.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                          index === aiCurrentIndex 
                            ? 'w-4 h-4 bg-gradient-to-r from-neon-blue to-electric-purple shadow-glow' 
                            : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                        }`}
                        onClick={() => {
                          setAiCurrentIndex(index);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Active dot pulse animation */}
                        {index === aiCurrentIndex && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white/40"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Manual navigation indicator */}
                <div className="absolute top-6 right-6 z-20">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-400 opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Desktop: Traditional Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
              {aiPredictions.map((insight, index) => (
                <AIInsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </div>
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
              index={0}
            />
            <StatCard
              icon={DollarSign}
              label="Prize Pool"
              value={`₹${(liveStats.totalPrizePool / 1000000).toFixed(1)}M`}
              description="Battle rewards waiting"
              color="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600"
              trend="up"
              index={1}
            />
            <StatCard
              icon={Users}
              label="Active Players"
              value={`${Math.floor(liveStats.activePlayers/1000)}K+`}
              description="Warriors online now"
              color="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600"
              trend="up"
              index={2}
            />
            <StatCard
              icon={Activity}
              label="Live Matches"
              value={liveStats.liveMatches}
              description="Battles in progress"
              color="bg-gradient-to-br from-pink-500 via-red-600 to-rose-600"
              trend="down"
              index={3}
            />
          </div>
        </section>

        {/* Featured Tournaments */}
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
            ">FEATURED TOURNAMENTS</h2>
            <p className="text-gray-400
              /* Mobile: small description */
              text-sm
              /* Desktop: larger description */
              lg:text-xl
            ">Join the most epic battles</p>
          </motion.div>
          
          {/* Professional Touch-Enabled Tournament Carousel - Mobile-First with Scroll Snap */}
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Professional Touch-Enabled Tournament Carousel with Scroll Snap */}
            <div className="lg:hidden">
              <div 
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/40 via-cosmic-dark/60 to-black/40 border border-white/10 backdrop-blur-xl mx-2 sm:mx-4"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd('tournament')}
                style={{
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth'
                }}
              >
                {/* Professional tournament carousel container - 100% width cards with scroll snap */}
                <motion.div
                  className="flex"
                  animate={{
                    x: `${-tournamentCurrentIndex * 100}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{ 
                    width: `${Math.min(tournaments.length, 3) * 100}%`,
                    scrollSnapAlign: 'start'
                  }}
                >
                  {tournaments.slice(0, 3).map((tournament, index) => (
                    <div 
                      key={tournament.tournament_id} 
                      className="w-full flex-shrink-0"
                      style={{
                        scrollSnapAlign: 'center'
                      }}
                    >
                      {/* Mobile-First Tournament Card with 100% width and proper padding */}
                      <div className="px-3 py-3 sm:px-4 sm:py-4">
                        <motion.div
                          className="tournament-card relative overflow-hidden border border-white/20 hover:border-neon-blue/50 group shadow-2xl backdrop-blur-xl rounded-2xl bg-gradient-to-br from-black/60 via-cosmic-dark/40 to-black/60 w-full"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ 
                            opacity: index === tournamentCurrentIndex ? 1 : 0.7,
                            scale: index === tournamentCurrentIndex ? 1 : 0.95 
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Professional Tournament Shine Animation */}
                          <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                              animate={{
                                x: ['-200%', '200%'],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatDelay: 6,
                                ease: "easeInOut",
                              }}
                              style={{ width: '150%' }}
                            />
                          </div>

                          {/* Tournament Image with Mobile-First Responsive Heights */}
                          <div className="relative overflow-hidden rounded-t-2xl
                            /* Mobile: Optimized image height */
                            h-48
                            /* Small phones: Slightly taller */
                            xs:h-52
                            /* Medium phones: Standard height */
                            sm:h-56
                          ">
                            <img
                              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85"
                              alt={tournament.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            
                            {/* Enhanced Status Badge - Mobile-First */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className={`px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-glow-lg border border-white/30 backdrop-blur-xl ${
                                  tournament.status === 'live' 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse-glow'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                                }`}
                              >
                                {tournament.status === 'live' ? 'LIVE' : 'SOON'}
                              </motion.div>
                            </div>

                            {/* Enhanced Prize Pool - Mobile-First */}
                            <motion.div 
                              className="absolute top-3 right-3 sm:top-4 sm:right-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-xl text-sm font-bold shadow-glow-lg flex items-center space-x-1 border border-white/30">
                                <Crown className="h-4 w-4" />
                                <span>₹{tournament.prize_pool?.toLocaleString()}</span>
                              </div>
                            </motion.div>

                            {/* Tournament Content - Vertically Stacked on Mobile */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                              {/* Battle Map - Mobile-First */}
                              <div className="flex items-center space-x-2 mb-3">
                                <MapPin className="h-4 w-4 text-neon-green animate-pulse" />
                                <span className="text-sm font-medium text-white/90 bg-black/40 px-2 py-1 rounded-lg border border-white/30">
                                  {tournament.battle_map}
                                </span>
                              </div>
                              
                              {/* Tournament Title - Centered on Mobile */}
                              <h3 className="text-white font-bold text-center mb-3 drop-shadow-2xl leading-tight
                                /* Mobile: Compact title */
                                text-base
                                /* Medium phones: Larger title */
                                sm:text-lg
                              ">
                                {tournament.name}
                              </h3>
                              
                              {/* Stats Row - Mobile-Friendly Stacking */}
                              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between mb-2">
                                <motion.div 
                                  className="flex items-center justify-center space-x-2 backdrop-blur-xl bg-black/50 px-3 py-2 rounded-lg border border-white/30 shadow-glow-lg"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Users className="h-4 w-4 text-neon-blue animate-pulse" />
                                  <span className="text-white font-bold text-sm">{tournament.current_participants}/{tournament.max_participants}</span>
                                </motion.div>
                                <motion.div 
                                  className="flex items-center justify-center space-x-2 backdrop-blur-xl bg-black/50 px-3 py-2 rounded-lg border border-white/30 shadow-glow-lg"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Crosshair className="h-4 w-4 text-neon-green animate-pulse" />
                                  <span className="text-white font-bold text-sm">₹{tournament.entry_fee}</span>
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          {/* Mobile-First Action Section - Centered Button */}
                          <div className="relative z-10 p-4 flex justify-center">
                            <Link
                              to={`/tournaments/${tournament.tournament_id}`}
                              className="w-full max-w-xs btn-premium text-center ripple mobile-friendly group relative z-10 overflow-hidden py-3 px-6 text-sm shadow-glow-lg border border-white/30 rounded-xl"
                            >
                              <motion.div 
                                className="flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                              >
                                <Gamepad2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                <span className="font-black tracking-wide">ENTER BATTLE</span>
                                <Flame className="h-5 w-5 group-hover:animate-pulse" />
                              </motion.div>
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Bottom-Aligned Tournament Progress Dots - Mobile-First */}
                <div className="flex justify-center items-center pt-4 pb-6">
                  <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
                    {tournaments.slice(0, 3).map((_, index) => (
                      <motion.button
                        key={index}
                        className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                          index === tournamentCurrentIndex 
                            ? 'w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow' 
                            : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                        }`}
                        onClick={() => {
                          setTournamentCurrentIndex(index);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Active dot pulse animation */}
                        {index === tournamentCurrentIndex && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white/40"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Manual navigation indicator */}
                <div className="absolute top-6 right-6 z-20">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-orange-400 opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Desktop: Traditional Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
              {tournaments.slice(0, 3).map((tournament, index) => (
                <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8 lg:mt-12">
            <Link
              to="/tournaments"
              className="inline-flex items-center space-x-4 px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl font-black tracking-wide text-white bg-gradient-to-r from-neon-blue via-electric-purple to-neon-pink rounded-2xl lg:rounded-3xl shadow-glow-lg border border-white/30 backdrop-blur-xl relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-glow-xl"
            >
              {/* Enhanced shine animation for button */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl lg:rounded-3xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut",
                  }}
                  style={{ width: '150%' }}
                />
              </div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-400 drop-shadow-glow" />
                </motion.div>
                
                <span className="text-white drop-shadow-lg">VIEW ALL TOURNAMENTS</span>
                
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-white group-hover:translate-x-2 transition-transform drop-shadow-glow" />
                </motion.div>
              </div>

              {/* Button floating particles */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 50 - 25],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut",
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Home;