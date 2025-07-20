import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Gamepad2,
  Target,
  Crosshair,
  Flame,
  Activity,
  Timer,
  Skull,
  Shield,
  Swords,
  Crown,
  Zap,
  Star,
  Play,
  ChevronLeft,
  Award,
  Eye,
  TrendingUp
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    loadTournamentDetails();
  }, [id]);

  const loadTournamentDetails = async () => {
    try {
      setLoading(true);
      
      // Mock tournament data based on ID
      const mockTournaments = {
        'ff-br-championship': {
          tournament_id: 'ff-br-championship',
          name: 'Free Fire Battle Royale World Championship',
          description: 'The ultimate Free Fire Battle Royale tournament featuring the best players from around the world. Experience intense survival gameplay in the iconic Bermuda map with massive prize pools and exclusive rewards.',
          game_type: 'battle_royale',
          tournament_type: 'elimination',
          entry_fee: 250,
          prize_pool: 50000,
          max_participants: 200,
          current_participants: 178,
          start_time: new Date(Date.now() + 86400000).toISOString(),
          registration_deadline: new Date(Date.now() + 43200000).toISOString(),
          mode: 'squad',
          country: 'IN',
          status: 'upcoming',
          battle_map: 'Bermuda Remastered',
          kills_required: 15,
          survival_time: '20 min',
          rounds: 3,
          featured_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
          prizes: [
            { place: 1, amount: 25000, percentage: 50 },
            { place: 2, amount: 12500, percentage: 25 },
            { place: 3, amount: 7500, percentage: 15 },
            { place: '4-10', amount: 2500, percentage: 10 }
          ],
          rules: [
            'Squad mode only (4 players per team)',
            'Minimum 15 kills required to qualify for prizes',
            'No hacking, cheating, or exploiting allowed',
            'All participants must be registered with valid Free Fire UID',
            'Tournament matches will be streamed live',
            'Disputes will be resolved by tournament officials'
          ],
          schedule: [
            { time: '10:00 AM', event: 'Registration Opens', status: 'completed' },
            { time: '2:00 PM', event: 'Team Check-in', status: 'upcoming' },
            { time: '3:00 PM', event: 'Round 1 Begins', status: 'upcoming' },
            { time: '4:30 PM', event: 'Round 2 Begins', status: 'upcoming' },
            { time: '6:00 PM', event: 'Final Round', status: 'upcoming' },
            { time: '7:30 PM', event: 'Winner Announcement', status: 'upcoming' }
          ]
        },
        'ff-clash-masters': {
          tournament_id: 'ff-clash-masters',
          name: 'Clash Squad Masters Pro League',
          description: 'Professional Clash Squad tournament for elite players. Fast-paced 4v4 combat in custom maps with tactical gameplay and strategic team coordination.',
          game_type: 'clash_squad',
          tournament_type: 'league',
          entry_fee: 150,
          prize_pool: 25000,
          max_participants: 128,
          current_participants: 128,
          start_time: new Date(Date.now() + 3600000).toISOString(),
          registration_deadline: new Date(Date.now() - 3600000).toISOString(),
          mode: 'squad',
          country: 'BR',
          status: 'live',
          battle_map: 'Purgatory',
          rounds: 5,
          elimination_style: 'single',
          featured_image: "https://images.unsplash.com/photo-1548003693-b55d51032288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
          prizes: [
            { place: 1, amount: 15000, percentage: 60 },
            { place: 2, amount: 7500, percentage: 30 },
            { place: 3, amount: 2500, percentage: 10 }
          ],
          rules: [
            'Clash Squad mode only',
            'Best of 5 rounds format',
            'Single elimination bracket',
            'Professional tournament rules apply',
            'Live streaming mandatory for all matches'
          ]
        }
      };

      const tournamentData = mockTournaments[id];
      if (!tournamentData) {
        toast.error('Tournament not found');
        navigate('/tournaments');
        return;
      }

      setTournament(tournamentData);
      setIsRegistered(Math.random() > 0.5); // Mock registration status
    } catch (error) {
      console.error('Failed to load tournament:', error);
      toast.error('Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for tournaments');
      return;
    }

    try {
      setRegistering(true);
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsRegistered(true);
      toast.success('Successfully registered for the tournament! 🎉');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { 
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600', 
        text: '⏰ STARTING SOON',
        icon: Timer
      },
      live: { 
        color: 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse-glow', 
        text: '🔴 LIVE BATTLE',
        icon: Activity 
      },
      completed: { 
        color: 'bg-gradient-to-r from-gray-500 to-gray-600', 
        text: '🏆 COMPLETED',
        icon: Trophy
      }
    };
    return badges[status] || badges.upcoming;
  };

  const getBattleModeIcon = (gameType) => {
    const icons = {
      battle_royale: Crosshair,
      clash_squad: Swords,
      lone_wolf: Skull,
      rush_hour: Timer
    };
    return icons[gameType] || Target;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading tournament details...</p>
        </motion.div>
      </div>
    );
  }

  if (!tournament) return null;

  const statusBadge = getStatusBadge(tournament.status);
  const BattleModeIcon = getBattleModeIcon(tournament.game_type);
  const isFull = tournament.current_participants >= tournament.max_participants;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/tournaments')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Tournaments</span>
      </motion.button>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative h-96 rounded-3xl overflow-hidden"
      >
        <img
          src={tournament.featured_image}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-transparent to-neon-red/20"></div>
        
        {/* Status and Prize */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`px-6 py-3 rounded-full text-lg font-bold text-white shadow-glow ${statusBadge.color}`}
          >
            <div className="flex items-center space-x-2">
              <statusBadge.icon className="h-5 w-5" />
              <span className="uppercase tracking-wide">{statusBadge.text}</span>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-2xl font-bold shadow-glow"
          >
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6" />
              <span className="text-xl">₹{tournament.prize_pool?.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Tournament Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-2xl font-gaming"
          >
            {tournament.name}
          </motion.h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <motion.div 
              className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
            >
              <Users className="h-5 w-5 text-neon-blue" />
              <span className="text-white font-semibold">{tournament.current_participants}/{tournament.max_participants}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 128, 0.1)' }}
            >
              <BattleModeIcon className="h-5 w-5 text-neon-red" />
              <span className="text-white font-semibold capitalize">{tournament.game_type.replace('_', ' ')}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
            >
              <MapPin className="h-5 w-5 text-neon-green" />
              <span className="text-white font-semibold">{tournament.battle_map}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tournament Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-gaming">Tournament Overview</h2>
            <p className="text-gray-300 leading-relaxed">{tournament.description}</p>
          </motion.div>

          {/* Prize Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 font-gaming flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span>Prize Distribution</span>
            </h3>
            <div className="space-y-3">
              {tournament.prizes?.map((prize, index) => (
                <motion.div
                  key={prize.place}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white' :
                      'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {typeof prize.place === 'number' ? prize.place : prize.place.split('-')[0]}
                    </div>
                    <span className="text-white font-semibold">
                      {typeof prize.place === 'number' ? `${prize.place}st Place` : `Places ${prize.place}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">₹{prize.amount?.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{prize.percentage}% of pool</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 font-gaming flex items-center space-x-2">
              <Shield className="h-6 w-6 text-neon-blue" />
              <span>Tournament Rules</span>
            </h3>
            <div className="space-y-3">
              {tournament.rules?.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-neon-blue to-electric-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{rule}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Registration & Info */}
        <div className="space-y-6">
          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6 border border-neon-blue/20"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 font-gaming">
                {isRegistered ? 'REGISTERED ✅' : 'JOIN BATTLE'}
              </h3>
              <p className="text-gray-300">
                {isFull ? 'Tournament is full' : 
                 isRegistered ? 'You are registered for this tournament' :
                 'Secure your spot in this epic battle'}
              </p>
            </div>

            {!isRegistered && !isFull && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister}
                disabled={registering}
                className="w-full btn-premium py-4 text-lg font-bold ripple mobile-friendly group mb-4"
              >
                <AnimatePresence mode="wait">
                  {registering ? (
                    <motion.div
                      key="registering"
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
                      <span>Registering...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center space-x-3"
                    >
                      <Crosshair className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300" />
                      <span>ENTER BATTLE</span>
                      <Flame className="h-6 w-6 group-hover:animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {tournament.status === 'live' && isRegistered && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-glow mb-4"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Play className="h-6 w-6" />
                  <span>START BATTLE</span>
                </div>
              </motion.button>
            )}

            {/* Tournament Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-neon-green" />
                  <span className="text-gray-300">Entry Fee:</span>
                </div>
                <span className="text-white font-semibold">₹{tournament.entry_fee}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-neon-blue" />
                  <span className="text-gray-300">Participants:</span>
                </div>
                <span className="text-white font-semibold">{tournament.current_participants}/{tournament.max_participants}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-neon-purple" />
                  <span className="text-gray-300">Starts:</span>
                </div>
                <span className="text-white font-semibold">
                  {new Date(tournament.start_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-300">Registration Ends:</span>
                </div>
                <span className="text-white font-semibold">
                  {new Date(tournament.registration_deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    time: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tournament Schedule */}
          {tournament.schedule && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 font-gaming flex items-center space-x-2">
                <Clock className="h-6 w-6 text-orange-400" />
                <span>Schedule</span>
              </h3>
              <div className="space-y-3">
                {tournament.schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'live' ? 'bg-red-500 animate-pulse' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-white font-medium">{item.event}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Live Stream */}
          {tournament.status === 'live' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="glass rounded-2xl p-6 border border-red-500/30 bg-gradient-to-r from-red-500/10 to-pink-500/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 font-gaming flex items-center space-x-2">
                <Eye className="h-6 w-6 text-red-400 animate-pulse" />
                <span>Live Stream</span>
              </h3>
              <p className="text-gray-300 mb-4">Watch the tournament live and cheer for your favorite players!</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-glow"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>WATCH LIVE</span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentDetails;