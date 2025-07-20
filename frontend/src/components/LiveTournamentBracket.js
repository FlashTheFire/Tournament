import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  Target, 
  Crown, 
  Flame, 
  Zap,
  Star,
  Shield,
  Skull,
  Crosshair,
  Play,
  Pause,
  Eye,
  Award,
  TrendingUp
} from 'lucide-react';

const LiveTournamentBracket = ({ tournamentId }) => {
  const [bracket, setBracket] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);

  // Mock tournament bracket data
  const mockBracket = {
    tournamentId: "FFT2025_BR_001",
    name: "Free Fire Battle Royale Championship",
    status: "live",
    totalPlayers: 100,
    currentRound: "Semi-Finals",
    rounds: [
      {
        roundNumber: 1,
        name: "Qualifying Round",
        status: "completed",
        matches: [
          {
            id: "M001",
            players: [
              { id: "P001", name: "FireStorm_99", avatar: "🔥", kills: 12, placement: 1 },
              { id: "P002", name: "ShadowHunter", avatar: "🌟", kills: 8, placement: 2 },
              { id: "P003", name: "BattleKing", avatar: "👑", kills: 6, placement: 3 },
              { id: "P004", name: "StealthSniper", avatar: "🎯", kills: 4, placement: 4 }
            ],
            status: "completed",
            winner: "P001",
            startTime: "2025-01-20 14:00:00",
            endTime: "2025-01-20 14:25:00"
          }
        ]
      },
      {
        roundNumber: 2,
        name: "Semi-Finals", 
        status: "live",
        matches: [
          {
            id: "M002",
            players: [
              { id: "P001", name: "FireStorm_99", avatar: "🔥", kills: 15, placement: null },
              { id: "P005", name: "EliteWarrior", avatar: "⚔️", kills: 11, placement: null },
              { id: "P006", name: "ProGamer_X", avatar: "🎮", kills: 9, placement: null },
              { id: "P007", name: "DeadShot", avatar: "💀", kills: 7, placement: null }
            ],
            status: "live",
            winner: null,
            startTime: "2025-01-20 15:30:00",
            endTime: null,
            liveStats: {
              playersAlive: 2,
              currentZone: "Zone 4",
              timeRemaining: "3:45"
            }
          }
        ]
      },
      {
        roundNumber: 3,
        name: "Grand Final",
        status: "upcoming",
        matches: [
          {
            id: "M003", 
            players: [],
            status: "upcoming",
            winner: null,
            startTime: "2025-01-20 16:30:00",
            prizePool: "₹50,000"
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setBracket(mockBracket);
    setLiveMatches(mockBracket.rounds.filter(r => r.status === 'live'));
  }, []);

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'live': return 'from-red-500 to-pink-500';
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'upcoming': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPlayerRankIcon = (placement) => {
    switch (placement) {
      case 1: return <Crown className="h-4 w-4 text-yellow-400" />;
      case 2: return <Award className="h-4 w-4 text-gray-400" />;
      case 3: return <Star className="h-4 w-4 text-orange-400" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!bracket) return <div>Loading bracket...</div>;

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-red-500/30 bg-gradient-to-r from-red-500/10 to-pink-500/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-gaming">{bracket.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm font-semibold">{bracket.totalPlayers} Players</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-semibold">{bracket.currentRound}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-semibold">LIVE</span>
                </div>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-bold flex items-center space-x-2"
          >
            <Eye className="h-5 w-5" />
            <span>Spectate</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Bracket Rounds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bracket.rounds.map((round, index) => (
          <motion.div
            key={round.roundNumber}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="space-y-4"
          >
            {/* Round Header */}
            <div className="text-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getMatchStatusColor(round.status)}`}>
                <span className="text-white font-bold text-sm">{round.name}</span>
                {round.status === 'live' && <Zap className="h-4 w-4 text-white animate-pulse" />}
              </div>
            </div>

            {/* Round Matches */}
            <div className="space-y-4">
              {round.matches.map((match) => (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedMatch(match)}
                  className="glass rounded-xl p-4 border border-white/10 hover:border-red-500/30 cursor-pointer transition-all duration-300"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        match.status === 'live' ? 'bg-red-500 animate-pulse' :
                        match.status === 'completed' ? 'bg-green-500' :
                        'bg-yellow-400'
                      }`}></div>
                      <span className="text-white font-semibold text-sm">Match {match.id}</span>
                    </div>
                    
                    {match.status === 'live' && match.liveStats && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="h-3 w-3 text-red-400" />
                        <span className="text-red-400 font-mono">{match.liveStats.timeRemaining}</span>
                      </div>
                    )}
                  </div>

                  {/* Live Stats for ongoing matches */}
                  {match.status === 'live' && match.liveStats && (
                    <div className="bg-red-500/10 rounded-lg p-3 mb-3 border border-red-500/20">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <Users className="h-4 w-4 text-red-400 mx-auto mb-1" />
                          <p className="text-red-400 font-bold">{match.liveStats.playersAlive}</p>
                          <p className="text-gray-400">Alive</p>
                        </div>
                        <div className="text-center">
                          <Target className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                          <p className="text-orange-400 font-bold">{match.liveStats.currentZone}</p>
                          <p className="text-gray-400">Zone</p>
                        </div>
                        <div className="text-center">
                          <Flame className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                          <p className="text-yellow-400 font-bold">12</p>
                          <p className="text-gray-400">Total Kills</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Players */}
                  <div className="space-y-2">
                    {match.players.slice(0, 4).map((player, playerIndex) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {match.status === 'completed' && getPlayerRankIcon(player.placement)}
                            <span className="text-xl">{player.avatar}</span>
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${
                              match.winner === player.id ? 'text-yellow-400' : 'text-white'
                            }`}>
                              {player.name}
                            </p>
                            {match.status === 'completed' && (
                              <p className="text-gray-400 text-xs">#{player.placement}</p>
                            )}
                          </div>
                        </div>
                        
                        {player.kills !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Crosshair className="h-3 w-3 text-red-400" />
                            <span className="text-red-400 text-sm font-bold">{player.kills}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {match.players.length === 0 && match.status === 'upcoming' && (
                      <div className="text-center py-4">
                        <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-yellow-400 font-semibold">Waiting for qualifiers</p>
                        {match.prizePool && (
                          <p className="text-green-400 text-sm mt-1">Prize: {match.prizePool}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Match Actions */}
                  {match.status === 'live' && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-red-500/20 text-red-400 py-2 px-3 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Watch</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-blue-500/20 text-blue-400 py-2 px-3 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-colors flex items-center justify-center space-x-1"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>Stats</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Match Details Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-cosmic-dark to-cosmic-black rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content for detailed match view */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Match {selectedMatch.id} Details</h3>
                {/* Add detailed match information here */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTournamentBracket;