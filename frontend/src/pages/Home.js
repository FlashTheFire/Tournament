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
import toast from 'react-hot-toast';

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
      toast.error('Failed to load battle data');
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

  const StatCard = ({ icon: Icon, label, value, color, description, animate = false, trend }) => (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Premium glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/20 group-hover:border-white/30 transition-all duration-500"></div>
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ padding: '2px' }}
      />

      <div className="relative p-8 text-center">
        <div className={`mx-auto w-20 h-20 ${color} rounded-3xl flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-10 w-10 text-white drop-shadow-2xl" />
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <motion.h3 
            className="text-4xl font-black text-white font-gaming"
            animate={animate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.h3>
          {trend && (
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {trend === 'up' ? 
                <TrendingUp className="h-6 w-6 text-neon-green" /> : 
                <TrendingDown className="h-6 w-6 text-neon-red" />
              }
            </motion.div>
          )}
        </div>
        
        <p className="text-neon-blue text-sm font-bold mb-2 uppercase tracking-wider">{label}</p>
        <p className="text-gray-300 text-xs opacity-90">{description}</p>
        
        {animate && (
          <motion.div
            className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );

  const AIInsightCard = ({ insight, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Advanced glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/20 group-hover:border-neon-blue/40 transition-all duration-500"></div>
      
      <div className="relative p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            insight.type === 'tournament_prediction' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
            insight.type === 'skill_analysis' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            'bg-gradient-to-r from-purple-500 to-indigo-600'
          } group-hover:shadow-glow transition-shadow duration-300`}>
            {insight.type === 'tournament_prediction' && <Target className="h-6 w-6 text-white" />}
            {insight.type === 'skill_analysis' && <TrendingUp className="h-6 w-6 text-white" />}
            {insight.type === 'matchmaking' && <Users className="h-6 w-6 text-white" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-bold text-lg group-hover:text-neon-blue transition-colors">
                {insight.title}
              </h4>
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4 text-neon-purple" />
                <span className="text-neon-purple text-sm font-bold">{insight.confidence}%</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">{insight.description}</p>
            
            {/* Confidence bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1.5 }}
              />
            </div>
            
            {insight.tournament && (
              <p className="text-xs text-gray-400 mt-2">Tournament: {insight.tournament}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

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
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Premium card background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-white/[0.05] backdrop-blur-2xl rounded-3xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
      
      <div className="relative">
        <div className="relative h-80 overflow-hidden rounded-t-3xl">
          <motion.img
            src={heroImages[index % heroImages.length]}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
          />
          
          {/* Enhanced overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-red/10 via-transparent to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Premium badges */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-2xl bg-gradient-to-r from-red-500 to-pink-600 backdrop-blur-sm border border-red-300/30"
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="uppercase tracking-wide">🔴 LIVE BATTLE</span>
              </div>
            </motion.div>
          </div>

          {/* Prize pool with enhanced styling */}
          <motion.div 
            className="absolute top-6 right-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-5 py-2 rounded-xl text-sm font-black shadow-2xl flex items-center space-x-2 backdrop-blur-sm">
              <Crown className="h-5 w-5" />
              <span>₹{tournament.prize_pool?.toLocaleString()}</span>
            </div>
          </motion.div>
          
          {/* Title and info */}
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white font-black text-2xl mb-4 drop-shadow-2xl leading-tight">
              {tournament.name}
            </h3>
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-2 bg-black/50 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/30"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="h-5 w-5 text-neon-blue" />
                <span className="text-white font-bold">{tournament.current_participants}/{tournament.max_participants}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-black/50 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/30"
                whileHover={{ scale: 1.05 }}
              >
                <Crosshair className="h-5 w-5 text-neon-green" />
                <span className="text-white font-bold">₹{tournament.entry_fee}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <Link
            to={`/tournaments/${tournament.tournament_id}`}
            className="block w-full btn-premium text-center ripple mobile-friendly group relative z-10 group overflow-hidden"
          >
            <motion.div 
              className="flex items-center justify-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <Gamepad2 className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span className="font-black text-lg tracking-wide">ENTER BATTLE</span>
              <Flame className="h-6 w-6 group-hover:animate-pulse" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold text-white mb-4 font-gaming">Loading Arena...</h2>
          <p className="text-gray-400">Preparing the ultimate battle experience</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen"
    >
      {/* Ultra-Premium Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Hero background */}
        <div className="absolute inset-0">
          <motion.img
            src={heroImages[0]}
            alt="Free Fire Arena"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-red/10 via-transparent to-electric-blue/10"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-8 py-3 mb-8">
              <Flame className="h-6 w-6 text-red-400 animate-pulse" />
              <span className="text-red-300 font-bold uppercase tracking-wide text-lg">Battle Royale Championship</span>
              <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 font-gaming leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
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
            className="text-2xl md:text-3xl text-gray-200 mb-12 leading-relaxed drop-shadow-lg max-w-4xl mx-auto font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1 }}
          >
            Experience the most intense Free Fire tournaments with{' '}
            <span className="text-neon-blue font-bold">AI-powered matchmaking</span>, 
            real-time analytics, and massive prize pools!
          </motion.p>
          
          {/* Live battle stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mb-12 text-lg font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {[
              { icon: Activity, label: 'Live Battles', value: liveStats.liveMatches, color: 'text-neon-green' },
              { icon: Users, label: 'Warriors', value: `${Math.floor(liveStats.activePlayers/1000)}K+`, color: 'text-neon-purple' },
              { icon: Crown, label: 'Prize Pool', value: `₹${Math.floor(liveStats.totalPrizePool/100000)/10}M`, color: 'text-yellow-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                whileHover={{ scale: 1.05 }}
                animate={{ y: [-2, 2, -2] }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                  scale: { duration: 0.3 }
                }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color} animate-pulse`} />
                <span className={`${stat.color}`}>{stat.value}</span>
                <span className="text-white">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <Link
              to="/tournaments"
              className="btn-premium text-xl px-12 py-6 ripple mobile-friendly group relative overflow-hidden"
            >
              <motion.div 
                className="flex items-center justify-center space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <Crosshair className="h-8 w-8 group-hover:animate-spin" />
                <span className="font-black tracking-wide">JOIN BATTLE NOW</span>
                <Flame className="h-8 w-8 group-hover:animate-bounce" />
              </motion.div>
            </Link>
            
            <Link
              to="/leaderboards"
              className="glass px-12 py-6 rounded-2xl font-bold text-xl border-2 border-neon-blue/50 hover:border-neon-blue hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-4 mobile-friendly group backdrop-blur-xl"
            >
              <Shield className="h-8 w-8 text-yellow-400 group-hover:animate-pulse" />
              <span className="text-white">VIEW HALL OF FAME</span>
              <Crown className="h-8 w-8 text-yellow-400 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <div className="space-y-20 px-8 py-20">
        {/* AI-Powered Features Section */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-3 mb-8">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-purple-300 font-bold uppercase tracking-wide">AI-Powered Gaming</span>
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <h2 className="text-6xl font-black text-white mb-6 font-gaming">SMART BATTLE SYSTEM</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Experience next-generation gaming with AI-driven matchmaking, predictive analytics, and personalized insights
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {aiPredictions.map((insight, index) => (
              <AIInsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-6xl font-black text-white mb-6 font-gaming">LIVE BATTLE STATS</h2>
            <p className="text-gray-400 text-xl">Real-time battlefield intelligence</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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

        {/* Featured Tournaments */}
        <section>
          <motion.div 
            className="flex items-center justify-between mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <h2 className="text-6xl font-black text-white mb-4 font-gaming">FEATURED BATTLES</h2>
              <p className="text-gray-400 text-xl">Elite tournaments for champions</p>
            </div>
            <Link
              to="/tournaments"
              className="text-neon-blue hover:text-electric-blue font-bold flex items-center space-x-3 transition-all duration-300 group text-xl"
            >
              <span>View All Tournaments</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {tournaments.slice(0, 6).map((tournament, index) => (
              <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl font-black text-white mb-8 font-gaming">
              READY TO DOMINATE?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of elite warriors in the ultimate Free Fire tournament experience
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/tournaments"
                className="btn-premium text-2xl px-16 py-8 ripple mobile-friendly group"
              >
                <div className="flex items-center space-x-4">
                  <Target className="h-8 w-8 group-hover:rotate-45 transition-transform" />
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