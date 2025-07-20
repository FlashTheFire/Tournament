import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
  DollarSign,
  Calendar,
  Trophy,
  Mail,
  User,
  MoreHorizontal,
  RefreshCw,
  Download
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const USERS_PER_PAGE = 20;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery, filterType]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        skip: currentPage * USERS_PER_PAGE,
        limit: USERS_PER_PAGE,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (filterType === 'verified') {
        params.is_verified = true;
      } else if (filterType === 'unverified') {
        params.is_verified = false;
      } else if (filterType === 'admin') {
        params.is_admin = true;
      }

      const data = await apiService.getAdminUsers(
        currentPage * USERS_PER_PAGE,
        USERS_PER_PAGE,
        params
      );

      setUsers(data.users || []);
      setTotalUsers(data.total_count || 0);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    toast.success('Users data refreshed');
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      await apiService.updateUser(userId, updateData);
      toast.success('User updated successfully');
      await loadUsers();
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const UserCard = ({ user, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-mobile rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`rounded-xl p-3 ${user.is_admin ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'} shadow-glow`}>
            {user.is_admin ? <Shield className="h-6 w-6 text-white" /> : <User className="h-6 w-6 text-white" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{user.full_name}</h3>
            <p className="text-gray-400">@{user.username}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
            className="p-2 glass-mobile rounded-lg text-neon-blue hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingUser(user); setShowEditModal(true); }}
            className="p-2 glass-mobile rounded-lg text-yellow-400 hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          
          {!user.is_admin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteUser(user.user_id)}
              className="p-2 glass-mobile rounded-lg text-red-400 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className={`rounded-lg p-2 mb-2 ${user.is_verified ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {user.is_verified ? <CheckCircle className="h-4 w-4 text-green-400 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}
          </div>
          <p className="text-xs text-gray-400">Status</p>
          <p className={`text-sm font-bold ${user.is_verified ? 'text-green-400' : 'text-red-400'}`}>
            {user.is_verified ? 'Verified' : 'Unverified'}
          </p>
        </div>

        <div className="text-center">
          <div className="bg-purple-500/20 rounded-lg p-2 mb-2">
            <Trophy className="h-4 w-4 text-purple-400 mx-auto" />
          </div>
          <p className="text-xs text-gray-400">Tournaments</p>
          <p className="text-sm font-bold text-white">{user.tournaments_played || 0}</p>
        </div>

        <div className="text-center">
          <div className="bg-green-500/20 rounded-lg p-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-400 mx-auto" />
          </div>
          <p className="text-xs text-gray-400">Wallet</p>
          <p className="text-sm font-bold text-green-400">₹{user.wallet_balance?.toLocaleString() || 0}</p>
        </div>

        <div className="text-center">
          <div className="bg-blue-500/20 rounded-lg p-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-400 mx-auto" />
          </div>
          <p className="text-xs text-gray-400">Joined</p>
          <p className="text-sm font-bold text-white">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const UserModal = ({ user, onClose }) => (
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
            <h2 className="text-2xl font-bold text-white font-gaming">User Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Full Name</label>
                  <p className="text-white font-bold text-lg">{user.full_name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Username</label>
                  <p className="text-white">@{user.username}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-neon-blue">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Free Fire UID</label>
                  <p className="text-white">{user.free_fire_uid || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Account Status</label>
                  <div className="flex items-center space-x-2">
                    {user.is_verified ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                    <span className={user.is_verified ? 'text-green-400' : 'text-red-400'}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Role</label>
                  <div className="flex items-center space-x-2">
                    {user.is_admin ? <Shield className="h-4 w-4 text-red-400" /> : <User className="h-4 w-4 text-blue-400" />}
                    <span className={user.is_admin ? 'text-red-400' : 'text-blue-400'}>
                      {user.is_admin ? 'Administrator' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-mobile rounded-xl p-4 text-center">
                <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">{user.tournaments_played || 0}</p>
                <p className="text-gray-400 text-sm">Tournaments</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold text-lg">₹{user.wallet_balance?.toLocaleString() || 0}</p>
                <p className="text-gray-400 text-sm">Wallet Balance</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-bold text-lg">₹{user.total_earnings?.toLocaleString() || 0}</p>
                <p className="text-gray-400 text-sm">Total Earnings</p>
              </div>
              
              <div className="glass-mobile rounded-xl p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm">Joined</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      full_name: user?.full_name || '',
      username: user?.username || '',
      email: user?.email || '',
      wallet_balance: user?.wallet_balance || 0,
      is_verified: user?.is_verified || false,
      is_admin: user?.is_admin || false,
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(user.user_id, formData);
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
            className="glass-mobile rounded-3xl p-8 max-w-lg w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-gaming">Edit User</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Wallet Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.wallet_balance}
                  onChange={(e) => setFormData({...formData, wallet_balance: parseFloat(e.target.value) || 0})}
                  className="w-full glass-mobile rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
                    className="rounded bg-gray-700 border-gray-600 text-neon-blue focus:ring-neon-blue"
                  />
                  <span className="text-white text-sm">Verified</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                    className="rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-white text-sm">Admin</span>
                </label>
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
                  Update User
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-4 font-gaming">Loading Users...</h2>
          <p className="text-gray-400">Fetching user data</p>
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
            <Users className="h-8 w-8 text-neon-blue" />
            <h1 className="text-3xl lg:text-4xl font-black text-white font-gaming">User Management</h1>
          </div>
          <p className="text-gray-400 lg:text-lg">
            Manage user accounts and permissions • {totalUsers} total users
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
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
          >
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-mobile rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-mobile rounded-xl pl-12 pr-8 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue appearance-none cursor-pointer"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {users.map((user, index) => (
          <UserCard key={user.user_id} user={user} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Users Found</h3>
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserModal user={selectedUser} onClose={() => { setShowUserModal(false); setSelectedUser(null); }} />
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => { setShowEditModal(false); setEditingUser(null); }}
          onUpdate={handleUpdateUser}
        />
      )}
    </motion.div>
  );
};

export default AdminUsers;