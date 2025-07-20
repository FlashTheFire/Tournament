import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Star, Medal, Flame, Target, Zap, Users, Award, Shield, Crosshair, Swords } from 'lucide-react';
import { apiService } from '../services/api';

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('overall');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await apiService.getLeaderboards();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'overall', label: 'Overall Champions', icon: Crown, color: 'from-yellow-400 to-orange-500' },
    { id: 'battle_royale', label: 'Battle Royale', icon: Crosshair, color: 'from-red-500 to-pink-600' },
    { id: 'clash_squad', label: 'Clash Squad', icon: Swords, color: 'from-blue-500 to-cyan-600' },
    { id: 'weekly', label: 'Weekly Top', icon: Flame, color: 'from-purple-500 to-indigo-600' }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-8 w-8 text-yellow-500 animate-pulse" />;
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-400 animate-bounce" />;
    if (rank === 3) return <Medal className="h-8 w-8 text-orange-600 animate-pulse" />;
    return <Star className="h-6 w-6 text-gray-500" />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-glow animate-pulse">
        <Crown className="h-4 w-4 text-white" />
      </div>
    );
    if (rank === 2) return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full p-2 shadow-lg">
        <Shield className="h-4 w-4 text-white" />
      </div>
    );
    if (rank === 3) return (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-600 to-red-500 rounded-full p-2 shadow-lg">
        <Award className="h-4 w-4 text-white" />
      </div>
    );
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-6"
      >
        <div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-8 py-4 mb-6"
          >
            <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
            <span className="text-yellow-300 font-bold uppercase tracking-wide text-lg">Hall of Fame</span>
            <Trophy className="h-8 w-8 text-yellow-400 animate-bounce" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gradient bg-gradient-to-r from-neon-blue via-electric-purple to-neon-red font-gaming mb-4">
            ELITE WARRIORS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The ultimate Free Fire champions who dominate the battlefield with skill, strategy, and pure warrior spirit
          </p>
        </div>

        {/* Live Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-lg font-bold">
          {[
            { icon: Users, label: 'Elite Warriors', value: '12,847', color: 'text-neon-blue' },
            { icon: Flame, label: 'Active Battles', value: '234', color: 'text-neon-red' },
            { icon: Crown, label: 'Tournaments Won', value: '1,567', color: 'text-yellow-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex items-center space-x-3 glass rounded-full px-6 py-3 border border-white/20"
              whileHover={{ scale: 1.05 }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                scale: { duration: 0.3 }
              }}
            >
              <stat.icon className={`h-6 w-6 ${stat.color} animate-pulse`} />
              <span className={`${stat.color}`}>{stat.value}</span>
              <span className="text-white">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-glow`
                : 'glass border border-white/20 text-gray-400 hover:text-white hover:border-white/40'
            }`}
          >
            <category.icon className="h-5 w-5" />
            <span>{category.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl overflow-hidden border border-white/20 relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-neon-blue/10 via-electric-purple/10 to-neon-red/10 p-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white flex items-center space-x-4 font-gaming">
              <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
              <span>FREE FIRE CHAMPIONS</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full">
                <span className="text-black font-black text-sm">SEASON 2025</span>
              </div>
            </h2>
            <p className="text-neon-blue text-lg font-semibold mt-2">Elite warriors who conquered the battlefield</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="skeleton h-20 rounded-xl"
              ></motion.div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 10 }}
                className={`p-8 transition-all duration-500 group relative overflow-hidden ${
                  player.rank <= 3 
                    ? `bg-gradient-to-r ${
                        player.rank === 1 ? 'from-yellow-500/10 to-orange-500/10 border-l-4 border-l-yellow-500' :
                        player.rank === 2 ? 'from-gray-400/10 to-gray-600/10 border-l-4 border-l-gray-400' :
                        'from-orange-600/10 to-red-500/10 border-l-4 border-l-orange-600'
                      }` 
                    : 'hover:bg-white/5 hover:border-l-4 hover:border-l-neon-blue'
                }`}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-center space-x-6 relative z-10">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-20 h-20 relative">
                    {player.rank <= 3 ? (
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="relative"
                      >
                        {getRankIcon(player.rank)}
                        {getRankBadge(player.rank)}
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-black text-gray-400 group-hover:text-neon-blue transition-colors bg-gradient-to-br from-white/10 to-white/5 rounded-2xl w-16 h-16 flex items-center justify-center"
                      >
                        {player.rank}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative"
                  >
                    <img
                      src={player.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${player.username}`}
                      alt={player.username}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-electric-purple p-0.5 shadow-glow group-hover:shadow-glow-lg transition-shadow"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </motion.div>
                  
                  {/* Player Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-bold text-xl group-hover:text-neon-blue transition-colors font-gaming">
                        {player.username}
                      </h3>
                      {player.rank <= 10 && (
                        <div className="bg-gradient-to-r from-neon-purple to-electric-purple px-3 py-1 rounded-full">
                          <span className="text-white text-xs font-bold uppercase tracking-wide">Elite</span>
                        </div>
                      )}
                      {player.rank === 1 && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full"
                        >
                          <span className="text-black text-xs font-black uppercase tracking-wide">Champion</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-neon-blue" />
                        <span className="text-gray-300">Level {player.level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300">{player.wins} wins</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Crosshair className="h-4 w-4 text-red-400" />
                        <span className="text-gray-300">{player.kills} eliminations</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Points */}
                  <div className="text-right space-y-2">
                    <motion.p 
                      className="text-white font-black text-3xl font-gaming group-hover:text-neon-blue transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      {player.points.toLocaleString()}
                    </motion.p>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
                      Battle Points
                    </p>
                    <div className="flex items-center justify-end space-x-1">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-bold">+{Math.floor(Math.random() * 50) + 10} today</span>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-electric-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={false}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center glass rounded-3xl p-8 border border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 to-electric-purple/5"
      >
        <h3 className="text-3xl font-bold text-white mb-4 font-gaming">READY TO CLIMB THE RANKS?</h3>
        <p className="text-gray-300 text-lg mb-6">
          Join the elite warriors and prove your skills in the ultimate Free Fire tournaments
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="btn-premium px-8 py-4 text-lg font-bold ripple mobile-friendly group"
        >
          <div className="flex items-center space-x-3">
            <Flame className="h-6 w-6 group-hover:animate-bounce" />
            <span>JOIN ELITE BATTLES</span>
            <Crown className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboards;