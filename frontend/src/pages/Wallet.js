import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  QrCode,
  Trophy,
  Coins,
  Gift,
  Crown,
  Star,
  Zap,
  TrendingUp,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumQRPayment from '../components/PremiumQRPayment';
import { paytmService } from '../services/PaytmService';

const Wallet = () => {
  const { user } = useAuth();
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('balance');

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Update user balance in context/API
    // Show success toast is already handled in component
  };

  const openQRPayment = (amount) => {
    setSelectedAmount(amount);
    setShowQRPayment(true);
  };

  const paymentAmounts = paytmService.getPaymentAmounts();

  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 1500,
      description: '🏆 Victory! Free Fire Battle Royale Championship',
      date: '2025-01-20',
      status: 'completed',
      category: 'prize'
    },
    {
      id: 2,
      type: 'debit',
      amount: 100,
      description: '⚔️ Entry Fee - Squad Battle Tournament',
      date: '2025-01-19',
      status: 'completed',
      category: 'entry'
    },
    {
      id: 3,
      type: 'credit',
      amount: 2000,
      description: '💎 Battle Funds Added via Paytm',
      date: '2025-01-18',
      status: 'completed',
      category: 'topup'
    },
    {
      id: 4,
      type: 'credit',
      amount: 500,
      description: '🎁 Daily Login Bonus',
      date: '2025-01-17',
      status: 'completed',
      category: 'bonus'
    },
    {
      id: 5,
      type: 'debit',
      amount: 250,
      description: '🔥 Elite Tournament Entry',
      date: '2025-01-16',
      status: 'completed',
      category: 'entry'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-neon-blue to-electric-purple font-gaming mb-2">
          BATTLE WALLET
        </h1>
        <p className="text-gray-400">Manage your gaming funds & battle earnings</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 glass rounded-2xl p-2 border border-white/10"
      >
        {[
          { id: 'balance', label: 'Balance', icon: WalletIcon },
          { id: 'addFunds', label: 'Add Funds', icon: Plus },
          { id: 'history', label: 'History', icon: History }
        ].map((tab, index) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
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

      {/* Balance Tab */}
      {activeTab === 'balance' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-12 text-center bg-gradient-to-br from-neon-green/10 to-emerald-500/10 border border-neon-green/20 relative overflow-hidden min-h-[280px] flex flex-col justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent animate-pulse"></div>
            
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-neon-green to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-glow-lg">
                <WalletIcon className="h-12 w-12 text-white drop-shadow-xl" />
              </div>
            </motion.div>
            
            <div className="relative z-10 space-y-4">
              <p className="text-gray-300 text-xl font-semibold uppercase tracking-wider">Total Battle Funds</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="space-y-2"
              >
                <p className="text-6xl md:text-7xl font-black text-white font-gaming leading-none">
                  ₹{user?.wallet_balance?.toLocaleString() || '25,340'}
                </p>
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="h-1 bg-gradient-to-r from-neon-green via-emerald-400 to-neon-green rounded-full mx-auto max-w-xs"
                ></motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center space-x-3 pt-2"
              >
                <Coins className="h-6 w-6 text-neon-green animate-pulse" />
                <span className="text-neon-green font-bold text-xl">
                  {paytmService.amountToCoins(user?.wallet_balance || 25340).toLocaleString()} Battle Coins
                </span>
                <Zap className="h-6 w-6 text-neon-green animate-bounce" />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Total Earnings',
                value: '₹47,250',
                icon: TrendingUp,
                color: 'from-neon-blue to-electric-blue',
                description: 'Tournament winnings'
              },
              {
                title: 'Active Tournaments',
                value: '12',
                icon: Trophy,
                color: 'from-neon-purple to-electric-purple',
                description: 'Ongoing battles'
              },
              {
                title: 'Victory Rate',
                value: '73%',
                icon: Crown,
                color: 'from-yellow-400 to-orange-500',
                description: 'Win percentage'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Funds Tab */}
      {activeTab === 'addFunds' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Add Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-gaming">Quick Battle Funds</h3>
                <p className="text-gray-400 text-sm">Add funds instantly with Paytm UPI</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentAmounts.quick.map((pack, index) => (
                <motion.button
                  key={pack.amount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openQRPayment(pack.amount)}
                  className="glass rounded-xl p-4 border border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 group text-left"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xl font-bold text-white">₹{pack.amount}</p>
                    <QrCode className="h-5 w-5 text-neon-blue group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-neon-blue font-semibold text-sm mb-1">{pack.label}</p>
                  <p className="text-gray-400 text-xs mb-2">{pack.description}</p>
                  <div className="flex items-center space-x-1">
                    <Coins className="h-3 w-3 text-neon-green" />
                    <span className="text-neon-green text-xs font-bold">{pack.coins} coins</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Popular Packs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-yellow-400/20 bg-gradient-to-br from-yellow-400/5 to-orange-500/5"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-gaming">Popular Battle Packs</h3>
                <p className="text-yellow-400 text-sm font-semibold">✨ Best Value + Bonus Coins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentAmounts.popular.map((pack, index) => (
                <motion.button
                  key={pack.amount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openQRPayment(pack.amount)}
                  className="glass rounded-xl p-4 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 group text-left relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1">
                      <span className="text-white text-xs font-bold">+{paytmService.getBonusPercentage(pack.amount)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-2xl font-bold text-white">₹{pack.amount}</p>
                    <Star className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform animate-pulse" />
                  </div>
                  
                  <p className="text-yellow-400 font-bold text-sm mb-1">{pack.label}</p>
                  <p className="text-gray-300 text-xs mb-2">{pack.description}</p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Coins className="h-4 w-4 text-neon-green" />
                    <span className="text-neon-green font-bold">{pack.coins.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">coins</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Gift className="h-3 w-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">
                      +{Math.floor((pack.coins - (pack.amount * 10)) / 1000)}K Bonus
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-neon-purple to-electric-purple flex items-center justify-center">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-gaming">Battle History</h3>
                <p className="text-gray-400 text-sm">Recent transactions & earnings</p>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-gradient-to-r from-neon-green to-emerald-500' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    } group-hover:scale-110 transition-transform`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-white" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-3">
                        <p className="text-gray-400 text-xs">{transaction.date}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          transaction.category === 'prize' ? 'bg-yellow-400/20 text-yellow-400' :
                          transaction.category === 'bonus' ? 'bg-green-500/20 text-green-400' :
                          transaction.category === 'topup' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {transaction.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'credit' ? 'text-neon-green' : 'text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {transaction.type === 'credit' ? '+' : '-'}{paytmService.amountToCoins(transaction.amount)} coins
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Premium QR Payment Modal */}
      <PremiumQRPayment
        isOpen={showQRPayment}
        onClose={() => setShowQRPayment(false)}
        amount={selectedAmount}
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
};

export default Wallet;