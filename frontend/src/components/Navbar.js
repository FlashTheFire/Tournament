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
import { Link, useLocation } from 'react-router-dom';
import PremiumHamburgerMenu from './PremiumHamburgerMenu';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
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
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />;
      case 'payment':
        return <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green" />;
      case 'achievement':
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />;
      case 'reward':
        return <Star className="h-4 w-4 sm:h-5 sm:w-5 text-neon-purple" />;
      default:
        return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="glass-mobile border-b border-white/10 relative z-40
        /* Mobile: very compact navbar padding */
        px-2 py-2
        /* Small mobile: slightly more padding */
        xs:px-4 xs:py-3
        /* Tablet: normal padding */
        sm:px-6 sm:py-4
      "
    >
      {/* Kinetic background effect */}
      <div className="kinetic-waves absolute inset-0 opacity-30"></div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Left Section - Brand Logo that opens hamburger */}
        <div className="flex items-center
          /* Mobile: very compact spacing */
          space-x-1.5
          /* Small mobile: slightly more spacing */
          xs:space-x-3
          /* Desktop: spacious spacing */
          sm:space-x-4 lg:space-x-6
        ">
          {/* Brand Logo that opens hamburger menu */}
          <motion.button 
            onClick={onMenuClick}
            className="flex items-center space-x-3 sm:space-x-4 group focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="relative bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-2xl flex items-center justify-center shadow-glow cursor-pointer hover:shadow-glow-lg transition-all duration-300
                /* Mobile: smaller logo */
                w-8 h-8
                /* Tablet: medium logo */
                sm:w-10 sm:h-10
                /* Desktop: larger logo */
                lg:w-12 lg:h-12
              "
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Gamepad2 className="text-white drop-shadow-lg
                /* Mobile: smaller logo icon */
                h-5 w-5
                /* Tablet: medium logo icon */
                sm:h-6 sm:w-6
                /* Desktop: larger logo icon */
                lg:h-7 lg:w-7
              " />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-white/30 rounded-2xl"
              />
            </motion.div>
            <div className="hidden md:block lg:block">
              <h1 className="text-white font-black font-gaming tracking-wide
                /* Desktop: responsive brand title */
                text-lg lg:text-xl
              ">FREE FIRE</h1>
              <p className="text-neon-blue font-bold uppercase tracking-wider
                /* Desktop: responsive brand subtitle */
                text-xs lg:text-xs
              ">ULTIMATE ARENA</p>
            </div>
          </motion.button>

          {/* No Search Bar - Removed as per requirement */}
        </div>

        {/* Right Section - Mobile-First */}
        <div className="flex items-center
          /* Mobile: very compact spacing */
          space-x-1
          /* Small mobile: slightly more spacing */
          xs:space-x-2
          /* Tablet: medium spacing */
          sm:space-x-3
          /* Desktop: spacious spacing */
          lg:space-x-4
        ">
          {/* Mobile-First Wallet Balance - Hidden on very small screens */}
          <motion.div 
            className="hidden xs:flex items-center glass-mobile rounded-xl border border-neon-green/30 hover:border-neon-green/50 transition-all duration-300
              /* Mobile: compact wallet display */
              space-x-2 px-3 py-2
              /* Desktop: spacious wallet display */
              sm:space-x-3 sm:px-4 sm:py-2
            "
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="text-neon-green
                /* Mobile: smaller wallet icon */
                h-4 w-4
                /* Desktop: larger wallet icon */
                sm:h-5 sm:w-5
              " />
            </motion.div>
            <span className="text-white font-semibold
              /* Mobile: smaller wallet text */
              text-xs
              /* Desktop: larger wallet text */
              sm:text-sm
            ">
              ₹{user?.wallet_balance?.toLocaleString() || '0'}
            </span>
          </motion.div>

          {/* Mobile-First Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 mobile-friendly
                /* Mobile: compact notification button */
                p-2 rounded-lg
                /* Desktop: spacious notification button */
                sm:p-3 sm:rounded-xl
              "
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              {mockNotifications.some(n => n.unread) && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bg-gradient-to-r from-neon-red to-pink-500 rounded-full flex items-center justify-center
                    /* Mobile: smaller notification badge */
                    -top-1 -right-1 h-4 w-4 text-2xs
                    /* Desktop: larger notification badge */
                    sm:-top-1 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs
                  "
                >
                  <span className="text-white font-bold">
                    {mockNotifications.filter(n => n.unread).length}
                  </span>
                </motion.span>
              )}
            </motion.button>

            {/* Mobile-First Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-full mt-3 bg-gradient-to-br from-cosmic-black/95 to-cosmic-dark/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden
                    /* Mobile: compact dropdown */
                    w-80
                    /* Desktop: wider dropdown */
                    sm:w-96
                  "
                  style={{
                    background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.95))',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.1)'
                  }}
                >
                  <div className="border-b border-white/10 bg-gradient-to-r from-cosmic-dark/50 to-cosmic-black/50
                    /* Mobile: compact header */
                    p-4
                    /* Desktop: spacious header */
                    sm:p-6
                  ">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Bell className="text-neon-blue
                        /* Mobile: smaller header icon */
                        h-5 w-5
                        /* Desktop: larger header icon */
                        sm:h-6 sm:w-6
                      " />
                      <div>
                        <h3 className="text-white font-bold font-gaming
                          /* Mobile: smaller header title */
                          text-base
                          /* Desktop: larger header title */
                          sm:text-lg
                        ">Battle Alerts</h3>
                        <p className="text-gray-400
                          /* Mobile: smaller header subtitle */
                          text-xs
                          /* Desktop: larger header subtitle */
                          sm:text-sm
                        ">
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
                        className={`border-b border-white/5 last:border-b-0 cursor-pointer transition-all duration-300 ${
                          notification.unread ? 'bg-neon-blue/3 border-l-2 border-l-neon-blue' : ''
                        }
                          /* Mobile: compact notification item */
                          p-3
                          /* Desktop: spacious notification item */
                          sm:p-4
                        `}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="p-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                            <NotificationIcon type={notification.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold mb-1
                              /* Mobile: smaller notification title */
                              text-xs
                              /* Desktop: larger notification title */
                              sm:text-sm
                            ">
                              {notification.title}
                            </p>
                            <p className="text-gray-300 mb-2 leading-relaxed
                              /* Mobile: smaller notification message */
                              text-xs
                              /* Desktop: larger notification message */
                              sm:text-sm
                            ">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-2xs sm:text-xs">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-neon-blue rounded-full shadow-glow"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 bg-gradient-to-r from-cosmic-dark/30 to-cosmic-black/30
                    /* Mobile: compact footer */
                    p-3
                    /* Desktop: spacious footer */
                    sm:p-4
                  ">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-center text-neon-blue hover:text-white hover:bg-neon-blue/10 py-2 rounded-lg transition-all duration-300
                        /* Mobile: smaller footer button */
                        text-xs font-medium
                        /* Desktop: larger footer button */
                        sm:text-sm sm:font-semibold
                      "
                    >
                      Mark All as Read
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile-First Profile Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center hover:bg-white/10 transition-all duration-300 mobile-friendly group
                /* Mobile: compact profile button */
                space-x-2 p-1.5 rounded-lg
                /* Desktop: spacious profile button */
                sm:space-x-3 sm:p-2 sm:rounded-xl
              "
            >
              <motion.div 
                className="relative"
                whileHover={{ rotate: 5 }}
              >
                <div className="bg-gradient-to-br from-neon-purple to-electric-blue rounded-xl flex items-center justify-center border-2 border-white/20 group-hover:border-neon-blue/50 transition-all duration-300
                  /* Mobile: smaller profile avatar */
                  h-8 w-8
                  /* Desktop: larger profile avatar */
                  sm:h-10 sm:w-10
                ">
                  <span className="text-white font-bold
                    /* Mobile: smaller avatar text */
                    text-xs
                    /* Desktop: larger avatar text */
                    sm:text-sm
                  ">
                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
                {user?.is_admin && (
                  <div className="absolute bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center
                    /* Mobile: smaller admin crown */
                    -top-1 -right-1 w-3 h-3
                    /* Desktop: larger admin crown */
                    sm:-top-1 sm:-right-1 sm:w-4 sm:h-4
                  ">
                    <Crown className="text-white
                      /* Mobile: tiny crown icon */
                      h-2 w-2
                      /* Desktop: small crown icon */
                      sm:h-2.5 sm:w-2.5
                    " />
                  </div>
                )}
              </motion.div>
              <div className="hidden sm:block lg:block text-left">
                <p className="text-white font-semibold group-hover:text-neon-blue transition-colors
                  /* Desktop: responsive profile name */
                  text-sm
                ">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-gray-400 flex items-center space-x-1
                  /* Desktop: responsive profile role */
                  text-xs
                ">
                  <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>{user?.is_admin ? 'Administrator' : 'Elite Player'}</span>
                </p>
              </div>
            </motion.button>

            {/* Mobile-First Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-full mt-3 bg-gradient-to-br from-cosmic-black/95 to-cosmic-dark/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden
                    /* Mobile: compact profile dropdown */
                    w-72
                    /* Desktop: wider profile dropdown */
                    sm:w-80
                  "
                  style={{
                    background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.95))',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <div className="border-b border-white/10 bg-gradient-to-br from-cosmic-dark/50 to-cosmic-black/50
                    /* Mobile: compact profile header */
                    p-4
                    /* Desktop: spacious profile header */
                    sm:p-6
                  ">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-neon-purple to-electric-blue rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-glow
                          /* Mobile: smaller profile avatar */
                          h-12 w-12
                          /* Desktop: larger profile avatar */
                          sm:h-16 sm:w-16
                        ">
                          <span className="text-white font-bold
                            /* Mobile: smaller avatar text */
                            text-lg
                            /* Desktop: larger avatar text */
                            sm:text-xl
                          ">
                            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {user?.is_admin && (
                          <div className="absolute bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-cosmic-black
                            /* Mobile: smaller admin crown */
                            -top-2 -right-2 w-5 h-5
                            /* Desktop: larger admin crown */
                            sm:-top-2 sm:-right-2 sm:w-6 sm:h-6
                          ">
                            <Crown className="text-white
                              /* Mobile: smaller crown */
                              h-3 w-3
                              /* Desktop: larger crown */
                              sm:h-4 sm:w-4
                            " />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate font-gaming
                          /* Mobile: smaller profile name */
                          text-base
                          /* Desktop: larger profile name */
                          sm:text-lg
                        ">
                          {user?.full_name || user?.username}
                        </p>
                        <p className="text-gray-300 truncate
                          /* Mobile: smaller username */
                          text-xs
                          /* Desktop: larger username */
                          sm:text-sm
                        ">
                          @{user?.username}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-neon-blue" />
                          <span className="text-neon-blue font-semibold
                            /* Mobile: smaller role text */
                            text-xs
                            /* Desktop: larger role text */
                            sm:text-sm
                          ">
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
                          className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group
                            /* Mobile: compact menu item */
                            space-x-3 px-4 py-3
                            /* Desktop: spacious menu item */
                            sm:space-x-4 sm:px-6 sm:py-4
                          "
                        >
                          <item.icon className={`${item.color} group-hover:scale-110 transition-transform
                            /* Mobile: smaller menu icon */
                            h-4 w-4
                            /* Desktop: larger menu icon */
                            sm:h-5 sm:w-5
                          `} />
                          <span className="font-medium
                            /* Mobile: smaller menu text */
                            text-xs
                            /* Desktop: larger menu text */
                            sm:text-sm
                          ">{item.label}</span>
                          <Zap className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto
                            /* Mobile: smaller action icon */
                            h-3 w-3
                            /* Desktop: larger action icon */
                            sm:h-4 sm:w-4
                          " />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 bg-gradient-to-r from-cosmic-dark/30 to-cosmic-black/30
                    /* Mobile: compact logout section */
                    p-2
                    /* Desktop: spacious logout section */
                    sm:p-2
                  ">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="flex items-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left rounded-lg group
                        /* Mobile: compact logout button */
                        space-x-3 px-4 py-3
                        /* Desktop: spacious logout button */
                        sm:space-x-4 sm:px-6 sm:py-4
                      "
                    >
                      <LogOut className="group-hover:scale-110 transition-transform
                        /* Mobile: smaller logout icon */
                        h-4 w-4
                        /* Desktop: larger logout icon */
                        sm:h-5 sm:w-5
                      " />
                      <span className="font-medium
                        /* Mobile: smaller logout text */
                        text-xs
                        /* Desktop: larger logout text */
                        sm:text-sm
                      ">Sign Out</span>
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

      {/* Mobile-First Search Bar - Only visible on mobile when main search is hidden */}
      <motion.div 
        className="md:hidden mt-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            searchFocused ? 'text-neon-blue' : 'text-gray-400'
          }
            /* Mobile: compact search icon */
            h-4 w-4
          `} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search battles, tournaments..."
            className="w-full glass-mobile rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all duration-300
              /* Mobile: compact mobile search */
              pl-10 pr-4 py-2.5 text-sm
            "
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