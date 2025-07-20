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
  Headphones
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    totalTournaments: 0,
    totalPrizePool: 0,
    activePlayers: 0,
    liveMatches: 0
  });

  useEffect(() => {
    loadData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 3) - 1,
        liveMatches: Math.max(20, prev.liveMatches + Math.floor(Math.random() * 2) - 1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [tournamentsData, leaderboardData] = await Promise.all([
        apiService.getTournaments({ limit: 6 }),
        apiService.getLeaderboards('free_fire', null, 10)
      ]);

      setTournaments(tournamentsData.tournaments || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      
      // Enhanced Free Fire stats for 2025
      setLiveStats({
        totalTournaments: 247,
        totalPrizePool: 2850000,
        activePlayers: 28947,
        liveMatches: 67
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load battle data');
    } finally {
      setLoading(false);
    }
  };

  // Premium Free Fire gaming images
  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1548003693-b55d51032288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1558008412-f42c059a9d02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1636036824578-d0d300a4effb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85"
  ];

  // Free Fire specific modes and features
  const gameModes = [
    { name: 'Battle Royale', icon: Target, color: 'from-red-500 to-pink-600', players: '50 Players' },
    { name: 'Clash Squad', icon: Swords, color: 'from-blue-500 to-cyan-600', players: '4v4' },
    { name: 'Lone Wolf', icon: Skull, color: 'from-purple-500 to-indigo-600', players: 'Solo' },
    { name: 'Rush Hour', icon: Timer, color: 'from-green-500 to-emerald-600', players: 'Fast Match' }
  ];

  const StatCard = ({ icon: Icon, label, value, color, description, animate = false }) => (
    <motion.div
      whileHover={{ scale: 1.06, rotateY: 8, rotateX: 2 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-3xl p-8 text-center relative overflow-hidden group cursor-pointer kinetic-waves"
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red bg-clip-border opacity-0 group-hover:opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className={`mx-auto w-20 h-20 ${color} rounded-3xl flex items-center justify-center mb-6 relative z-10 group-hover:shadow-neon-lg transition-all duration-300 group-hover:scale-110`}>
        <Icon className="h-10 w-10 text-white drop-shadow-2xl" />
        {animate && (
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-white/30"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      
      <motion.h3 
        className="text-4xl font-bold text-white mb-3 font-gaming"
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.h3>
      <p className="text-neon-blue text-sm font-bold mb-2 uppercase tracking-wide">{label}</p>
      <p className="text-gray-400 text-xs opacity-80">{description}</p>
      
      {/* Pulse effect for live stats */}
      {animate && (
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );

  const GameModeCard = ({ mode, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="glass rounded-2xl p-6 group hover:border-neon-blue/50 transition-all duration-300 cursor-pointer"
    >
      <div className={`w-16 h-16 bg-gradient-to-r ${mode.color} rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow duration-300`}>
        <mode.icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{mode.name}</h3>
      <p className="text-gray-400 text-sm">{mode.players}</p>
    </motion.div>
  );

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 80 }}
      whileHover={{ 
        y: -15, 
        rotateX: 8, 
        rotateY: 3,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="tournament-card glass rounded-3xl overflow-hidden relative group border border-white/10 hover:border-neon-blue/50"
    >
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={heroImages[index % heroImages.length]}
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
        />
        
        {/* Enhanced overlay with Free Fire theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-neon-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Battle Status with enhanced animation */}
        <motion.div 
          className="absolute top-6 left-6"
          whileHover={{ scale: 1.15 }}
        >
          <div className={`px-5 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-2xl ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse-glow' 
              : tournament.status === 'upcoming'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
          }`}>
            {tournament.status === 'live' && <Activity className="h-4 w-4 animate-pulse" />}
            {tournament.status === 'upcoming' && <Timer className="h-4 w-4" />}
            {tournament.status === 'completed' && <Award className="h-4 w-4" />}
            <span className="uppercase tracking-wide">
              {tournament.status === 'live' ? 'LIVE BATTLE' : 
               tournament.status === 'upcoming' ? 'STARTING SOON' : 
               'COMPLETED'}
            </span>
          </div>
        </motion.div>

        {/* Prize Pool with glow effect */}
        <motion.div 
          className="absolute top-6 right-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-glow flex items-center space-x-1">
            <Crown className="h-4 w-4" />
            <span>₹{tournament.prize_pool.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Battle Zone Indicator */}
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center space-x-2 text-white/90 mb-2">
            <MapPin className="h-4 w-4 text-neon-green" />
            <span className="text-sm font-medium">Bermuda Remastered</span>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-white font-bold text-2xl mb-4 drop-shadow-2xl">{tournament.name}</h3>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <motion.div 
              className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
            >
              <Users className="h-5 w-5 text-neon-blue" />
              <span className="font-medium">{tournament.current_participants}/{tournament.max_participants}</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
            >
              <Crosshair className="h-5 w-5 text-neon-green" />
              <span className="font-medium">₹{tournament.entry_fee}</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="p-8 relative">
        {/* Game Mode Details */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Battle Mode</p>
            <div className="flex items-center space-x-2">
              <Scope className="h-5 w-5 text-neon-purple" />
              <p className="text-white font-bold capitalize">{tournament.mode || 'Battle Royale'}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Match Type</p>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-neon-red" />
              <p className="text-white font-bold capitalize">{tournament.tournament_type || 'Squad'}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Region</p>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-neon-green" />
              <p className="text-white font-bold">{tournament.country || 'Global'}</p>
            </div>
          </div>
        </div>
        
        {/* Battle Time */}
        <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-xl border border-neon-blue/20">
          <Clock className="h-5 w-5 text-neon-blue" />
          <div>
            <p className="text-white font-semibold">
              {new Date(tournament.start_time).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-gray-400 text-sm">
              {new Date(tournament.start_time).toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {/* Enhanced Action Button */}
        <Link
          to={`/tournaments/${tournament.tournament_id}`}
          className="block w-full btn-premium text-center ripple mobile-friendly relative z-10 group overflow-hidden"
        >
          <motion.div 
            className="flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <Gamepad2 className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-lg">ENTER BATTLE</span>
            <Flame className="h-6 w-6 group-hover:animate-pulse" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-12">
        {/* Enhanced Skeleton Loading */}
        <div className="relative">
          <div className="skeleton h-[500px] rounded-3xl kinetic-waves relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"
              animate={{ x: [-100, 1000] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-3xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-[600px] rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="space-y-16"
    >
      {/* Ultra-Premium Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
        className="relative h-[600px] rounded-3xl overflow-hidden group"
      >
        <motion.img
          src={heroImages[0]}
          alt="Free Fire Arena"
          className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3 }}
        />
        
        {/* Dynamic overlay with Free Fire colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-neon-red/20 via-transparent to-electric-blue/20"></div>
        
        {/* Enhanced Kinetic Effects */}
        <div className="absolute inset-0 kinetic-waves opacity-60"></div>
        
        {/* Floating Battle Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-32 text-neon-blue"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Crosshair className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-1/4 text-neon-red"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Target className="h-6 w-6" />
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, x: -150 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 60 }}
              className="max-w-4xl"
            >
              {/* Battle Royale Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6"
              >
                <Flame className="h-5 w-5 text-red-400" />
                <span className="text-red-300 font-bold uppercase tracking-wide">Battle Royale Championship</span>
              </motion.div>

              <motion.h1 
                className="text-7xl md:text-9xl font-bold mb-8 font-gaming leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-white drop-shadow-2xl">FREE FIRE</span>
                <br />
                <span className="text-gradient bg-gradient-to-r from-neon-red via-electric-purple to-neon-blue animate-glow">
                  ULTIMATE ARENA
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-200 mb-12 leading-relaxed drop-shadow-lg max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Dominate the battleground in the most intense Free Fire tournaments. 
                <span className="text-neon-blue font-semibold"> Survive, Eliminate, Conquer!</span>
              </motion.p>
              
              {/* Battle Stats */}
              <motion.div
                className="flex items-center space-x-8 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center space-x-2 text-neon-green">
                  <Activity className="h-5 w-5 animate-pulse" />
                  <span className="font-bold">67 Live Battles</span>
                </div>
                <div className="flex items-center space-x-2 text-neon-purple">
                  <Users className="h-5 w-5" />
                  <span className="font-bold">28,947 Warriors</span>
                </div>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Crown className="h-5 w-5" />
                  <span className="font-bold">₹2.85M Prize Pool</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <Link
                  to="/tournaments"
                  className="btn-premium text-xl px-12 py-5 ripple mobile-friendly group relative overflow-hidden"
                >
                  <motion.div 
                    className="flex items-center justify-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Crosshair className="h-7 w-7 group-hover:animate-spin" />
                    <span className="font-bold">JOIN BATTLE</span>
                    <Flame className="h-7 w-7 group-hover:animate-bounce" />
                  </motion.div>
                </Link>
                
                <Link
                  to="/leaderboards"
                  className="glass px-12 py-5 rounded-2xl font-bold text-xl border-2 border-neon-blue/50 hover:border-neon-blue hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-4 mobile-friendly group"
                >
                  <Shield className="h-7 w-7 text-yellow-400 group-hover:animate-pulse" />
                  <span className="text-white">HALL OF FAME</span>
                  <Crown className="h-7 w-7 text-yellow-400 group-hover:rotate-12 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Stats Section */}
      <section>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-gaming">BATTLEFIELD STATS</h2>
          <p className="text-gray-400 text-xl">Real-time battle arena metrics</p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            icon={Trophy}
            label="Active Tournaments"
            value={liveStats.totalTournaments}
            description="Epic battles ongoing"
            color="bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Prize Pool"
            value={`₹${(liveStats.totalPrizePool / 1000000).toFixed(2)}M`}
            description="Battle rewards waiting"
            color="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600"
          />
          <StatCard
            icon={Users}
            label="Active Warriors"
            value={liveStats.activePlayers}
            description="Players battling now"
            color="bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-600"
            animate={true}
          />
          <StatCard
            icon={Activity}
            label="Live Battles"
            value={liveStats.liveMatches}
            description="Matches in progress"
            color="bg-gradient-to-br from-red-500 via-pink-600 to-purple-600"
            animate={true}
          />
        </div>
      </section>

      {/* Free Fire Game Modes */}
      <section>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-gaming">BATTLE MODES</h2>
          <p className="text-gray-400 text-xl">Choose your path to victory</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gameModes.map((mode, index) => (
            <GameModeCard key={mode.name} mode={mode} index={index} />
          ))}
        </div>
      </section>

      {/* Enhanced Tournament Section */}
      <section>
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <h2 className="text-5xl font-bold text-white mb-4 font-gaming">FEATURED BATTLES</h2>
            <p className="text-gray-400 text-xl">Elite tournaments for true warriors</p>
          </div>
          <Link
            to="/tournaments"
            className="text-neon-blue hover:text-electric-blue font-bold flex items-center space-x-3 transition-all duration-300 group text-lg"
          >
            <span>All Tournaments</span>
            <Swords className="h-6 w-6 group-hover:animate-bounce" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {tournaments.slice(0, 6).map((tournament, index) => (
            <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
          ))}
        </div>
      </section>

      {/* Elite Leaderboard with enhanced Free Fire theme */}
      <section>
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <h2 className="text-5xl font-bold text-white mb-4 font-gaming">HALL OF LEGENDS</h2>
            <p className="text-gray-400 text-xl">Elite warriors of Free Fire arena</p>
          </div>
          <Link
            to="/leaderboards"
            className="text-neon-purple hover:text-electric-purple font-bold flex items-center space-x-3 transition-all duration-300 group text-lg"
          >
            <span>Full Rankings</span>
            <Crown className="h-6 w-6 group-hover:animate-pulse" />
          </Link>
        </motion.div>
        
        <div className="glass rounded-3xl p-10 kinetic-waves border-2 border-white/10">
          <div className="space-y-8">
            {leaderboard.slice(0, 8).map((player, index) => (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.03, x: 15 }}
                className="flex items-center space-x-8 p-6 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent rounded-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-neon-blue/30"
              >
                {/* Enhanced Rank Badge */}
                <motion.div 
                  className={`relative flex items-center justify-center w-16 h-16 rounded-2xl text-white font-bold text-xl ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow-lg' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-glow' :
                    index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-500 shadow-glow' :
                    'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
                  }`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {index < 3 ? (
                    <Crown className="h-8 w-8" />
                  ) : (
                    <span>#{player.rank}</span>
                  )}
                  {index === 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Player Avatar with Free Fire theme */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-red/20 flex items-center justify-center border-2 border-neon-blue/30 group-hover:border-neon-blue">
                  <Skull className="h-8 w-8 text-neon-blue group-hover:text-white transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-bold text-xl group-hover:text-neon-blue transition-colors mb-2">
                    {player.username}
                  </h4>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-red-400" />
                      <span>Level {player.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span>{player.wins} Victories</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Crosshair className="h-4 w-4 text-green-400" />
                      <span>{player.kills} Eliminations</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-bold text-2xl mb-1">
                    {player.points.toLocaleString()}
                  </p>
                  <p className="text-neon-green text-sm font-semibold uppercase tracking-wide">Battle Points</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  className="text-neon-blue opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <TrendingUp className="h-8 w-8" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-gaming">QUICK ACTIONS</h2>
          <p className="text-gray-400 text-xl">Ready for battle? Get started now!</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/tournaments" className="glass rounded-3xl p-8 text-center group hover:border-neon-blue/50 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-shadow duration-300">
              <Play className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Join Tournament</h3>
            <p className="text-gray-400">Enter live battles and compete for prizes</p>
          </Link>
          
          <Link to="/wallet" className="glass rounded-3xl p-8 text-center group hover:border-neon-green/50 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-shadow duration-300">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Add Funds</h3>
            <p className="text-gray-400">Top up your wallet for tournament entries</p>
          </Link>
          
          <Link to="/leaderboards" className="glass rounded-3xl p-8 text-center group hover:border-neon-purple/50 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-shadow duration-300">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">View Rankings</h3>
            <p className="text-gray-400">Check your position among elite warriors</p>
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;