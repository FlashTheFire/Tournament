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
        tournament: 'Elite Championship'
      },
      {
        id: 2,
        type: 'matchmaking',
        title: 'Perfect Match Found',
        description: 'AI found 11 players with similar skill level for your next match',
        confidence: 94,
        tournament: 'Ranked Battle'
      },
      {
        id: 3,
        type: 'analytics',
        title: 'Skill Improvement',
        description: 'Your headshot accuracy improved by 23% this week',
        confidence: 89,
        tournament: 'Practice Mode'
      }
    ]);
  };

  const heroImages = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
  ];

  const TournamentCard = ({ tournament }) => (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      className="glass rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-neon-blue/5 to-electric-purple/5 relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-transparent to-electric-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-2 font-gaming group-hover:text-neon-blue transition-colors"
              whileHover={{ x: 5 }}
            >
              {tournament.tournament_name}
            </motion.h3>
            <p className="text-gray-400">{tournament.game_type || 'Battle Royale'}</p>
          </div>
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ₹{tournament.prize_pool?.toLocaleString() || '50,000'}
          </motion.div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Entry Fee:</span>
            <span className="text-neon-green font-bold">₹{tournament.entry_fee || '100'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Players:</span>
            <span className="text-white font-bold">{tournament.current_participants || 87}/{tournament.max_participants || 100}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Status:</span>
            <span className="text-yellow-400 font-bold">Registering</span>
          </div>
        </div>

        <Link
          to={`/tournaments/${tournament.tournament_id}`}
          className="block w-full btn-premium text-center ripple mobile-friendly group relative z-10"
        >
          <motion.div 
            className="flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <Gamepad2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold">ENTER BATTLE</span>
            <Flame className="h-5 w-5 group-hover:animate-pulse" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-black">
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
      className="w-full bg-cosmic-black"
    >
      {/* Full-Screen Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Fixed full-screen background */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="w-full h-full bg-center bg-cover bg-no-repeat bg-fixed"
            style={{
              backgroundImage: `url('${heroImages[0]}')`
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-black/85 via-cosmic-dark/70 to-cosmic-deep/85"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-red/8 via-transparent to-electric-blue/8"></div>
          {/* Advanced particle effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="kinetic-waves"></div>
          </div>
        </div>

        {/* Full-width main content - NO "Battle Royale Championship" banner */}
        <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8">
          
          {/* Main Title */}
          <motion.h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black mb-12 font-gaming leading-none"
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
            className="text-xl sm:text-2xl md:text-4xl text-gray-200 mb-16 leading-relaxed drop-shadow-lg max-w-7xl mx-auto font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Experience the most intense Free Fire tournaments with{' '}
            <span className="text-neon-blue font-bold">AI-powered matchmaking</span>, 
            real-time analytics, and massive prize pools!
          </motion.p>
          
          {/* Enhanced Live battle stats - Full width grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {[
              { icon: Activity, label: 'Live Battles', value: liveStats.liveMatches, color: 'text-neon-green', gradient: 'from-neon-green/20 to-emerald-500/20', border: 'border-neon-green/30' },
              { icon: Users, label: 'Elite Warriors', value: `${Math.floor(liveStats.activePlayers/1000)}K+`, color: 'text-neon-purple', gradient: 'from-neon-purple/20 to-electric-purple/20', border: 'border-neon-purple/30' },
              { icon: Crown, label: 'Prize Pool', value: `₹${Math.floor(liveStats.totalPrizePool/100000)/10}M`, color: 'text-yellow-400', gradient: 'from-yellow-400/20 to-orange-500/20', border: 'border-yellow-400/30' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`glass rounded-3xl p-6 md:p-8 text-center bg-gradient-to-br ${stat.gradient} border ${stat.border} relative overflow-hidden backdrop-blur-2xl`}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                animate={{ y: [-3, 3, -3] }}
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
                  <stat.icon className={`h-12 w-12 md:h-16 md:w-16 ${stat.color} mx-auto mb-4 drop-shadow-2xl`} />
                </motion.div>
                <div className="relative z-10">
                  <motion.p 
                    className={`text-3xl md:text-5xl font-black ${stat.color} mb-2 font-gaming drop-shadow-2xl`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >{stat.value}</motion.p>
                  <p className="text-white font-semibold text-lg md:text-xl">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <Link
              to="/tournaments"
              className="btn-premium text-xl md:text-2xl px-12 md:px-16 py-6 md:py-8 ripple mobile-friendly group relative overflow-hidden"
            >
              <motion.div 
                className="flex items-center justify-center space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <Crosshair className="h-8 w-8 md:h-10 md:w-10 group-hover:animate-spin" />
                <span className="font-black tracking-wide">JOIN ELITE BATTLE</span>
                <Flame className="h-8 w-8 md:h-10 md:w-10 group-hover:animate-bounce" />
              </motion.div>
            </Link>
            
            <Link
              to="/leaderboards"
              className="glass px-12 md:px-16 py-6 md:py-8 rounded-3xl font-bold text-xl md:text-2xl border-2 border-neon-blue/50 hover:border-neon-blue hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-4 mobile-friendly group backdrop-blur-xl"
            >
              <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-400 group-hover:animate-pulse" />
              <span>VIEW CHAMPIONS</span>
              <ArrowRight className="h-8 w-8 md:h-10 md:w-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Advanced Scrollable Sections */}
      <div className="space-y-32 py-32 w-full">
        
        {/* AI-Powered Features Section */}
        <motion.section
          className="w-full px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-8 w-8 text-purple-400 animate-pulse" />
              <span className="text-purple-300 font-bold uppercase tracking-wide text-xl">AI-Powered Gaming</span>
              <Zap className="h-8 w-8 text-yellow-400 animate-bounce" />
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-7xl font-black text-white mb-8 font-gaming"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              SMART BATTLE SYSTEM
            </motion.h2>
            <p className="text-gray-400 text-2xl max-w-4xl mx-auto leading-relaxed">
              Experience next-generation gaming with AI-driven matchmaking, predictive analytics, and personalized insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {aiPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                className="glass rounded-3xl p-8 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 relative overflow-hidden group"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <Brain className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 font-gaming">{prediction.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{prediction.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold">Confidence</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-cosmic-dark rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${prediction.confidence}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-white font-bold">{prediction.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tournaments Section */}
        <motion.section
          className="w-full px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-8 py-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="h-8 w-8 text-red-400 animate-pulse" />
              <span className="text-red-300 font-bold uppercase tracking-wide text-xl">Live Tournaments</span>
              <Crown className="h-8 w-8 text-yellow-400 animate-bounce" />
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-7xl font-black text-white mb-8 font-gaming"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              ACTIVE BATTLES
            </motion.h2>
            <p className="text-gray-400 text-2xl max-w-4xl mx-auto leading-relaxed">
              Join elite tournaments with massive prize pools and compete against the best Free Fire warriors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tournaments.length > 0 ? (
              tournaments.slice(0, 6).map((tournament, index) => (
                <motion.div
                  key={tournament.tournament_id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <TournamentCard tournament={tournament} />
                </motion.div>
              ))
            ) : (
              // Mock tournaments for demo
              [...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <TournamentCard tournament={{
                    tournament_id: index,
                    tournament_name: `Elite Championship ${index + 1}`,
                    prize_pool: 50000 + (index * 10000),
                    entry_fee: 100 + (index * 50),
                    current_participants: 67 + index * 5,
                    max_participants: 100,
                    game_type: 'Battle Royale'
                  }} />
                </motion.div>
              ))
            )}
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              to="/tournaments"
              className="btn-premium text-2xl px-16 py-8 ripple mobile-friendly group relative overflow-hidden"
            >
              <motion.div 
                className="flex items-center justify-center space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="h-10 w-10 group-hover:animate-spin" />
                <span className="font-black tracking-wide">VIEW ALL TOURNAMENTS</span>
                <ArrowRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>

        {/* Champions Section */}
        <motion.section
          className="w-full px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-8 py-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
              <span className="text-yellow-300 font-bold uppercase tracking-wide text-xl">Hall of Fame</span>
              <Shield className="h-8 w-8 text-yellow-400 animate-bounce" />
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-7xl font-black text-white mb-8 font-gaming"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              ELITE WARRIORS
            </motion.h2>
            <p className="text-gray-400 text-2xl max-w-4xl mx-auto leading-relaxed">
              Meet the legendary champions who dominate the Free Fire battlefield with skill and strategy
            </p>
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/leaderboards"
              className="glass px-16 py-8 rounded-3xl font-bold text-2xl border-2 border-yellow-400/50 hover:border-yellow-400 hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-4 mobile-friendly group backdrop-blur-xl"
            >
              <Trophy className="h-10 w-10 text-yellow-400 group-hover:animate-pulse" />
              <span>VIEW CHAMPION LEADERBOARDS</span>
              <ArrowRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Home;