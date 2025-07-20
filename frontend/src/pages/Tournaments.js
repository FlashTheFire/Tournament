import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  Trophy, 
  Users, 
  Clock, 
  DollarSign,
  Calendar,
  MapPin,
  Gamepad2,
  Target,
  Crosshair,
  Scope,
  Flame,
  Activity,
  Timer,
  Skull,
  Shield,
  Swords,
  Crown,
  Zap,
  Star
} from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game_type: '',
    country: '',
    mode: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Free Fire specific game modes and features
  const gameTypes = [
    { value: '', label: 'All Battles', icon: Target },
    { value: 'battle_royale', label: 'Battle Royale', icon: Crosshair },
    { value: 'clash_squad', label: 'Clash Squad', icon: Swords },
    { value: 'lone_wolf', label: 'Lone Wolf', icon: Skull },
    { value: 'rush_hour', label: 'Rush Hour', icon: Timer }
  ];

  const countries = [
    { value: '', label: 'All Regions' },
    { value: 'IN', label: '🇮🇳 India' },
    { value: 'BR', label: '🇧🇷 Brazil' },
    { value: 'ID', label: '🇮🇩 Indonesia' },
    { value: 'TH', label: '🇹🇭 Thailand' },
    { value: 'MY', label: '🇲🇾 Malaysia' },
    { value: 'SG', label: '🇸🇬 Singapore' }
  ];

  const modes = [
    { value: '', label: 'All Modes' },
    { value: 'solo', label: '👤 Solo (1v1)' },
    { value: 'duo', label: '👥 Duo (2v2)' },
    { value: 'squad', label: '🔥 Squad (4v4)' }
  ];

  const statuses = [
    { value: '', label: 'All Status', icon: Activity },
    { value: 'upcoming', label: '⏰ Starting Soon', icon: Timer },
    { value: 'live', label: '🔴 Live Battle', icon: Activity },
    { value: 'completed', label: '🏆 Finished', icon: Trophy }
  ];

  // Free Fire battle maps and themes
  const battleMaps = [
    'Bermuda Remastered',
    'Purgatory',
    'Kalahari',
    'Alpine',
    'Nextera'
  ];

  const freeFireImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1548003693-b55d51032288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1558008412-f42c059a9d02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjB0b3VybmFtZW50fGVufDB8fHx8MTc1Mjk5NTc2MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1636036824578-d0d300a4effb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1633545495735-25df17fb9f31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxlc3BvcnRzfGVufDB8fHx8MTc1Mjk5NTc2OHww&ixlib=rb-4.1.0&q=85"
  ];

  useEffect(() => {
    loadTournaments();
  }, [filters]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTournaments(filters);
      
      // Enhanced Free Fire tournaments for demo
      const mockTournaments = [
        {
          tournament_id: 'ff-br-championship',
          name: 'Free Fire Battle Royale World Championship',
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
          description: 'Ultimate Free Fire Battle Royale tournament with massive prizes!',
          battle_map: battleMaps[0],
          kills_required: 15,
          survival_time: '20 min'
        },
        {
          tournament_id: 'ff-clash-masters',
          name: 'Clash Squad Masters Pro League',
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
          description: 'Professional Clash Squad tournament for elite players',
          battle_map: battleMaps[1],
          rounds: 5,
          elimination_style: 'single'
        },
        {
          tournament_id: 'ff-lone-wolf-hunt',
          name: 'Lone Wolf Hunter Championship',
          game_type: 'lone_wolf',
          tournament_type: 'battle_royale',
          entry_fee: 100,
          prize_pool: 15000,
          max_participants: 80,
          current_participants: 67,
          start_time: new Date(Date.now() + 172800000).toISOString(),
          registration_deadline: new Date(Date.now() + 129600000).toISOString(),
          mode: 'solo',
          country: 'ID',
          status: 'upcoming',
          description: 'Solo survival tournament - only the strongest survive',
          battle_map: battleMaps[2],
          difficulty: 'Extreme',
          weapons: 'Limited'
        },
        {
          tournament_id: 'ff-rush-hour-blitz',
          name: 'Rush Hour Blitz Tournament',
          game_type: 'rush_hour',
          tournament_type: 'speed',
          entry_fee: 75,
          prize_pool: 8000,
          max_participants: 64,
          current_participants: 45,
          start_time: new Date(Date.now() + 259200000).toISOString(),
          registration_deadline: new Date(Date.now() + 216000000).toISOString(),
          mode: 'duo',
          country: 'TH',
          status: 'upcoming',
          description: 'Fast-paced battles with reduced match time',
          battle_map: battleMaps[3],
          match_duration: '10 min',
          special_mode: 'Speed Boost'
        }
      ];

      setTournaments([...mockTournaments, ...(data.tournaments || [])]);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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

  const TournamentCard = ({ tournament, index }) => {
    const statusBadge = getStatusBadge(tournament.status);
    const battleImage = freeFireImages[index % freeFireImages.length];
    const isFull = tournament.current_participants >= tournament.max_participants;
    const BattleModeIcon = getBattleModeIcon(tournament.game_type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
        whileHover={{ 
          y: -12, 
          scale: 1.03,
          rotateY: 3,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className="tournament-card glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon-blue/50 group"
      >
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={battleImage}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
          />
          
          {/* Enhanced overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-red/10 via-transparent to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Battle Status */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-glow ${statusBadge.color}`}
            >
              <div className="flex items-center space-x-2">
                <statusBadge.icon className="h-4 w-4" />
                <span className="uppercase tracking-wide">{statusBadge.text}</span>
              </div>
            </motion.div>
            
            {isFull && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-glow"
              >
                🔥 HOUSE FULL
              </motion.div>
            )}
          </div>

          {/* Prize Pool */}
          <motion.div 
            className="absolute top-6 right-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-glow flex items-center space-x-1">
              <Crown className="h-4 w-4" />
              <span>₹{tournament.prize_pool?.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Battle Map Info */}
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center space-x-2 text-white/90 mb-2">
              <MapPin className="h-4 w-4 text-neon-green" />
              <span className="text-sm font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                {tournament.battle_map || battleMaps[index % battleMaps.length]}
              </span>
            </div>
          </div>
          
          {/* Tournament Title */}
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white font-bold text-2xl mb-4 drop-shadow-2xl leading-tight">
              {tournament.name}
            </h3>
            <div className="flex items-center justify-between text-white/90 text-sm">
              <motion.div 
                className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
              >
                <Users className="h-5 w-5 text-neon-blue" />
                <span className="font-semibold">{tournament.current_participants}/{tournament.max_participants}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 128, 0.1)' }}
              >
                <BattleModeIcon className="h-5 w-5 text-neon-red" />
                <span className="font-semibold capitalize">{tournament.game_type.replace('_', ' ')}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Battle Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Entry Fee</p>
              <p className="text-white font-bold text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-neon-green" />
                ₹{tournament.entry_fee}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Battle Mode</p>
              <p className="text-white font-bold text-lg flex items-center capitalize">
                <Scope className="h-5 w-5 mr-2 text-neon-purple" />
                {tournament.mode}
              </p>
            </div>
          </div>

          {/* Battle Specifications */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-xl border border-neon-blue/20">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-neon-blue" />
                <span className="text-gray-300">Battle Start:</span>
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
            
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span>Registration Ends:</span>
              </div>
              <span className="text-white font-medium">
                {new Date(tournament.registration_deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-neon-green" />
                <span>Region:</span>
              </div>
              <span className="text-white font-medium uppercase bg-gradient-to-r from-neon-green/20 to-transparent px-2 py-1 rounded">
                {countries.find(c => c.value === tournament.country)?.label || tournament.country}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Link
              to={`/tournaments/${tournament.tournament_id}`}
              className="flex-1 btn-premium py-4 text-center ripple mobile-friendly group"
            >
              <div className="flex items-center justify-center space-x-3">
                <Crosshair className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-bold">ENTER BATTLE</span>
                <Flame className="h-5 w-5 group-hover:animate-pulse" />
              </div>
            </Link>
            
            {!isFull && tournament.status === 'upcoming' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 glass border border-neon-purple/50 text-white rounded-xl hover:border-neon-purple hover:shadow-glow transition-all duration-300"
              >
                <Star className="h-6 w-6 text-neon-purple" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
          <p className="text-gray-400">Discover and join gaming tournaments</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{filteredTournaments.length} tournaments</p>
          <p className="text-gray-400 text-sm">Available now</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournaments by name..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filters.game_type}
            onChange={(e) => handleFilterChange('game_type', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {gameTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-slate-800 text-white">
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {countries.map(country => (
              <option key={country.value} value={country.value} className="bg-slate-800 text-white">
                {country.label}
              </option>
            ))}
          </select>

          <select
            value={filters.mode}
            onChange={(e) => handleFilterChange('mode', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {modes.map(mode => (
              <option key={mode.value} value={mode.value} className="bg-slate-800 text-white">
                {mode.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value} className="bg-slate-800 text-white">
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tournament Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament, index) => (
              <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Tournaments;