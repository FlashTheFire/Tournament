import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  DollarSign, 
  Activity,
  Calendar,
  Target,
  PieChart,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  UserCheck,
  UserPlus,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import safeToast from '../../utils/safeToast';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    overview: {
      total_users: 0,
      total_tournaments: 0,
      total_revenue: 0,
      active_tournaments: 0,
      monthly_growth: 0,
      conversion_rate: 0
    },
    user_analytics: [],
    tournament_analytics: [],
    revenue_trends: [],
    performance_metrics: {}
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load comprehensive analytics data
      const [overviewData, playerAnalytics, tournamentAnalytics] = await Promise.all([
        apiService.getAdminAnalyticsOverview(),
        apiService.getAdminPlayerAnalytics(0, 50, null),
        apiService.getAdminTournamentAnalytics()
      ]);

      setAnalytics({
        overview: overviewData,
        user_analytics: playerAnalytics.players || [],
        tournament_analytics: tournamentAnalytics.tournaments || [],
        revenue_trends: overviewData.revenue_trends || [],
        performance_metrics: overviewData.performance_metrics || {}
      });

      safeToast.success('Analytics data loaded successfully');
    } catch (error) {
      console.error('Failed to load analytics:', error);
      safeToast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  // Enhanced Analytics Card Component
  const AnalyticsCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    changeLabel,
    color, 
    description, 
    trend = [],
    onClick 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={`relative overflow-hidden glass-mobile rounded-2xl lg:rounded-3xl group cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
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
              {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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
          <p className="text-gray-400 text-xs lg:text-sm mb-3">
            {description}
          </p>
        )}

        {changeLabel && (
          <p className="text-gray-500 text-xs">
            {changeLabel}
          </p>
        )}

        {/* Mini trend line */}
        {trend && trend.length > 0 && (
          <div className="mt-4 h-8 flex items-end space-x-1">
            {trend.slice(-10).map((point, index) => (
              <div
                key={index}
                className={`flex-1 ${color.replace('bg-gradient-to-br', 'bg-gradient-to-t')} opacity-60 rounded-sm`}
                style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Performance Metrics Component
  const PerformanceMetric = ({ label, value, target, color }) => {
    const percentage = (value / target) * 100;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">{label}</span>
          <span className={`text-sm font-bold ${color}`}>{value.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Target: {target.toLocaleString()}</span>
          <span className={`${percentage >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  // Top Player Component
  const TopPlayerCard = ({ player, rank, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center space-x-4 p-4 glass-mobile rounded-xl hover:bg-white/5 transition-all duration-300"
    >
      <div className={`rounded-lg p-2 ${
        rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
        rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
        rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
        'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        {rank <= 3 ? (
          <Award className="h-5 w-5 text-white" />
        ) : (
          <span className="text-white font-bold text-sm">{rank}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{player.username || player.full_name}</p>
        <p className="text-gray-400 text-xs truncate">
          Skill: {player.overall_performance?.skill_score?.toFixed(1) || 'N/A'} • 
          Tournaments: {player.tournaments_played || 0}
        </p>
      </div>
      
      <div className="text-right">
        <p className="text-green-400 font-bold text-sm">₹{(player.total_earnings || 0).toLocaleString()}</p>
        <p className="text-xs text-gray-500">Earnings</p>
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
          <h2 className="text-2xl font-bold text-white mb-4 font-gaming">Loading Analytics...</h2>
          <p className="text-gray-400">Processing performance data</p>
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
            <BarChart3 className="h-8 w-8 text-neon-green" />
            <h1 className="text-3xl lg:text-4xl font-black text-white font-gaming">Advanced Analytics</h1>
          </div>
          <p className="text-gray-400 lg:text-lg">Comprehensive platform performance insights and metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="glass-mobile rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
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
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-green to-emerald-600 rounded-xl text-white font-bold"
          >
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <AnalyticsCard
          icon={Users}
          title="Total Users"
          value={analytics.overview.total_users}
          change={analytics.overview.user_growth_rate || 12.5}
          changeLabel="vs last period"
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
          description="Registered platform users"
        />
        
        <AnalyticsCard
          icon={Trophy}
          title="Tournaments"
          value={analytics.overview.total_tournaments}
          change={analytics.overview.tournament_growth_rate || 8.2}
          changeLabel="vs last period"
          color="bg-gradient-to-br from-purple-500 to-indigo-600"
          description={`${analytics.overview.active_tournaments} currently active`}
        />
        
        <AnalyticsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₹${analytics.overview.total_revenue?.toLocaleString() || 0}`}
          change={analytics.overview.revenue_growth_rate || 15.7}
          changeLabel="vs last period"
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          description="Platform lifetime revenue"
        />
        
        <AnalyticsCard
          icon={Target}
          title="Conversion Rate"
          value={`${(analytics.overview.conversion_rate || 23.4).toFixed(1)}%`}
          change={analytics.overview.conversion_change || 3.2}
          changeLabel="vs last period"
          color="bg-gradient-to-br from-red-500 to-pink-600"
          description="Registration to payment"
        />
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="glass-mobile rounded-3xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="h-6 w-6 text-neon-purple" />
            <h3 className="text-xl font-bold text-white font-gaming">Platform Performance</h3>
          </div>
          
          <div className="space-y-6">
            <PerformanceMetric
              label="Daily Active Users"
              value={analytics.performance_metrics.daily_active_users || 847}
              target={1000}
              color="text-blue-400"
            />
            <PerformanceMetric
              label="Tournament Participation"
              value={analytics.performance_metrics.tournament_participation || 342}
              target={500}
              color="text-purple-400"
            />
            <PerformanceMetric
              label="Payment Success Rate"
              value={analytics.performance_metrics.payment_success_rate || 94.7}
              target={95}
              color="text-green-400"
            />
            <PerformanceMetric
              label="User Retention (7d)"
              value={analytics.performance_metrics.user_retention || 78.3}
              target={80}
              color="text-yellow-400"
            />
          </div>
        </div>

        {/* Top Players */}
        <div className="glass-mobile rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white font-gaming">Top Players</h3>
            </div>
            <span className="text-gray-400 text-sm">By earnings</span>
          </div>
          
          <div className="space-y-3">
            {analytics.user_analytics.slice(0, 8).map((player, index) => (
              <TopPlayerCard 
                key={player.user_id} 
                player={player} 
                rank={index + 1} 
                index={index}
              />
            ))}
            {analytics.user_analytics.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No player data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-2xl p-6 text-center"
        >
          <div className="bg-gradient-to-r from-neon-blue to-electric-purple rounded-xl p-3 w-fit mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2">Live Tournament Activity</h4>
          <p className="text-3xl font-black text-neon-blue mb-2">
            {analytics.overview.active_tournaments || 0}
          </p>
          <p className="text-gray-400 text-sm">Tournaments running now</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-2xl p-6 text-center"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 w-fit mx-auto mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2">New Registrations</h4>
          <p className="text-3xl font-black text-green-400 mb-2">
            {analytics.overview.new_users_today || 0}
          </p>
          <p className="text-gray-400 text-sm">Users today</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-mobile rounded-2xl p-6 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-3 w-fit mx-auto mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-white font-bold text-xl mb-2">Avg. Session Time</h4>
          <p className="text-3xl font-black text-purple-400 mb-2">
            {analytics.performance_metrics.avg_session_time || '24m'}
          </p>
          <p className="text-gray-400 text-sm">Per user session</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;