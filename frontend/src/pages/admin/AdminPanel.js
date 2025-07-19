import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Trophy, DollarSign } from 'lucide-react';

const AdminPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Tournament management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-white text-2xl font-bold">2,847</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Tournaments</p>
              <p className="text-white text-2xl font-bold">47</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">₹125K</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Analytics</p>
              <p className="text-white text-2xl font-bold">↗ 23%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all duration-300">
            Create Tournament
          </button>
          <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300">
            Manage Users
          </button>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all duration-300">
            View Analytics
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;