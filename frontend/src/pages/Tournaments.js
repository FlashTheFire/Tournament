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
      
      // Add mock tournaments for demo
      const mockTournaments = [
        {
          tournament_id: 'ff-br-001',
          name: 'Free Fire Battle Royale Championship',
          game_type: 'free_fire',
          tournament_type: 'battle_royale',
          entry_fee: 50,
          prize_pool: 10000,
          max_participants: 100,
          current_participants: 78,
          start_time: new Date(Date.now() + 86400000).toISOString(),
          registration_deadline: new Date(Date.now() + 43200000).toISOString(),
          mode: 'squad',
          country: 'IN',
          status: 'upcoming',
          description: 'Ultimate Free Fire tournament with amazing prizes!'
        },
        {
          tournament_id: 'pubg-squad-002',
          name: 'PUBG Mobile Squad Masters',
          game_type: 'pubg',
          tournament_type: 'single_elimination',
          entry_fee: 100,
          prize_pool: 25000,
          max_participants: 64,
          current_participants: 64,
          start_time: new Date(Date.now() + 3600000).toISOString(),
          registration_deadline: new Date(Date.now() - 3600000).toISOString(),
          mode: 'squad',
          country: 'IN',
          status: 'live',
          description: 'Professional PUBG Mobile tournament'
        },
        {
          tournament_id: 'bgmi-duo-003',
          name: 'BGMI Duo Championship',
          game_type: 'bgmi',
          tournament_type: 'round_robin',
          entry_fee: 75,
          prize_pool: 15000,
          max_participants: 50,
          current_participants: 45,
          start_time: new Date(Date.now() + 172800000).toISOString(),
          registration_deadline: new Date(Date.now() + 129600000).toISOString(),
          mode: 'duo',
          country: 'IN',
          status: 'upcoming',
          description: 'Competitive BGMI duo tournament'
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
      upcoming: { color: 'bg-blue-500', text: 'UPCOMING' },
      live: { color: 'bg-red-500', text: 'LIVE' },
      completed: { color: 'bg-gray-500', text: 'COMPLETED' }
    };
    return badges[status] || badges.upcoming;
  };

  const TournamentCard = ({ tournament, index }) => {
    const statusBadge = getStatusBadge(tournament.status);
    const gameImage = gameImages[tournament.game_type] || gameImages.free_fire;
    const isFull = tournament.current_participants >= tournament.max_participants;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="tournament-card glass rounded-xl overflow-hidden"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={gameImage}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
            {isFull && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                FULL
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium capitalize">
                {tournament.game_type.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {tournament.name}
            </h3>
            <div className="flex items-center justify-between text-white/90 text-sm">
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{tournament.current_participants}/{tournament.max_participants}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>₹{tournament.prize_pool?.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Entry Fee</p>
              <p className="text-white font-semibold flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                ₹{tournament.entry_fee}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Mode</p>
              <p className="text-white font-semibold flex items-center capitalize">
                <Gamepad2 className="h-4 w-4 mr-1 text-primary-400" />
                {tournament.mode}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>Starts: {new Date(tournament.start_time).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-orange-400" />
              <span>Registration: {new Date(tournament.registration_deadline).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-red-400" />
              <span className="uppercase">{tournament.country}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/tournaments/${tournament.tournament_id}`}
              className="flex-1 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all duration-300 ripple"
            >
              View Details
            </Link>
            {!isFull && tournament.status === 'upcoming' && (
              <button className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                <Trophy className="h-5 w-5" />
              </button>
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