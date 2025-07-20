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

  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 500,
      description: 'Tournament Prize - Free Fire Championship',
      date: '2025-01-18',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 50,
      description: 'Entry Fee - PUBG Squad Tournament',
      date: '2025-01-17',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      amount: 1000,
      description: 'Wallet Top-up',
      date: '2025-01-16',
      status: 'completed'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your gaming funds</p>
      </div>

      {/* Balance Card */}
      <div className="glass rounded-xl p-8 text-center bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20">
        <WalletIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-white mb-2">
          ₹{user?.wallet_balance?.toLocaleString() || '0'}
        </h2>
        <p className="text-gray-400 mb-6">Available Balance</p>
        
        <div className="flex space-x-4 justify-center">
          <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2 ripple">
            <Plus className="h-5 w-5" />
            <span>Add Money</span>
          </button>
          <button className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
        </div>
        
        <div className="divide-y divide-white/10">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  transaction.type === 'credit' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {transaction.description}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(transaction.date).toLocaleDateString()} • {transaction.status}
                  </p>
                </div>
                
                <div className={`text-lg font-bold ${
                  transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Wallet;