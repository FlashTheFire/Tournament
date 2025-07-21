import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
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
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { apiService } from '../services/api';
import safeToast from '../utils/safeToast';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    game_type: '',
    country: '',
    mode: '',
    status: ''
  });

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
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'TH', label: 'Thailand' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'SG', label: 'Singapore' }
  ];

  const modes = [
    { value: '', label: 'All Modes' },
    { value: 'solo', label: 'Solo (1v1)', icon: Users },
    { value: 'duo', label: 'Duo (2v2)', icon: Users },
    { value: 'squad', label: 'Squad (4v4)', icon: Users }
  ];

  const statuses = [
    { value: '', label: 'All Status', icon: Activity },
    { value: 'upcoming', label: 'Starting Soon', icon: Timer },
    { value: 'live', label: 'Live Battle', icon: Activity },
    { value: 'completed', label: 'Finished', icon: Trophy }
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
      safeToast.error('Failed to load tournaments');
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

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { 
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600', 
        text: 'STARTING SOON',
        icon: Timer
      },
      live: { 
        color: 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse-glow', 
        text: 'LIVE BATTLE',
        icon: Activity 
      },
      completed: { 
        color: 'bg-gradient-to-r from-gray-500 to-gray-600', 
        text: 'COMPLETED',
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
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <motion.img
            src={battleImage}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
          />
          
          {/* Enhanced overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-red/10 via-transparent to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Battle Status */}
          <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 flex flex-wrap gap-1 sm:gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-glow ${statusBadge.color}`}
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
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-glow"
              >
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4" />
                  <span>HOUSE FULL</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Prize Pool */}
          <motion.div 
            className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-glow flex items-center space-x-1">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{tournament.prize_pool?.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Battle Map Info */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6">
            <div className="flex items-center space-x-1 sm:space-x-2 text-white/90 mb-1 sm:mb-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-neon-green flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate">
                {tournament.battle_map || battleMaps[index % battleMaps.length]}
              </span>
            </div>
          </div>
          
          {/* Tournament Title */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl leading-tight">
              {tournament.name}
            </h3>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0 text-white/90 text-xs sm:text-sm">
              <motion.div 
                className="flex items-center space-x-1 sm:space-x-2 bg-black/40 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-neon-blue flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap">{tournament.current_participants}/{tournament.max_participants}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-1 sm:space-x-2 bg-black/40 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 128, 0.1)' }}
              >
                <BattleModeIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-neon-red flex-shrink-0" />
                <span className="font-semibold capitalize whitespace-nowrap truncate">{tournament.game_type.replace('_', ' ')}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Battle Details Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Entry Fee</p>
              <p className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-neon-green flex-shrink-0" />
                {tournament.entry_fee}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Battle Mode</p>
              <p className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center capitalize">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-neon-purple flex-shrink-0" />
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

          {/* Action Buttons - Reduced Height */}
          <div className="flex space-x-3 pt-2">
            <Link
              to={`/tournaments/${tournament.tournament_id}`}
              className="flex-1 btn-premium ripple mobile-friendly group py-2.5 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <Crosshair className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-bold text-sm">ENTER BATTLE</span>
                <Flame className="h-4 w-4 group-hover:animate-pulse" />
              </div>
            </Link>
            
            {!isFull && tournament.status === 'upcoming' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass border border-neon-purple/50 text-white rounded-xl hover:border-neon-purple hover:shadow-glow transition-all duration-300 px-4 py-2.5"
              >
                <Star className="h-4 w-4 text-neon-purple" />
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
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Compact Modern Header - Removed Battle Tournaments and Live Battles cards */}
      <motion.div 
        className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 font-gaming">
            <span className="text-gradient bg-gradient-to-r from-neon-red via-electric-purple to-neon-blue">
              FREE FIRE
            </span>
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">BATTLE TOURNAMENTS</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Join epic battles and claim victory in the ultimate arena</p>
        </div>
      </motion.div>

      {/* Enhanced Battle Filters with Mobile Horizontal Layout - Based on screenshot */}
      <motion.div 
        className="glass rounded-xl p-3 sm:p-4 border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-neon-blue to-electric-purple rounded-lg flex items-center justify-center flex-shrink-0">
              <Filter className="h-3 w-3 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-base">Battle Filters</h3>
              <p className="text-gray-400 text-xs">Choose your battlefield</p>
            </div>
          </div>
        </div>

        {/* MOBILE: Single Row Filter Layout - Horizontal cards like screenshot */}
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {[
            {
              key: 'game_type',
              title: 'Game Mode',
              options: gameTypes,
              icon: Target,
              gradient: 'from-blue-500 to-cyan-600',
              image: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fGJsdWV8MTc1Mjk4ODc4N3ww&ixlib=rb-4.1.0&q=85'
            },
            {
              key: 'country',
              title: 'Region',
              options: countries,
              icon: Shield,
              gradient: 'from-green-500 to-emerald-600',
              image: 'https://images.unsplash.com/photo-1504370164829-8c6ef0c41d06?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxnYW1pbmd8ZW58MHx8fGJsdWV8MTc1Mjk4ODc4N3ww&ixlib=rb-4.1.0&q=85'
            },
            {
              key: 'mode',
              title: 'Battle Mode',
              options: modes,
              icon: Users,
              gradient: 'from-purple-500 to-pink-600',
              image: 'https://images.unsplash.com/photo-1656662961786-b04873ceb4b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxnYW1pbmd8ZW58MHx8fGJsdWV8MTc1Mjk4ODc4N3ww&ixlib=rb-4.1.0&q=85'
            },
            {
              key: 'status',
              title: 'Status',
              options: statuses,
              icon: Activity,
              gradient: 'from-red-500 to-orange-600',
              image: 'https://images.unsplash.com/photo-1612801798930-288967b6d1ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxlc3BvcnRzfGVufDB8fHxibHVlfDE3NTMwMzYxNDZ8MA&ixlib=rb-4.1.0&q=85'
            }
          ].map((filter, index) => {
            const FilterIcon = filter.icon;
            return (
              <motion.div
                key={filter.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-lg border border-white/20 hover:border-neon-blue/50 transition-all duration-300">
                  {/* Background Image - Smaller for mobile */}
                  <div className="relative h-16 sm:h-20 md:h-24">
                    <img 
                      src={filter.image} 
                      alt={filter.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${filter.gradient}/20`}></div>
                    
                    {/* Filter Icon - Smaller for mobile */}
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r ${filter.gradient} rounded flex items-center justify-center shadow-glow`}>
                        <FilterIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 text-white" />
                      </div>
                    </div>
                    
                    {/* Title - Smaller for mobile */}
                    <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2">
                      <h4 className="text-white font-bold text-2xs sm:text-xs">{filter.title}</h4>
                    </div>
                  </div>
                  
                  {/* Dropdown - Compact */}
                  <div className="p-1 sm:p-2 bg-gradient-to-br from-cosmic-dark/90 to-cosmic-black/90 backdrop-blur-sm">
                    <select
                      value={filters[filter.key]}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded px-1 py-1 sm:px-2 sm:py-1.5 text-white text-2xs sm:text-xs focus:outline-none focus:ring-1 focus:ring-neon-blue/50 focus:border-neon-blue/50 hover:border-neon-blue/30 transition-all duration-300"
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value} className="bg-cosmic-dark text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tournament Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 font-gaming">ACTIVE BATTLES</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Choose your battlefield and dominate</p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-neon-green rounded-full flex-shrink-0"
            />
            <span className="text-neon-green font-semibold text-xs sm:text-sm">Live Updates</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-[500px] sm:h-[600px] rounded-3xl kinetic-waves"></div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {tournaments.length > 0 ? (
                tournaments.map((tournament, index) => (
                  <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
                ))
              ) : (
                <motion.div 
                  className="col-span-full text-center py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="glass rounded-3xl p-12 max-w-md mx-auto">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">No battles found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your battle filters</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFilters({ game_type: '', country: '', mode: '', status: '' });
                      }}
                      className="btn-premium px-6 py-3"
                    >
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Reset Filters</span>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Tournaments;