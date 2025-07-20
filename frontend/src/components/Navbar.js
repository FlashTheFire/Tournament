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
import PremiumHamburgerMenu from './PremiumHamburgerMenu';

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
      title: 'Free Fire Tournament Starting',
      message: 'Battle Royale Championship starts in 15 minutes',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'payment',
      title: 'Registration Confirmed',
      message: 'Your entry to Free Fire Squad Battle is confirmed - ₹250 paid',
      time: '30 min ago',
      unread: true
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Rank Upgrade!',
      message: 'Congratulations! You reached Heroic rank in Free Fire Arena',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'reward',
      title: 'Prize Money Received',
      message: 'You won ₹1,500 from yesterday\'s tournament!',
      time: '1 day ago',
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
        return <Trophy className="h-5 w-5 text-neon-blue" />;
      case 'payment':
        return <Wallet className="h-5 w-5 text-neon-green" />;
      case 'achievement':
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 'reward':
        return <Star className="h-5 w-5 text-neon-purple" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="glass border-b border-white/10 px-6 py-4 relative z-40"
    >
      {/* Kinetic background effect */}
      <div className="kinetic-waves absolute inset-0 opacity-30"></div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Ultra-Premium Hamburger Menu */}
          <PremiumHamburgerMenu onClick={onMenuClick} />

          {/* Enhanced Brand Logo */}
          <Link to="/" className="hidden sm:flex items-center space-x-4 group">
            <motion.div 
              className="relative w-12 h-12 bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-2xl flex items-center justify-center shadow-glow"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Gamepad2 className="h-7 w-7 text-white drop-shadow-lg" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-white/30 rounded-2xl"
              />
            </motion.div>
            <div className="hidden lg:block">
              <h1 className="text-white font-black text-xl font-gaming tracking-wide">FREE FIRE</h1>
              <p className="text-neon-blue text-xs font-bold uppercase tracking-wider">ULTIMATE ARENA</p>
            </div>
          </Link>

          {/* Enhanced Search Bar */}
          <div className="hidden md:block relative">
            <motion.div
              animate={{
                scale: searchFocused ? 1.02 : 1,
                boxShadow: searchFocused 
                  ? '0 0 20px rgba(0, 212, 255, 0.3)' 
                  : '0 0 0px rgba(0, 212, 255, 0)'
              }}
              className="relative"
            >
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                searchFocused ? 'text-neon-blue' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search tournaments, players, battles..."
                className="w-72 lg:w-96 pl-12 pr-6 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all duration-300"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Wallet Balance */}
          <motion.div 
            className="hidden sm:flex items-center space-x-3 px-4 py-2 glass rounded-xl border border-neon-green/30 hover:border-neon-green/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="h-5 w-5 text-neon-green" />
            </motion.div>
            <span className="text-white font-semibold">
              ₹{user?.wallet_balance?.toLocaleString() || '0'}
            </span>
          </motion.div>

          {/* Enhanced Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 mobile-friendly"
            >
              <Bell className="h-6 w-6" />
              {mockNotifications.some(n => n.unread) && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-neon-red to-pink-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">
                    {mockNotifications.filter(n => n.unread).length}
                  </span>
                </motion.span>
              )}
            </motion.button>

            {/* Enhanced Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-full mt-3 w-96 bg-gradient-to-br from-cosmic-black/95 to-cosmic-dark/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.95))',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.1)'
                  }}
                >
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cosmic-dark/50 to-cosmic-black/50">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-6 w-6 text-neon-blue" />
                      <div>
                        <h3 className="text-white font-bold text-lg font-gaming">Battle Alerts</h3>
                        <p className="text-gray-400 text-sm">
                          {mockNotifications.filter(n => n.unread).length} new notifications
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        className={`p-4 border-b border-white/5 last:border-b-0 cursor-pointer transition-all duration-300 ${
                          notification.unread ? 'bg-neon-blue/3 border-l-2 border-l-neon-blue' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                            <NotificationIcon type={notification.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm mb-1">
                              {notification.title}
                            </p>
                            <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-3 w-3 bg-neon-blue rounded-full shadow-glow"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10 bg-gradient-to-r from-cosmic-dark/30 to-cosmic-black/30">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-center text-neon-blue text-sm font-semibold hover:text-white hover:bg-neon-blue/10 py-2 rounded-lg transition-all duration-300"
                    >
                      Mark All as Read
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Profile Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 mobile-friendly group"
            >
              <motion.div 
                className="relative"
                whileHover={{ rotate: 5 }}
              >
                <div className="h-10 w-10 bg-gradient-to-br from-neon-purple to-electric-blue rounded-xl flex items-center justify-center border-2 border-white/20 group-hover:border-neon-blue/50 transition-all duration-300">
                  <span className="text-white font-bold text-sm">
                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
                {user?.is_admin && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </motion.div>
              <div className="hidden lg:block text-left">
                <p className="text-white text-sm font-semibold group-hover:text-neon-blue transition-colors">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-gray-400 text-xs flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>{user?.is_admin ? 'Administrator' : 'Elite Player'}</span>
                </p>
              </div>
            </motion.button>

            {/* Enhanced Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-gradient-to-br from-cosmic-black/95 to-cosmic-dark/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.95))',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <div className="p-6 border-b border-white/10 bg-gradient-to-br from-cosmic-dark/50 to-cosmic-black/50">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-16 w-16 bg-gradient-to-br from-neon-purple to-electric-blue rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-glow">
                          <span className="text-white font-bold text-xl">
                            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {user?.is_admin && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-cosmic-black">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-lg truncate font-gaming">
                          {user?.full_name || user?.username}
                        </p>
                        <p className="text-gray-300 text-sm truncate">
                          @{user?.username}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Shield className="h-4 w-4 text-neon-blue" />
                          <span className="text-neon-blue text-sm font-semibold">
                            {user?.is_admin ? 'Administrator' : 'Elite Player'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {[
                      { to: '/dashboard', icon: User, label: 'My Profile', color: 'text-neon-blue' },
                      { to: '/wallet', icon: Wallet, label: 'Wallet & Earnings', color: 'text-neon-green' },
                      { to: '/settings', icon: Settings, label: 'Settings', color: 'text-neon-purple' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.to}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-4 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                        >
                          <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-sm font-medium">{item.label}</span>
                          <Zap className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 p-2 bg-gradient-to-r from-cosmic-dark/30 to-cosmic-black/30">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="flex items-center space-x-4 px-6 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left rounded-lg group"
                    >
                      <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Sign Out</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Search Bar */}
      <motion.div 
        className="md:hidden mt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            searchFocused ? 'text-neon-blue' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search battles, tournaments..."
            className="w-full pl-12 pr-6 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all duration-300"
          />
        </div>
      </motion.div>

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