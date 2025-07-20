import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Eye,
  Trophy,
  Crosshair,
  Activity,
  Star,
  Flame,
  Shield,
  Crown,
  Clock,
  MapPin,
  Gamepad2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Cpu,
  Radar,
  Scope
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import safeToast from '../utils/safeToast';

const AIAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');
  const [aiInsights, setAiInsights] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [playerAnalytics, setPlayerAnalytics] = useState(null);
  const [tournamentPredictions, setTournamentPredictions] = useState([]);

  // Premium Free Fire battle royale images
  const battleImages = [
    "https://images.unsplash.com/photo-1726935043403-29a87cfe895c",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e", 
    "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
    "https://images.unsplash.com/photo-1564049489314-60d154ff107d",
    "https://images.unsplash.com/photo-1645109870868-e1b6f909e444"
  ];

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain, color: 'from-purple-500 to-indigo-600' },
    { id: 'matchmaking', label: 'Smart Matchmaking', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { id: 'predictions', label: 'Predictions', icon: Eye, color: 'from-green-500 to-emerald-600' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'from-orange-500 to-red-600' }
  ];

  useEffect(() => {
    loadAIData();
  }, [activeTab]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'insights':
          await loadPlayerInsights();
          break;
        case 'matchmaking':
          await loadSmartRecommendations();
          break;
        case 'predictions':
          await loadTournamentPredictions();
          break;
        case 'performance':
          await loadPlayerAnalytics();
          break;
      }
    } catch (error) {
      console.error('Failed to load AI data:', error);
      toast.error('Failed to load AI analysis');
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerInsights = async () => {
    try {
      const response = await apiService.makeAuthenticatedRequest('/api/ai/player-insights');
      setAiInsights(response);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    }
  };

  const loadSmartRecommendations = async () => {
    try {
      const response = await apiService.makeAuthenticatedRequest('/api/ai/smart-matchmaking');
      setRecommendations(response);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const loadTournamentPredictions = async () => {
    try {
      // Mock predictions for demo - in production would fetch from available tournaments
      const mockPredictions = [
        {
          tournament_name: "Free Fire Battle Royale Championship",
          predicted_winner: "ProGamer_FF",
          confidence: 78,
          key_factors: ["High K/D ratio", "Consistent performance", "Meta weapon mastery"],
          tournament_id: "ff-br-championship"
        },
        {
          tournament_name: "Clash Squad Masters Pro",
          predicted_winner: "FF_Champion",
          confidence: 85,
          key_factors: ["Squad synergy", "Strategic positioning", "Clutch performance"],
          tournament_id: "ff-clash-masters"
        }
      ];
      setTournamentPredictions(mockPredictions);
    } catch (error) {
      console.error('Failed to load predictions:', error);
    }
  };

  const loadPlayerAnalytics = async () => {
    try {
      const response = await apiService.makeAuthenticatedRequest(`/api/analytics/player/${user.user_id}`);
      setPlayerAnalytics(response);
    } catch (error) {
      console.error('Failed to load player analytics:', error);
    }
  };

  const TabButton = ({ tab, isActive, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
        isActive
          ? 'text-white shadow-glow border border-neon-blue/50'
          : 'text-gray-400 hover:text-white border border-white/10 hover:border-neon-blue/30'
      }`}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tab.color} ${
        isActive ? 'opacity-20' : 'opacity-0 hover:opacity-10'
      } transition-opacity duration-300`} />
      
      <tab.icon className={`h-6 w-6 relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`} />
      <span className="relative z-10">{tab.label}</span>
      
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-electric-purple/20 rounded-2xl"
        />
      )}
    </motion.button>
  );

  const AIInsightCard = ({ title, content, icon: Icon, color, confidence }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-blue/30 transition-all duration-500 group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center group-hover:shadow-glow transition-shadow duration-300`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        {confidence && (
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-neon-purple" />
            <span className="text-neon-purple font-bold text-lg">{confidence}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-white font-bold text-xl mb-4 group-hover:text-neon-blue transition-colors">
        {title}
      </h3>
      
      <div className="text-gray-300 leading-relaxed">
        {typeof content === 'string' ? (
          <p>{content}</p>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );

  const SkillMeter = ({ label, value, color }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl font-black text-white mb-4 font-gaming">
          AI COACHING INSIGHTS
        </h2>
        <p className="text-gray-400 text-xl">
          Personalized analysis powered by advanced AI algorithms
        </p>
      </motion.div>

      {aiInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIInsightCard
            title="Performance Analysis"
            icon={BarChart3}
            color="from-blue-500 to-cyan-600"
            confidence={85}
            content={
              <div className="space-y-4">
                <p className="text-lg">{aiInsights.ai_coaching_analysis || "Loading AI analysis..."}</p>
                {aiInsights.detailed_analytics && (
                  <div className="space-y-4 mt-6">
                    <SkillMeter
                      label="Overall Skill"
                      value={aiInsights.detailed_analytics.overall_performance.skill_score}
                      color="from-neon-blue to-electric-purple"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Skill Tier</span>
                      <span className="text-neon-gold font-bold">
                        {aiInsights.detailed_analytics.overall_performance.skill_tier}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          <AIInsightCard
            title="Improvement Roadmap"
            icon={Target}
            color="from-green-500 to-emerald-600"
            confidence={92}
            content={
              <div className="space-y-4">
                {aiInsights.improvement_roadmap && (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <Crown className="h-6 w-6 text-yellow-400" />
                      <span className="text-lg font-bold text-yellow-400">
                        Next: {aiInsights.improvement_roadmap.next_milestone}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Level</span>
                        <span className="text-white font-bold">{aiInsights.improvement_roadmap.current_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timeline</span>
                        <span className="text-neon-green font-bold">{aiInsights.improvement_roadmap.estimated_timeline}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            }
          />

          <AIInsightCard
            title="Practice Recommendations"
            icon={Crosshair}
            color="from-orange-500 to-red-600"
            confidence={88}
            content={
              <div className="space-y-4">
                {aiInsights.practice_recommendations?.map((rec, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-xl border border-orange-500/20"
                  >
                    <Target className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-bold mb-1">{rec.focus_area}</h4>
                      <p className="text-gray-300 text-sm mb-2">{rec.specific_routine}</p>
                      <span className="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded">
                        {rec.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            }
          />

          <AIInsightCard
            title="Tournament Readiness"
            icon={Trophy}
            color="from-purple-500 to-indigo-600"
            confidence={aiInsights?.detailed_analytics?.competitive_analysis?.tournament_readiness?.readiness_score || 75}
            content={
              <div className="space-y-4">
                {aiInsights?.detailed_analytics?.competitive_analysis?.tournament_readiness && (
                  <>
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-bold mb-2 ${
                        aiInsights.detailed_analytics.competitive_analysis.tournament_readiness.readiness_level === 'Highly Ready' ? 'text-green-400' :
                        aiInsights.detailed_analytics.competitive_analysis.tournament_readiness.readiness_level === 'Ready' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {aiInsights.detailed_analytics.competitive_analysis.tournament_readiness.readiness_level}
                      </div>
                      <p className="text-gray-400">
                        Recommended entry fee: {aiInsights.detailed_analytics.competitive_analysis.tournament_readiness.recommended_entry_fee}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {aiInsights.detailed_analytics.competitive_analysis.tournament_readiness.suitable_tournament_types?.map((type, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{type}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            }
          />
        </div>
      )}
    </div>
  );

  const renderMatchmakingTab = () => (
    <div className="space-y-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl font-black text-white mb-4 font-gaming">
          SMART MATCHMAKING
        </h2>
        <p className="text-gray-400 text-xl">
          AI-powered tournament recommendations tailored to your skill level
        </p>
      </motion.div>

      {recommendations?.technical_recommendations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {recommendations.technical_recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon-blue/50 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={battleImages[index % battleImages.length]}
                  alt={rec.tournament?.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.skill_level_match === 'Perfect Match' ? 'bg-green-500' :
                    rec.skill_level_match === 'Great Match' ? 'bg-blue-500' :
                    rec.skill_level_match === 'Good Match' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } text-white`}>
                    {rec.skill_level_match}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {rec.tournament?.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-neon-blue" />
                      <span className="text-white font-semibold">
                        {rec.tournament?.current_participants}/{rec.tournament?.max_participants}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-semibold">₹{rec.tournament?.entry_fee}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Match Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full"
                        style={{ width: `${rec.match_score}%` }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm">{rec.match_score}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {rec.recommended_reason}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">
                      {rec.win_probability?.toFixed(1)}% win probability
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-premium py-3 text-center ripple mobile-friendly group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Gamepad2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold">JOIN BATTLE</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPredictionsTab = () => (
    <div className="space-y-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl font-black text-white mb-4 font-gaming">
          TOURNAMENT PREDICTIONS
        </h2>
        <p className="text-gray-400 text-xl">
          AI-powered winner predictions and match analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tournamentPredictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-green/50 transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-2xl">{prediction.tournament_name}</h3>
              <div className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-neon-green" />
                <span className="text-neon-green font-bold text-xl">{prediction.confidence}%</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-500/30">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-2">Predicted Winner</h4>
                <p className="text-green-400 font-black text-3xl">{prediction.predicted_winner}</p>
              </div>

              <div className="space-y-3">
                <h5 className="text-white font-bold flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-neon-purple" />
                  <span>Key Success Factors</span>
                </h5>
                {prediction.key_factors.map((factor, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 rounded-xl"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{factor}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full glass border border-neon-green/50 text-white rounded-xl py-4 hover:border-neon-green hover:shadow-glow transition-all duration-300 font-bold"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Watch Tournament Live</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl font-black text-white mb-4 font-gaming">
          PERFORMANCE ANALYSIS
        </h2>
        <p className="text-gray-400 text-xl">
          Comprehensive breakdown of your gaming performance
        </p>
      </motion.div>

      {playerAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Combat Stats */}
          <motion.div 
            className="glass rounded-3xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Crosshair className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl">Combat Mastery</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Kill Efficiency</span>
                <span className="text-white font-bold">
                  {playerAnalytics.analytics?.combat_stats?.kill_efficiency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Accuracy Grade</span>
                <span className="text-neon-gold font-bold text-xl">
                  {playerAnalytics.analytics?.combat_stats?.accuracy_grade}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Survival Mastery</span>
                <span className="text-green-400 font-bold">
                  {playerAnalytics.analytics?.combat_stats?.survival_mastery}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance Trends */}
          <motion.div 
            className="glass rounded-3xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl">Performance Trends</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Recent Form</span>
                <span className="text-neon-blue font-bold">
                  {playerAnalytics.analytics?.performance_trends?.recent_form}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Skill Progression</span>
                <span className="text-green-400 font-bold">
                  {playerAnalytics.analytics?.performance_trends?.skill_progression}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Consistency</span>
                <span className="text-yellow-400 font-bold">
                  {playerAnalytics.analytics?.performance_trends?.consistency_rating}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Competitive Analysis */}
          <motion.div 
            className="glass rounded-3xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl">Competitive Edge</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Rank Position</span>
                <span className="text-neon-purple font-bold">
                  {playerAnalytics.analytics?.overall_performance?.rank_position}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Estimated Rank</span>
                <span className="text-neon-gold font-bold">
                  {playerAnalytics.analytics?.overall_performance?.estimated_rank}
                </span>
              </div>
              <div className="text-center mt-4">
                <div className="text-3xl font-black text-white mb-1">
                  {playerAnalytics.analytics?.overall_performance?.skill_score}
                </div>
                <div className="text-sm text-gray-400">Overall Skill Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen space-y-12"
    >
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-3 mb-8">
          <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
          <span className="text-purple-300 font-bold uppercase tracking-wide">AI-Powered Analytics</span>
          <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-7xl font-black text-white mb-6 font-gaming">
          <span className="text-gradient bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan">
            NEURAL GAMING
          </span>
        </h1>
        <h2 className="text-4xl font-bold text-white mb-6">INTELLIGENCE SUITE</h2>
        <p className="text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
          Advanced AI algorithms analyze your gameplay, predict outcomes, and provide 
          personalized coaching to elevate your Free Fire tournament performance
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full mx-auto mb-8"
                />
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Brain Processing...
                </h3>
                <p className="text-gray-400">Analyzing your gameplay data with advanced algorithms</p>
              </motion.div>
            </div>
          ) : (
            <>
              {activeTab === 'insights' && renderInsightsTab()}
              {activeTab === 'matchmaking' && renderMatchmakingTab()}
              {activeTab === 'predictions' && renderPredictionsTab()}
              {activeTab === 'performance' && renderPerformanceTab()}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAnalytics;