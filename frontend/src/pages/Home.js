import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Clock, 
  Play, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Target,
  Shield,
  Crown,
  Gamepad2,
  Flame
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    totalPrizePool: 0,
    activePlayers: 0,
    liveMatches: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tournamentsData, leaderboardData] = await Promise.all([
        apiService.getTournaments({ limit: 6 }),
        apiService.getLeaderboards('free_fire', null, 5)
      ]);

      setTournaments(tournamentsData.tournaments || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      
      // Enhanced stats for 2025
      setStats({
        totalTournaments: 147,
        totalPrizePool: 850000,
        activePlayers: 12847,
        liveMatches: 34
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // High-quality gaming images
  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1548003693-b55d51032288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1558008412-f42c059a9d02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1636036824578-d0d300a4effb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85"
  ];

  const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-2xl p-6 text-center relative overflow-hidden group cursor-pointer kinetic-waves"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className={`mx-auto w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 relative z-10 group-hover:shadow-neon-lg transition-shadow duration-300`}>
        <Icon className="h-8 w-8 text-white drop-shadow-lg" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-2 font-gaming">{value.toLocaleString()}</h3>
      <p className="text-neon-blue text-sm font-medium mb-1">{label}</p>
      <p className="text-gray-400 text-xs opacity-80">{description}</p>
    </motion.div>
  );

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -12, 
        rotateX: 5, 
        rotateY: 5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="tournament-card glass rounded-2xl overflow-hidden relative group"
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={heroImages[index % heroImages.length]}
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Animated Status Badge */}
        <motion.div 
          className="absolute top-4 left-4"
          whileHover={{ scale: 1.1 }}
        >
          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-glow animate-pulse-glow' 
              : tournament.status === 'upcoming'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow-sm'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
          }`}>
            {tournament.status === 'live' && <Flame className="h-4 w-4" />}
            {tournament.status === 'upcoming' && <Clock className="h-4 w-4" />}
            <span>
              {tournament.status === 'live' ? 'LIVE NOW' : 
               tournament.status === 'upcoming' ? 'STARTING SOON' : 
               'FULL'}
            </span>
          </span>
        </motion.div>

        {/* Prize Pool Highlight */}
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-glow">
            ₹{tournament.prize_pool.toLocaleString()}
          </div>
        </motion.div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-3 drop-shadow-lg">{tournament.name}</h3>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <motion.span 
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-4 w-4" />
              <span>{tournament.current_participants}/{tournament.max_participants}</span>
            </motion.span>
            <motion.span 
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span>₹{tournament.entry_fee}</span>
            </motion.span>
          </div>
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Game Mode</p>
            <div className="flex items-center space-x-1">
              <Gamepad2 className="h-4 w-4 text-neon-purple" />
              <p className="text-white font-semibold capitalize">{tournament.mode}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Type</p>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-neon-green" />
              <p className="text-white font-semibold capitalize">{tournament.tournament_type}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="h-4 w-4 text-neon-blue" />
          <span className="text-gray-300 text-sm">
            Starts: {new Date(tournament.start_time).toLocaleDateString()} at {new Date(tournament.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        
        <Link
          to={`/tournaments/${tournament.tournament_id}`}
          className="block w-full btn-premium text-center ripple mobile-friendly relative z-10"
        >
          <div className="flex items-center justify-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Join Tournament</span>
          </div>
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Enhanced Skeleton Loading */}
        <div className="skeleton h-96 rounded-2xl kinetic-waves"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-12"
    >
      {/* Ultra-Premium Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="relative h-[500px] rounded-3xl overflow-hidden group"
      >
        <motion.img
          src={heroImages[0]}
          alt="Hero"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        
        {/* Kinetic Energy Effects */}
        <div className="absolute inset-0 kinetic-waves"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 particle-effect"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 80 }}
              className="max-w-3xl"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6 font-gaming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-white drop-shadow-2xl">Free Fire</span>
                <br />
                <span className="text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red animate-glow">
                  ULTIMATE ARENA
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-200 mb-10 leading-relaxed drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Enter the ultimate Free Fire battleground. Compete in epic tournaments, dominate the leaderboards, and claim your share of massive prize pools!
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Link
                  to="/tournaments"
                  className="btn-premium text-lg px-10 py-4 ripple mobile-friendly group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Play className="h-6 w-6 group-hover:animate-pulse" />
                    <span>Join Tournament</span>
                    <Zap className="h-6 w-6 group-hover:animate-bounce" />
                  </div>
                </Link>
                
                <Link
                  to="/leaderboards"
                  className="glass px-10 py-4 rounded-xl font-semibold text-lg border border-neon-blue/50 hover:border-neon-blue hover:shadow-glow transition-all duration-300 inline-flex items-center justify-center space-x-3 mobile-friendly group"
                >
                  <Crown className="h-6 w-6 text-yellow-400 group-hover:animate-pulse" />
                  <span className="text-white">View Rankings</span>
                  <Star className="h-6 w-6 text-yellow-400 group-hover:animate-spin" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Stats Section */}
      <section>
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4 font-gaming">Platform Statistics</h2>
          <p className="text-gray-400 text-lg">Real-time battle arena metrics</p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Trophy}
            label="Active Tournaments"
            value={stats.totalTournaments}
            description="Battles ongoing"
            color="bg-gradient-to-br from-yellow-500 to-orange-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Prize Pool"
            value={stats.totalPrizePool}
            description="₹ in rewards"
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            icon={Users}
            label="Active Warriors"
            value={stats.activePlayers}
            description="Players online"
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatCard
            icon={Flame}
            label="Live Battles"
            value={stats.liveMatches}
            description="Matches in progress"
            color="bg-gradient-to-br from-red-500 to-pink-600"
          />
        </div>
      </section>

      {/* Featured Tournaments */}
      <section>
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 font-gaming">Featured Battles</h2>
            <p className="text-gray-400 text-lg">Epic tournaments waiting for champions</p>
          </div>
          <Link
            to="/tournaments"
            className="text-neon-blue hover:text-electric-blue font-semibold flex items-center space-x-2 transition-all duration-300 group"
          >
            <span>View All</span>
            <Calendar className="h-5 w-5 group-hover:animate-bounce" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.slice(0, 6).map((tournament, index) => (
            <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
          ))}
        </div>
      </section>

      {/* Elite Leaderboard */}
      <section>
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 font-gaming">Elite Warriors</h2>
            <p className="text-gray-400 text-lg">Top performers in the arena</p>
          </div>
          <Link
            to="/leaderboards"
            className="text-neon-purple hover:text-electric-purple font-semibold flex items-center space-x-2 transition-all duration-300 group"
          >
            <span>Full Leaderboard</span>
            <Shield className="h-5 w-5 group-hover:animate-pulse" />
          </Link>
        </motion.div>
        
        <div className="glass rounded-2xl p-8 kinetic-waves">
          <div className="space-y-6">
            {leaderboard.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center space-x-6 p-6 hover:bg-white/5 rounded-xl transition-all duration-300 group cursor-pointer"
              >
                <motion.div 
                  className={`flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-glow-sm' :
                    index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-500 shadow-glow-sm' :
                    'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  whileHover={{ rotate: 5 }}
                >
                  {index < 3 ? <Crown className="h-6 w-6" /> : player.rank}
                </motion.div>
                
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <Gamepad2 className="h-8 w-8 text-neon-blue" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg group-hover:text-neon-blue transition-colors">
                    {player.username}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Level {player.level}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{player.wins} wins</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-bold text-xl">
                    {player.points.toLocaleString()}
                  </p>
                  <p className="text-neon-green text-sm font-medium">points</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrendingUp className="h-6 w-6" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;