import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Target, 
  Crown, 
  Zap, 
  Star,
  Flame,
  Shield,
  Gamepad2,
  Eye,
  TrendingUp,
  Award,
  Clock,
  Play
} from 'lucide-react';
import LiveTournamentBracket from '../components/LiveTournamentBracket';
import PlayerStatsSystem from '../components/PlayerStatsSystem';

const AdvancedGaming = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const gamingFeatures = [
    {
      id: 'live-tournaments',
      title: 'Live Tournament Brackets',
      description: 'Real-time tournament brackets with live match tracking, player stats, and spectator mode',
      icon: Trophy,
      color: 'from-red-500 to-pink-500',
      status: 'live',
      participants: 1247
    },
    {
      id: 'player-stats',
      title: 'Advanced Player Analytics',
      description: 'Comprehensive statistics, weapon analysis, achievements, and rank progression tracking',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      status: 'active',
      participants: 8956
    },
    {
      id: 'ai-matchmaking',
      title: 'AI-Powered Matchmaking',
      description: 'Smart player matching based on skill level, play style, and performance metrics',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      status: 'beta',
      accuracy: '94%'
    },
    {
      id: 'team-system',
      title: 'Team Formation Hub',
      description: 'Create and manage teams, recruit players, and participate in squad tournaments',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      status: 'active',
      teams: 456
    },
    {
      id: 'spectator-mode',
      title: 'Live Spectator Mode',
      description: 'Watch live matches with multiple camera angles, real-time stats, and commentary',
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      status: 'live',
      viewers: 3241
    },
    {
      id: 'achievement-system',
      title: 'Achievement & Rewards',
      description: 'Unlock achievements, earn rewards, and showcase your gaming prowess',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      status: 'active',
      achievements: 150
    }
  ];

  const liveStats = {
    totalPlayers: 12847,
    activeTournaments: 23,
    liveMatches: 67,
    prizePools: '₹2,45,000',
    winRateImprovement: '23%',
    avgSkillIncrease: '+156'
  };

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
        transition={{ delay: 0.1 }}
      >
        <h1 className="font-bold text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red font-gaming mb-4
          /* Mobile: compact title */
          text-2xl
          /* Tablet: medium title */  
          sm:text-3xl
          /* Desktop: large title */
          lg:text-5xl
        ">
          ADVANCED GAMING ARENA
        </h1>
        <p className="text-gray-300 mb-2
          /* Mobile: smaller text */
          text-sm
          /* Tablet: medium text */
          sm:text-base
          /* Desktop: larger text */
          lg:text-xl
        ">
          Premium Free Fire gaming platform with cutting-edge features
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">{liveStats.totalPlayers.toLocaleString()} Active Players</span>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="h-4 w-4 text-red-400" />
            <span className="text-red-400 font-semibold">{liveStats.liveMatches} Live Matches</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{liveStats.prizePools} Prize Pool</span>
          </div>
        </div>
      </motion.div>

      {/* Live Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { 
            title: 'Total Players', 
            value: liveStats.totalPlayers.toLocaleString(), 
            icon: Users, 
            color: 'from-neon-blue to-electric-blue',
            change: '+12%'
          },
          { 
            title: 'Active Tournaments', 
            value: liveStats.activeTournaments, 
            icon: Trophy, 
            color: 'from-neon-purple to-electric-purple',
            change: '+5'
          },
          { 
            title: 'Live Matches', 
            value: liveStats.liveMatches, 
            icon: Play, 
            color: 'from-red-500 to-pink-500',
            change: '+23'
          },
          { 
            title: 'Skill Improvement', 
            value: liveStats.avgSkillIncrease, 
            icon: TrendingUp, 
            color: 'from-green-500 to-emerald-500',
            change: '23% better'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
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
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 glass rounded-2xl p-2 border border-white/10"
      >
        {[
          { id: 'overview', label: 'Features Overview', icon: Gamepad2 },
          { id: 'tournaments', label: 'Live Tournaments', icon: Trophy },
          { id: 'stats', label: 'Player Stats', icon: TrendingUp }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeSection === tab.id
                ? 'bg-gradient-to-r from-neon-blue to-electric-purple text-white shadow-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Features Overview */}
      {activeSection === 'overview' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamingFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  if (feature.id === 'live-tournaments') setActiveSection('tournaments');
                  if (feature.id === 'player-stats') setActiveSection('stats');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.status === 'live' ? 'bg-red-500 animate-pulse' :
                      feature.status === 'beta' ? 'bg-yellow-400' :
                      'bg-green-500'
                    }`}></div>
                    <span className={`text-xs font-bold uppercase ${
                      feature.status === 'live' ? 'text-red-400' :
                      feature.status === 'beta' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 font-gaming group-hover:text-neon-blue transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {feature.participants && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-neon-blue" />
                        <span className="text-neon-blue font-semibold">{feature.participants.toLocaleString()}</span>
                      </div>
                    )}
                    {feature.accuracy && (
                      <div className="flex items-center space-x-1">
                        <Target className="h-3 w-3 text-green-400" />
                        <span className="text-green-400 font-semibold">{feature.accuracy} accurate</span>
                      </div>
                    )}
                    {feature.teams && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-purple-400" />
                        <span className="text-purple-400 font-semibold">{feature.teams} teams</span>
                      </div>
                    )}
                    {feature.viewers && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3 text-orange-400" />
                        <span className="text-orange-400 font-semibold">{feature.viewers.toLocaleString()}</span>
                      </div>
                    )}
                    {feature.achievements && (
                      <div className="flex items-center space-x-1">
                        <Award className="h-3 w-3 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{feature.achievements}</span>
                      </div>
                    )}
                  </div>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-neon-blue opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-3xl p-8 border border-neon-blue/30 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-gaming mb-4">🤖 AI-POWERED FEATURES</h2>
              <p className="text-gray-300 text-lg">Next-generation artificial intelligence enhancing your gaming experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Smart Matchmaking',
                  description: 'AI analyzes your play style, skill level, and preferences to match you with perfectly balanced opponents',
                  accuracy: '94%',
                  icon: '🎯',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Tournament Predictions',
                  description: 'Advanced algorithms predict match outcomes based on player statistics and historical performance',
                  accuracy: '87%',
                  icon: '🔮',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  title: 'Player Analytics',
                  description: 'Deep learning models provide personalized insights and recommendations to improve your gameplay',
                  accuracy: '91%',
                  icon: '📊',
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((aiFeature, index) => (
                <motion.div
                  key={aiFeature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${aiFeature.color} flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-3xl">{aiFeature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-gaming mb-2">{aiFeature.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 text-center leading-relaxed">
                    {aiFeature.description}
                  </p>
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${aiFeature.color}`}>
                      <Zap className="h-4 w-4 text-white" />
                      <span className="text-white font-bold text-sm">{aiFeature.accuracy} Accurate</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Live Tournaments Section */}
      {activeSection === 'tournaments' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LiveTournamentBracket tournamentId="FFT2025_BR_001" />
        </motion.div>
      )}

      {/* Player Stats Section */}
      {activeSection === 'stats' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PlayerStatsSystem playerId="current_user" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedGaming;