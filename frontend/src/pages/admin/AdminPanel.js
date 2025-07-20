import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Star
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import safeToast from '../../utils/safeToast';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_users: 0,
    total_tournaments: 0,
    total_revenue: 0,
    active_tournaments: 0,
    pending_payments: 0,
    new_users_today: 0,
    tournaments_today: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTournaments, setRecentTournaments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load admin statistics
      const adminStats = await apiService.getAdminStats();
      setStats(adminStats);

      // Load recent data for overview
      const [usersData, tournamentsData, paymentsData] = await Promise.all([
        apiService.getAdminUsers(0, 5),
        apiService.getAdminTournaments(0, 5),
        apiService.getAdminPayments(0, 5)
      ]);

      setRecentUsers(usersData.users || []);
      setRecentTournaments(tournamentsData.tournaments || []);
      setRecentPayments(paymentsData.payments || []);

      safeToast.success('Admin data loaded successfully');
    } catch (error) {
      console.error('Failed to load admin data:', error);
      safeToast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  };

  // Stats Card Component
  const StatsCard = ({ icon: Icon, title, value, change, color, description }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative overflow-hidden glass-mobile rounded-2xl lg:rounded-3xl group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className={`rounded-2xl p-3 lg:p-4 ${color} shadow-glow`}>
            <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          {change && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
              change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <TrendingUp className="h-3 w-3" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-white font-gaming font-black text-2xl lg:text-4xl mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        
        <p className="text-neon-blue font-bold uppercase text-xs lg:text-sm tracking-wider mb-2">
          {title}
        </p>
        
        {description && (
          <p className="text-gray-400 text-xs lg:text-sm">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );

  // Quick Action Button Component
  const QuickActionButton = ({ icon: Icon, title, description, onClick, color, disabled = false }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden glass-mobile rounded-xl lg:rounded-2xl p-6 lg:p-8 text-left group transition-all duration-300 w-full ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/30'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`rounded-xl p-3 ${color} shadow-glow transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </motion.button>
  );

  // Recent Activity Item Component
  const ActivityItem = ({ icon: Icon, title, subtitle, time, status, type = 'default' }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-4 p-4 glass-mobile rounded-xl hover:bg-white/5 transition-all duration-300"
    >
      <div className={`rounded-lg p-2 ${
        type === 'user' ? 'bg-blue-500/20' :
        type === 'tournament' ? 'bg-purple-500/20' :
        type === 'payment' ? 'bg-green-500/20' : 'bg-gray-500/20'
      }`}>
        <Icon className={`h-5 w-5 ${
          type === 'user' ? 'text-blue-400' :
          type === 'tournament' ? 'text-purple-400' :
          type === 'payment' ? 'text-green-400' : 'text-gray-400'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{title}</p>
        <p className="text-gray-400 text-xs truncate">{subtitle}</p>
      </div>
      
      <div className="flex flex-col items-end space-y-1">
        <span className="text-gray-500 text-xs">{time}</span>
        {status && (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            status === 'active' || status === 'success' || status === 'verified' ? 'bg-green-500/20 text-green-400' :
            status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            status === 'failed' || status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {status}
          </span>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-4 font-gaming">Loading Admin Panel...</h2>
          <p className="text-gray-400">Fetching administrative data</p>
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
            <Shield className="h-8 w-8 text-neon-purple" />
            <h1 className="text-3xl lg:text-4xl font-black text-white font-gaming">Admin Control Center</h1>
          </div>
          <p className="text-gray-400 lg:text-lg">Manage tournaments, users, and platform analytics</p>
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
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl text-white font-bold"
          >
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline">Export Data</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <StatsCard
          icon={Users}
          title="Total Users"
          value={stats.total_users}
          change={stats.new_users_today > 0 ? ((stats.new_users_today / Math.max(stats.total_users - stats.new_users_today, 1)) * 100).toFixed(1) : 0}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
          description={`${stats.new_users_today} new today`}
        />
        
        <StatsCard
          icon={Trophy}
          title="Tournaments"
          value={stats.total_tournaments}
          change={stats.tournaments_today > 0 ? 5.2 : 0}
          color="bg-gradient-to-br from-purple-500 to-indigo-600"
          description={`${stats.active_tournaments} active`}
        />
        
        <StatsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₹${stats.total_revenue.toLocaleString()}`}
          change={8.3}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          description="This month"
        />
        
        <StatsCard
          icon={Activity}
          title="Active Now"
          value={stats.active_tournaments}
          color="bg-gradient-to-br from-red-500 to-pink-600"
          description={`${stats.pending_payments} pending payments`}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white font-gaming">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <QuickActionButton
            icon={Plus}
            title="Create Tournament"
            description="Set up a new tournament event"
            onClick={() => setActiveTab('tournaments')}
            color="bg-gradient-to-r from-purple-500 to-indigo-600"
          />
          
          <QuickActionButton
            icon={Users}
            title="Manage Users"
            description="View and manage user accounts"
            onClick={() => setActiveTab('users')}
            color="bg-gradient-to-r from-blue-500 to-cyan-600"
          />
          
          <QuickActionButton
            icon={BarChart3}
            title="View Analytics"
            description="Detailed platform insights"
            onClick={() => setActiveTab('analytics')}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
          />
          
          <QuickActionButton
            icon={DollarSign}
            title="Payment Management"
            description="Track transactions and payments"
            onClick={() => setActiveTab('payments')}
            color="bg-gradient-to-r from-yellow-500 to-orange-600"
          />
          
          <QuickActionButton
            icon={Settings}
            title="Platform Settings"
            description="Configure system settings"
            onClick={() => safeToast.info('Coming soon!')}
            color="bg-gradient-to-r from-gray-500 to-slate-600"
            disabled={true}
          />
          
          <QuickActionButton
            icon={Shield}
            title="Security Center"
            description="Monitor security & fraud"
            onClick={() => toast.info('Coming soon!')}
            color="bg-gradient-to-r from-red-500 to-rose-600"
            disabled={true}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Users */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Users</h3>
            <button 
              onClick={() => setActiveTab('users')}
              className="text-neon-blue hover:text-white text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentUsers.slice(0, 5).map((user, index) => (
              <ActivityItem
                key={user.user_id}
                icon={Users}
                title={user.full_name}
                subtitle={`@${user.username} • ₹${user.wallet_balance}`}
                time={new Date(user.created_at).toLocaleDateString()}
                status={user.is_verified ? 'verified' : 'pending'}
                type="user"
              />
            ))}
            {recentUsers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent users</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Tournaments</h3>
            <button 
              onClick={() => setActiveTab('tournaments')}
              className="text-neon-blue hover:text-white text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentTournaments.slice(0, 5).map((tournament, index) => (
              <ActivityItem
                key={tournament.tournament_id}
                icon={Trophy}
                title={tournament.name}
                subtitle={`₹${tournament.entry_fee} entry • ${tournament.current_participants}/${tournament.max_participants} players`}
                time={new Date(tournament.start_time).toLocaleDateString()}
                status={tournament.status}
                type="tournament"
              />
            ))}
            {recentTournaments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent tournaments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Payments</h3>
            <button 
              onClick={() => setActiveTab('payments')}
              className="text-neon-blue hover:text-white text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentPayments.slice(0, 5).map((payment, index) => (
              <ActivityItem
                key={payment.order_id}
                icon={DollarSign}
                title={`₹${payment.amount}`}
                subtitle={`${payment.username} • ${payment.tournament_name}`}
                time={new Date(payment.created_at).toLocaleDateString()}
                status={payment.status}
                type="payment"
              />
            ))}
            {recentPayments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-xl p-4 text-center"
        >
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-white font-bold">Database</p>
          <p className="text-green-400 text-sm">Healthy</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-xl p-4 text-center"
        >
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-white font-bold">API Services</p>
          <p className="text-green-400 text-sm">Online</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-xl p-4 text-center"
        >
          <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold">Payments</p>
          <p className="text-yellow-400 text-sm">{stats.pending_payments} Pending</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-xl p-4 text-center"
        >
          <Activity className="h-8 w-8 text-neon-blue mx-auto mb-2" />
          <p className="text-white font-bold">Server Load</p>
          <p className="text-neon-blue text-sm">Normal</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;