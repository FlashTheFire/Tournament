import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Crown, 
  Zap, 
  Star,
  Flame,
  Shield,
  Gamepad2,
  Eye,
  Award,
  Clock,
  Play,
  Target,
  Crosshair,
  Activity,
  Timer,
  Settings,
  BarChart3,
  Calendar,
  Wallet,
  Medal,
  Swords,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { formatNumber, formatCurrency, formatPrizePool, formatPercentage } from '../utils/numberFormatter';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // Fallback to mock data only if API fails
      const mockData = {
        stats: {
          tournamentsJoined: 12,
          totalWinnings: 15600,
          currentRank: 42,
          winRate: 73.2,
          killsTotal: 1847,
          averageRank: 12.5,
          hoursPlayed: 156
        },
        recentTournaments: [
          {
            id: 'ff-championship',
            name: 'Free Fire Championship 2025',
            status: 'live',
            prize: 50000,
            participants: '89/100',
            date: new Date().toISOString(),
            registered: true
          }
        ],
        achievements: [
          { id: 1, name: 'Tournament Warrior', description: 'Join your first tournament', earned: true, rarity: 'common' },
          { id: 2, name: 'Elite Player', description: 'Reach top 50 in leaderboards', earned: true, rarity: 'rare' },
          { id: 3, name: 'Prize Winner', description: 'Win tournament earnings', earned: false, rarity: 'epic' }
        ],
        weeklyProgress: [
          { day: 'Mon', matches: 3, wins: 2 },
          { day: 'Tue', matches: 5, wins: 4 },
          { day: 'Wed', matches: 4, wins: 3 },
          { day: 'Thu', matches: 6, wins: 5 },
          { day: 'Fri', matches: 4, wins: 3 },
          { day: 'Sat', matches: 8, wins: 6 },
          { day: 'Sun', matches: 5, wins: 4 }
        ]
      };
      setDashboardData(mockData);
    } finally {
      setLoading(false);
    }
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
          <p className="text-white text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white font-gaming mb-2">
            <span className="text-gradient bg-gradient-to-r from-neon-blue to-electric-purple">
              WARRIOR DASHBOARD
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Welcome back, {user?.username || 'Elite Warrior'}! 🎮</p>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass rounded-xl px-4 py-2 border border-neon-blue/30"
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">Online</span>
            </div>
          </motion.div>
          
          <Link to="/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass p-3 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors"
            >
              <Settings className="h-5 w-5 text-white" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 glass rounded-2xl p-2 border border-white/10"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-blue to-electric-purple text-white shadow-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Tournaments Joined',
                value: dashboardData.stats.tournamentsJoined,
                icon: Trophy,
                color: 'from-yellow-500 to-orange-600',
                change: '+3 this week'
              },
              {
                title: 'Total Winnings',
                value: formatPrizePool(dashboardData.stats.totalWinnings),
                icon: DollarSign,
                color: 'from-green-500 to-emerald-600',
                change: '+₹5,000 this week'
              },
              {
                title: 'Current Rank',
                value: `#${formatNumber(dashboardData.stats.currentRank)}`,
                icon: Crown,
                color: 'from-purple-500 to-indigo-600',
                change: '↑5 positions'
              },
              {
                title: 'Win Rate',
                value: formatPercentage(dashboardData.stats.winRate),
                icon: Target,
                color: 'from-red-500 to-pink-600',
                change: '+5% this month'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <p className="text-green-400 text-xs font-semibold mt-2">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tournaments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white font-gaming flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-neon-blue" />
                  <span>Recent Tournaments</span>
                </h3>
                <Link to="/tournaments" className="text-neon-blue hover:text-electric-blue transition-colors text-sm font-semibold">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.recentTournaments.slice(0, 3).map((tournament, index) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{tournament.name}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            tournament.status === 'live' ? 'bg-red-500/20 text-red-400' :
                            tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {tournament.status.toUpperCase()}
                          </span>
                          <span className="text-gray-400">{tournament.participants}</span>
                          <span className="text-yellow-400">{formatPrizePool(tournament.prize)}</span>
                        </div>
                      </div>
                      
                      {tournament.result && (
                        <div className="text-right">
                          <p className="text-white font-bold">#{tournament.result.place}</p>
                          <p className="text-green-400 text-sm">+{formatPrizePool(tournament.result.prize)}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white font-gaming flex items-center space-x-2 mb-6">
                <Zap className="h-6 w-6 text-electric-purple" />
                <span>Quick Actions</span>
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: 'Join Tournament',
                    description: 'Find and join active battles',
                    icon: Trophy,
                    color: 'from-yellow-500 to-orange-600',
                    link: '/tournaments'
                  },
                  {
                    label: 'View Wallet',
                    description: 'Manage your earnings & payments',
                    icon: Wallet,
                    color: 'from-green-500 to-emerald-600',
                    link: '/wallet'
                  },
                  {
                    label: 'Leaderboards',
                    description: 'Check your ranking position',
                    icon: Medal,
                    color: 'from-purple-500 to-indigo-600',
                    link: '/leaderboards'
                  },
                  {
                    label: 'Advanced Gaming',
                    description: 'Access premium features',
                    icon: Gamepad2,
                    color: 'from-neon-blue to-electric-purple',
                    link: '/advanced-gaming'
                  }
                ].map((action, index) => (
                  <Link key={action.label} to={action.link}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold group-hover:text-neon-blue transition-colors">{action.label}</h4>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white font-gaming mb-6">Tournament History</h3>
          <div className="space-y-4">
            {dashboardData.recentTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">{tournament.name}</h4>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-gray-400">
                        {new Date(tournament.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400">{tournament.participants} participants</span>
                      <span className="text-yellow-400">{formatPrizePool(tournament.prize)} prize pool</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      tournament.status === 'live' ? 'bg-red-500/20 text-red-400' :
                      tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                    {tournament.result && (
                      <div className="mt-2">
                        <p className="text-white font-bold">#{tournament.result.place} Place</p>
                        <p className="text-green-400">+₹{tournament.result.prize}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white font-gaming mb-6">Achievements & Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  achievement.earned 
                    ? 'bg-gradient-to-r from-white/10 to-white/5 border-neon-blue/30 hover:border-neon-blue/50' 
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' :
                    achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                    'bg-gradient-to-r from-gray-400 to-gray-600'
                  } ${achievement.earned ? 'shadow-glow' : 'grayscale'}`}>
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-white font-bold mb-2">{achievement.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    achievement.rarity === 'legendary' ? 'bg-yellow-400/20 text-yellow-400' :
                    achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                    achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {achievement.rarity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Performance Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white font-gaming mb-6">Weekly Performance</h3>
            <div className="grid grid-cols-7 gap-4">
              {dashboardData.weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/5 rounded-xl p-4 mb-2">
                    <div className="h-20 flex items-end justify-center">
                      <div 
                        className="bg-gradient-to-t from-neon-blue to-electric-purple rounded-t w-8 transition-all duration-500"
                        style={{ height: `${(day.wins / Math.max(...dashboardData.weeklyProgress.map(d => d.wins))) * 80}px` }}
                      ></div>
                    </div>
                    <p className="text-white font-bold text-xl mt-2">{day.wins}</p>
                    <p className="text-gray-400 text-sm">wins</p>
                  </div>
                  <p className="text-gray-300 font-semibold">{day.day}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Advanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Total Eliminations',
                value: dashboardData.stats.killsTotal,
                icon: Crosshair,
                color: 'from-red-500 to-pink-600'
              },
              {
                title: 'Average Rank',
                value: `#${dashboardData.stats.averageRank}`,
                icon: Medal,
                color: 'from-purple-500 to-indigo-600'
              },
              {
                title: 'Hours Played',
                value: `${dashboardData.stats.hoursPlayed}h`,
                icon: Clock,
                color: 'from-orange-500 to-red-600'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;