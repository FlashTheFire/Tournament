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
  Award
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
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
      
      // Mock stats for demo
      setStats({
        totalTournaments: 47,
        totalPrizePool: 125000,
        activePlayers: 2847,
        liveMatches: 12
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwdG91cm5hbWVudHxlbnwwfHx8fDE3NTI5MzcxMDN8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1558008258-7ff8888b42b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxlc3BvcnRzJTIwdG91cm5hbWVudHxlbnwwfHx8fDE3NTI5MzcxMDN8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1564049489314-60d154ff107d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBnYW1pbmd8ZW58MHx8fHwxNzUyOTM3MTExfDA&ixlib=rb-4.1.0&q=85"
  ];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass rounded-xl p-6 text-center"
    >
      <div className={`mx-auto w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="tournament-card glass rounded-xl overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={heroImages[index % heroImages.length]}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            tournament.status === 'live' 
              ? 'bg-red-500 text-white' 
              : tournament.status === 'upcoming'
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {tournament.status === 'live' ? 'LIVE' : 
             tournament.status === 'upcoming' ? 'STARTING SOON' : 
             'SOLD OUT'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg mb-2">{tournament.name}</h3>
          <div className="flex items-center justify-between text-white/80 text-sm">
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{tournament.current_participants}/{tournament.max_participants}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>₹{tournament.prize_pool}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Entry Fee</p>
            <p className="text-white font-semibold">₹{tournament.entry_fee}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Game Mode</p>
            <p className="text-white font-semibold capitalize">{tournament.mode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 text-sm">
            Starts: {new Date(tournament.start_time).toLocaleDateString()}
          </span>
        </div>
        <Link
          to={`/tournaments/${tournament.tournament_id}`}
          className="block w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all duration-300 ripple"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Loading */}
        <div className="skeleton h-64 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-96 rounded-2xl overflow-hidden"
      >
        <img
          src={heroImages[0]}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ultimate Gaming
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                  {' '}Arena
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Join epic Free Fire, PUBG, and BGMI tournaments. Compete with the best players and win amazing prizes!
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/tournaments"
                  className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center justify-center space-x-2 ripple"
                >
                  <Play className="h-5 w-5" />
                  <span>Join Tournament</span>
                </Link>
                <Link
                  to="/leaderboards"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center space-x-2"
                >
                  <Award className="h-5 w-5" />
                  <span>View Rankings</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={Trophy}
            label="Total Tournaments"
            value={stats.totalTournaments}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={DollarSign}
            label="Prize Pool"
            value={stats.totalPrizePool}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />
          <StatCard
            icon={Users}
            label="Active Players"
            value={stats.activePlayers}
            color="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Live Matches"
            value={stats.liveMatches}
            color="bg-gradient-to-r from-red-500 to-pink-500"
          />
        </div>
      </section>

      {/* Featured Tournaments */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Tournaments</h2>
            <p className="text-gray-400">Join the hottest competitions right now</p>
          </div>
          <Link
            to="/tournaments"
            className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-2 transition-colors"
          >
            <span>View All</span>
            <Calendar className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.slice(0, 6).map((tournament, index) => (
            <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
          ))}
        </div>
      </section>

      {/* Top Players */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Top Players</h2>
            <p className="text-gray-400">Current leaderboard champions</p>
          </div>
          <Link
            to="/leaderboards"
            className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-2 transition-colors"
          >
            <span>View Leaderboards</span>
            <Star className="h-4 w-4" />
          </Link>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                  {player.rank}
                </div>
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-10 h-10 rounded-full bg-gray-600"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{player.username}</h4>
                  <p className="text-gray-400 text-sm">Level {player.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{player.points.toLocaleString()} pts</p>
                  <p className="text-gray-400 text-sm">{player.wins} wins</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;