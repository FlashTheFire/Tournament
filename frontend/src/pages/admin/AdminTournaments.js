import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import safeToast from '../../utils/safeToast';

const AdminTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const TOURNAMENTS_PER_PAGE = 12;

  useEffect(() => {
    loadTournaments();
  }, [currentPage, searchQuery, statusFilter]);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const params = {
        skip: currentPage * TOURNAMENTS_PER_PAGE,
        limit: TOURNAMENTS_PER_PAGE,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const data = await apiService.getAdminTournaments(
        currentPage * TOURNAMENTS_PER_PAGE,
        TOURNAMENTS_PER_PAGE,
        params
      );

      setTournaments(data.tournaments || []);
      setTotalTournaments(data.total_count || 0);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      safeToast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
    safeToast.success('Tournaments data refreshed');
  };

  const handleUpdateTournament = async (tournamentId, updateData) => {
    try {
      await apiService.updateTournament(tournamentId, updateData);
      safeToast.success('Tournament updated successfully');
      await loadTournaments();
      setShowEditModal(false);
      setEditingTournament(null);
    } catch (error) {
      console.error('Failed to update tournament:', error);
      safeToast.error('Failed to update tournament');
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteTournament(tournamentId);
      safeToast.success('Tournament deleted successfully');
      await loadTournaments();
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      safeToast.error('Failed to delete tournament');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'live':
        return <Play className="h-4 w-4 text-green-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'live':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'completed':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-mobile rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{tournament.name}</h3>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-bold ${getStatusColor(tournament.status)}`}>
            {getStatusIcon(tournament.status)}
            <span className="capitalize">{tournament.status}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedTournament(tournament); setShowTournamentModal(true); }}
            className="p-2 glass-mobile rounded-lg text-neon-blue hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingTournament(tournament); setShowEditModal(true); }}
            className="p-2 glass-mobile rounded-lg text-yellow-400 hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          
          {tournament.status === 'upcoming' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteTournament(tournament.tournament_id)}
              className="p-2 glass-mobile rounded-lg text-red-400 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="bg-purple-500/20 rounded-lg p-3 mb-2">
            <Trophy className="h-6 w-6 text-purple-400 mx-auto" />
          </div>
          <p className="text-xs text-gray-400">Prize Pool</p>
          <p className="text-sm font-bold text-purple-400">₹{tournament.prize_pool?.toLocaleString() || 0}</p>
        </div>

        <div className="text-center">
          <div className="bg-green-500/20 rounded-lg p-3 mb-2">
            <DollarSign className="h-6 w-6 text-green-400 mx-auto" />
          </div>
          <p className="text-xs text-gray-400">Entry Fee</p>
          <p className="text-sm font-bold text-green-400">₹{tournament.entry_fee || 0}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Participants</span>
          <span className="text-white font-semibold">
            {tournament.current_participants}/{tournament.max_participants}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-neon-blue to-electric-purple h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (tournament.current_participants / tournament.max_participants) * 100)}%` 
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Revenue</span>
          <span className="text-green-400 font-semibold">₹{tournament.revenue?.toLocaleString() || 0}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Start Time</span>
          <span className="text-white font-semibold">
            {new Date(tournament.start_time).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const TournamentModal = ({ tournament, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-mobile rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-gaming">Tournament Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Tournament Name</label>
                  <p className="text-white font-bold text-xl">{tournament.name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Game Type</label>
                  <p className="text-white capitalize">{tournament.game_type}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Tournament Type</label>
                  <p className="text-white capitalize">{tournament.tournament_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-bold ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    <span className="capitalize">{tournament.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Start Time</label>
                  <p className="text-white">{new Date(tournament.start_time).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Registration Deadline</label>
                  <p className="text-white">{new Date(tournament.registration_deadline).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Created</label>
                  <p className="text-white">{new Date(tournament.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-mobile rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-400 font-bold text-lg">₹{tournament.prize_pool?.toLocaleString() || 0}</p>
                <p className="text-gray-400 text-sm">Prize Pool</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold text-lg">₹{tournament.entry_fee || 0}</p>
                <p className="text-gray-400 text-sm">Entry Fee</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">{tournament.current_participants}/{tournament.max_participants}</p>
                <p className="text-gray-400 text-sm">Participants</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-bold text-lg">₹{tournament.revenue?.toLocaleString() || 0}</p>
                <p className="text-gray-400 text-sm">Revenue</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  const EditTournamentModal = ({ tournament, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: tournament?.name || '',
      entry_fee: tournament?.entry_fee || 0,
      prize_pool: tournament?.prize_pool || 0,
      max_participants: tournament?.max_participants || 64,
      start_time: tournament?.start_time ? new Date(tournament.start_time).toISOString().slice(0, 16) : '',
      registration_deadline: tournament?.registration_deadline ? new Date(tournament.registration_deadline).toISOString().slice(0, 16) : '',
      status: tournament?.status || 'upcoming',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const updateData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
      };
      onUpdate(tournament.tournament_id, updateData);
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-mobile rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-gaming">Edit Tournament</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Tournament Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Entry Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.entry_fee}
                    onChange={(e) => setFormData({...formData, entry_fee: parseFloat(e.target.value) || 0})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Prize Pool (₹)</label>
                  <input
                    type="number"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({...formData, prize_pool: parseFloat(e.target.value) || 0})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value) || 64})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    min="2"
                    step="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                    className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 glass-mobile rounded-xl py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl py-3 text-white font-bold hover:shadow-glow transition-all"
                >
                  Update Tournament
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const totalPages = Math.ceil(totalTournaments / TOURNAMENTS_PER_PAGE);

  if (loading && tournaments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-4 font-gaming">Loading Tournaments...</h2>
          <p className="text-gray-400">Fetching tournament data</p>
        </motion.div>
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-8 w-8 text-neon-purple" />
            <h1 className="text-3xl lg:text-4xl font-black text-white font-gaming">Tournament Management</h1>
          </div>
          <p className="text-gray-400 lg:text-lg">
            Manage tournament events and competitions • {totalTournaments} total tournaments
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 glass-mobile rounded-xl text-neon-blue hover:text-white transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-electric-purple rounded-xl text-white font-bold"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Create Tournament</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tournaments by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-mobile rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-mobile rounded-xl pl-12 pr-8 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tournaments.map((tournament, index) => (
          <TournamentCard key={tournament.tournament_id} tournament={tournament} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {tournaments.length === 0 && !loading && (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Tournaments Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 glass-mobile rounded-xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage < 3 ? i : currentPage - 2 + i;
              if (pageNumber >= totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    currentPage === pageNumber
                      ? 'bg-gradient-to-r from-neon-blue to-electric-purple text-white'
                      : 'glass-mobile text-gray-400 hover:text-white'
                  }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 glass-mobile rounded-xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Tournament Detail Modal */}
      {showTournamentModal && selectedTournament && (
        <TournamentModal 
          tournament={selectedTournament} 
          onClose={() => { setShowTournamentModal(false); setSelectedTournament(null); }} 
        />
      )}

      {/* Edit Tournament Modal */}
      {showEditModal && editingTournament && (
        <EditTournamentModal 
          tournament={editingTournament} 
          onClose={() => { setShowEditModal(false); setEditingTournament(null); }}
          onUpdate={handleUpdateTournament}
        />
      )}

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <CreateTournamentModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={loadTournaments}
        />
      )}
    </motion.div>
  );
};

// Create Tournament Modal Component
const CreateTournamentModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    game_type: 'free_fire',
    tournament_type: 'battle_royale',
    entry_fee: 50,
    prize_pool: 1000,
    max_participants: 64,
    start_time: '',
    registration_deadline: '',
    mode: 'squad',
    country: 'India',
    description: ''
  });

  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const createData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
      };
      
      await apiService.createTournament(createData);
      safeToast.success('Tournament created successfully!');
      onCreate();
      onClose();
    } catch (error) {
      console.error('Failed to create tournament:', error);
      safeToast.error('Failed to create tournament');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-mobile rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-gaming">Create New Tournament</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Tournament Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  placeholder="Epic Battle Championship 2025"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Game Type</label>
                <select
                  value={formData.game_type}
                  onChange={(e) => setFormData({...formData, game_type: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="free_fire">Free Fire</option>
                  <option value="bgmi">BGMI</option>
                  <option value="pubg">PUBG Mobile</option>
                </select>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Tournament Type</label>
                <select
                  value={formData.tournament_type}
                  onChange={(e) => setFormData({...formData, tournament_type: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="battle_royale">Battle Royale</option>
                  <option value="clash_squad">Clash Squad</option>
                  <option value="single_elimination">Single Elimination</option>
                  <option value="league">League</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Game Mode</label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({...formData, mode: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="India">India</option>
                  <option value="Global">Global</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Entry Fee (₹)</label>
                <input
                  type="number"
                  value={formData.entry_fee}
                  onChange={(e) => setFormData({...formData, entry_fee: parseFloat(e.target.value) || 0})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for free tournaments</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Prize Pool (₹)</label>
                <input
                  type="number"
                  value={formData.prize_pool}
                  onChange={(e) => setFormData({...formData, prize_pool: parseFloat(e.target.value) || 0})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Max Participants</label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value) || 64})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  min="2"
                  step="1"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Registration Deadline</label>
                <input
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Tournament Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple h-24 resize-none"
                placeholder="Describe the tournament rules, format, and special features..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 glass-mobile rounded-xl py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 bg-gradient-to-r from-neon-purple to-electric-purple rounded-xl py-3 text-white font-bold hover:shadow-glow transition-all disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Tournament'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminTournaments;