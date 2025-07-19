import React from 'react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
        <p className="text-gray-400">User management and moderation</p>
      </div>
      <div className="glass rounded-xl p-6">
        <p className="text-white">User management interface will be implemented here.</p>
      </div>
    </motion.div>
  );
};

export default AdminUsers;