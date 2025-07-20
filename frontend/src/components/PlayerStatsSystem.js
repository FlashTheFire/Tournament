import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Crosshair, 
  Shield, 
  Zap, 
  Crown, 
  Star, 
  TrendingUp, 
  Award,
  Flame,
  Clock,
  Users,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const PlayerStatsSystem = ({ playerId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('all');

  // Mock player data
  const playerData = {
    id: playerId || 'current_user',
    username: 'FireStorm_99',
    avatar: '🔥',
    rank: {
      current: 'Heroic',
      tier: 'III',
      points: 2847,
      nextRankPoints: 3000,
      icon: '👑'
    },
    stats: {
      overview: {
        totalMatches: 247,
        victories: 89,
        winRate: 36.0,
        totalKills: 1247,
        avgKills: 5.05,
        totalDamage: 186420,
        avgDamage: 754.7,
        totalEarnings: 47250,
        currentStreak: 5,
        bestStreak: 12,
        hoursPlayed: 124.5
      },
      recent: {
        last7Days: {
          matches: 23,
          wins: 9,
          kills: 127,
          damage: 18640,
          earnings: 4200
        },
        last30Days: {
          matches: 89,
          wins: 34,
          kills: 456,
          damage: 67820,
          earnings: 15800
        }
      },
      weapons: [
        { name: 'AK47', kills: 342, accuracy: 76, headshots: 89, icon: '🔫' },
        { name: 'AWM', kills: 156, accuracy: 82, headshots: 134, icon: '🎯' },
        { name: 'MP40', kills: 298, accuracy: 71, headshots: 67, icon: '🔥' },
        { name: 'M4A1', kills: 234, accuracy: 74, headshots: 78, icon: '⚡' },
        { name: 'Grenades', kills: 89, accuracy: 65, headshots: 0, icon: '💣' }
      ],
      achievements: [
        { 
          id: 'first_win',
          name: 'First Victory',
          description: 'Win your first Free Fire battle',
          icon: '🏆',
          earned: true,
          rarity: 'common',
          earnedDate: '2024-12-15'
        },
        {
          id: 'headshot_master',
          name: 'Headshot Master',
          description: 'Get 100 headshot kills',
          icon: '🎯',
          earned: true,
          rarity: 'rare',
          earnedDate: '2024-12-28'
        },
        {
          id: 'win_streak_10',
          name: 'Unstoppable',
          description: 'Win 10 matches in a row',
          icon: '🔥',
          earned: true,
          rarity: 'epic',
          earnedDate: '2025-01-10'
        },
        {
          id: 'damage_dealer',
          name: 'Damage Dealer',
          description: 'Deal 100,000 total damage',
          icon: '💥',
          earned: true,
          rarity: 'legendary',
          earnedDate: '2025-01-18'
        },
        {
          id: 'survivor',
          name: 'Lone Survivor',
          description: 'Survive 50 matches without teammates',
          icon: '💀',
          earned: false,
          rarity: 'mythic',
          progress: 34
        }
      ]
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      'Bronze': 'from-orange-600 to-orange-700',
      'Silver': 'from-gray-400 to-gray-500', 
      'Gold': 'from-yellow-400 to-yellow-500',
      'Platinum': 'from-cyan-400 to-cyan-500',
      'Diamond': 'from-blue-400 to-blue-500',
      'Heroic': 'from-purple-400 to-purple-600',
      'Grandmaster': 'from-red-400 to-pink-500'
    };
    return colors[rank] || 'from-gray-400 to-gray-500';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'common': 'from-gray-400 to-gray-500',
      'rare': 'from-blue-400 to-blue-500',
      'epic': 'from-purple-400 to-purple-600',
      'legendary': 'from-yellow-400 to-orange-500',
      'mythic': 'from-red-400 to-pink-500'
    };
    return colors[rarity] || 'from-gray-400 to-gray-500';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 border border-white/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        
        <div className="relative z-10 flex items-center space-x-6">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <div className={`h-24 w-24 rounded-3xl bg-gradient-to-r ${getRankColor(playerData.rank.current)} flex items-center justify-center text-4xl relative`}>
              {playerData.avatar}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{playerData.rank.tier}</span>
              </div>
            </div>
          </motion.div>

          {/* Player Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white font-gaming">{playerData.username}</h1>
              <span className="text-2xl">{playerData.rank.icon}</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRankColor(playerData.rank.current)} text-white font-bold text-sm`}>
                {playerData.rank.current} {playerData.rank.tier}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-white font-semibold">{playerData.rank.points} RP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-gold-400" />
                <span className="text-gold-400 font-semibold">{playerData.stats.overview.victories} Wins</span>
              </div>
            </div>

            {/* Rank Progress */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Rank Progress</span>
                <span className="text-white font-semibold">
                  {playerData.rank.points} / {playerData.rank.nextRankPoints}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(playerData.rank.points / playerData.rank.nextRankPoints) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${getRankColor(playerData.rank.current)}`}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-green">{playerData.stats.overview.winRate}%</p>
              <p className="text-gray-400 text-xs">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-blue">{playerData.stats.overview.avgKills}</p>
              <p className="text-gray-400 text-xs">Avg Kills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-purple">{formatNumber(playerData.stats.overview.totalDamage)}</p>
              <p className="text-gray-400 text-xs">Total Damage</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-red">{playerData.stats.overview.currentStreak}</p>
              <p className="text-gray-400 text-xs">Win Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 glass rounded-2xl p-2 border border-white/10"
      >
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'weapons', label: 'Weapons', icon: Crosshair },
          { id: 'achievements', label: 'Achievements', icon: Award }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-purple to-electric-purple text-white shadow-glow'
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
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Total Matches',
                value: playerData.stats.overview.totalMatches,
                icon: Users,
                color: 'from-neon-blue to-electric-blue',
                change: '+12'
              },
              {
                title: 'Total Kills',
                value: playerData.stats.overview.totalKills,
                icon: Crosshair,
                color: 'from-red-500 to-pink-500',
                change: '+34'
              },
              {
                title: 'Avg Damage',
                value: Math.round(playerData.stats.overview.avgDamage),
                icon: Flame,
                color: 'from-orange-500 to-red-500',
                change: '+15'
              },
              {
                title: 'Total Earnings',
                value: `₹${formatNumber(playerData.stats.overview.totalEarnings)}`,
                icon: Trophy,
                color: 'from-yellow-400 to-orange-500',
                change: '+₹2.3K'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center space-x-1 text-neon-green text-sm">
                      <ArrowUp className="h-3 w-3" />
                      <span className="font-semibold">{stat.change}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weapons Tab */}
      {activeTab === 'weapons' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 font-gaming">Weapon Statistics</h3>
            
            <div className="space-y-4">
              {playerData.stats.weapons.map((weapon, index) => (
                <motion.div
                  key={weapon.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{weapon.icon}</div>
                      <div>
                        <p className="text-white font-semibold">{weapon.name}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Crosshair className="h-3 w-3 text-red-400" />
                            <span className="text-red-400">{weapon.kills} kills</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3 text-blue-400" />
                            <span className="text-blue-400">{weapon.accuracy}% accuracy</span>
                          </div>
                          {weapon.headshots > 0 && (
                            <div className="flex items-center space-x-1">
                              <Crown className="h-3 w-3 text-yellow-400" />
                              <span className="text-yellow-400">{weapon.headshots} headshots</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{weapon.kills}</p>
                      <p className="text-gray-400 text-sm">Total Kills</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 font-gaming">Battle Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playerData.stats.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`glass rounded-xl p-4 border transition-all duration-300 ${
                    achievement.earned 
                      ? `border-${getRarityColor(achievement.rarity).split('-')[1]}-400/30` 
                      : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center text-2xl ${
                      !achievement.earned && 'grayscale opacity-50'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-bold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                          {achievement.rarity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div className="flex items-center space-x-1 text-neon-green text-sm">
                          <Award className="h-3 w-3" />
                          <span>Earned {achievement.earnedDate}</span>
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{achievement.progress}/50</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                              style={{ width: `${(achievement.progress / 50) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Not yet earned</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlayerStatsSystem;