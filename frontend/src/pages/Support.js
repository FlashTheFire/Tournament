import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';

const Support = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
        <p className="text-gray-400">Get help with your gaming experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 text-center">
          <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm mb-4">
            Chat with our support team instantly
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ripple">
            Start Chat
          </button>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <Mail className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm mb-4">
            Send us an email for detailed help
          </p>
          <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300 ripple">
            Send Email
          </button>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <HelpCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">FAQ</h3>
          <p className="text-gray-400 text-sm mb-4">
            Find answers to common questions
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 ripple">
            View FAQ
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;