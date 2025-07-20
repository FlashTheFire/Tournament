import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Wallet,
  Trophy,
  Crown,
  Gamepad2,
  Zap,
  Star,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      type: 'tournament',
      title: 'Tournament Starting Soon',
      message: 'Free Fire Battle Royale starts in 30 minutes',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your registration for PUBG Squad Tournament is confirmed',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'achievement',
      title: 'New Achievement',
      message: 'You reached Elite rank in Free Fire!',
      time: '3 hours ago',
      unread: false
    }
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const NotificationIcon = ({ type }) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-4 w-4 text-primary-400" />;
      case 'payment':
        return <Wallet className="h-4 w-4 text-green-400" />;
      case 'achievement':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors mobile-friendly"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments, players..."
              className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Wallet Balance */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
            <Wallet className="h-4 w-4 text-green-400" />
            <span className="text-white font-medium text-sm">
              ₹{user?.wallet_balance?.toLocaleString() || '0'}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors mobile-friendly"
            >
              <Bell className="h-5 w-5" />
              {mockNotifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-gray-400 text-sm">
                    {mockNotifications.filter(n => n.unread).length} new notifications
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      className={`p-4 border-b border-white/5 last:border-b-0 ${
                        notification.unread ? 'bg-primary-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button className="w-full text-center text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors mobile-friendly"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-white text-sm font-medium">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-gray-400 text-xs">
                  {user?.is_admin ? 'Admin' : 'Player'}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {user?.full_name || user?.username}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        @{user?.username}
                      </p>
                      <p className="text-primary-400 text-xs font-medium">
                        {user?.is_admin ? 'Administrator' : 'Player'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Wallet</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>

                <div className="border-t border-white/10 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournaments..."
            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Click outside handlers */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;