import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Star, Medal } from 'lucide-react';
import { apiService } from '../services/api';

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <Star className="h-5 w-5 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboards</h1>
        <p className="text-gray-400">Top players in the gaming arena</p>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500/20 to-purple-600/20 p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Free Fire Champions</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 hover:bg-white/5 transition-colors ${
                  player.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {player.rank <= 3 ? (
                      getRankIcon(player.rank)
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {player.rank}
                      </span>
                    )}
                  </div>
                  
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className="w-12 h-12 rounded-full bg-gray-600"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {player.username}
                    </h3>
                    <p className="text-gray-400 text-sm">Level {player.level}</p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="text-white font-bold text-xl">
                      {player.points.toLocaleString()} pts
                    </p>
                    <p className="text-gray-400 text-sm">
                      {player.wins} wins • {player.kills} kills
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Leaderboards;