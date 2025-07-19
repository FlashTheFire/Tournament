import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const TournamentDetails = () => {
  const { id } = useParams();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tournament Details</h1>
        <p className="text-gray-400">Tournament ID: {id}</p>
      </div>
      
      <div className="glass rounded-xl p-6">
        <p className="text-white">Tournament details will be implemented here.</p>
      </div>
    </motion.div>
  );
};

export default TournamentDetails;