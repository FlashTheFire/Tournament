import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  Crown, 
  Wallet, 
  HelpCircle, 
  Settings, 
  Shield, 
  X,
  ChevronRight,
  Gamepad2,
  Users,
  BarChart3,
  User,
  Target,
  Crosshair,
  Flame,
  Skull,
  Swords,
  Star,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'home',
      title: 'Battle Arena',
      icon: Home,
      path: '/',
      badge: null,
      description: 'Main battlefield'
    },
    {
      key: 'tournaments',
      title: 'Tournaments',
      icon: Trophy,
      path: '/tournaments',
      badge: '67',
      description: 'Live battles',
      submenu: [
        { title: 'Battle Royale', path: '/tournaments', icon: Crosshair, badge: 'BR' },
        { title: 'Clash Squad', path: '/tournaments', icon: Swords, badge: 'CS' },
        { title: 'My Battles', path: '/dashboard', icon: User, badge: null },
      ]
    },
    {
      key: 'advanced-gaming',
      title: 'Advanced Gaming',
      icon: Zap,
      path: '/advanced-gaming',
      badge: 'AI',
      description: 'Premium features'
    },
    {
      key: 'leaderboards',
      title: 'Hall of Fame',
      icon: Crown,
      path: '/leaderboards',
      badge: null,
      description: 'Elite warriors'
    },
    {
      key: 'wallet',
      title: 'Wallet',
      icon: Wallet,
      path: '/wallet',
      badge: '₹' + (user?.wallet_balance || 0),
      description: 'Battle funds'
    },
    {
      key: 'support',
      title: 'Support',
      icon: HelpCircle,
      path: '/support',
      badge: null,
      description: 'Get help'
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null,
      description: 'Customize'
    }
  ];

  const adminMenuItems = [
    {
      key: 'admin',
      title: 'Admin Panel',
      icon: Shield,
      path: '/admin',
      badge: 'ADMIN',
      submenu: [
        { title: 'Dashboard', path: '/admin', icon: BarChart3 },
        { title: 'Tournaments', path: '/admin/tournaments', icon: Trophy },
        { title: 'Users', path: '/admin/users', icon: Users },
        { title: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ]
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const isActiveParent = (menuItem) => {
    if (menuItem.submenu) {
      return menuItem.submenu.some(item => location.pathname === item.path);
    }
    return false;
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  const MenuIcon = ({ icon: Icon, isActive }) => (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-neon-blue to-electric-purple shadow-glow' 
          : 'bg-white/10 group-hover:bg-neon-blue/20'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`} />
    </motion.div>
  );

  const MenuBadge = ({ badge, isActive }) => {
    if (!badge) return null;
    
    const isAdmin = badge === 'ADMIN';
    const isCurrency = badge.startsWith('₹');
    const baseClasses = "ml-auto text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide";
    
    if (isAdmin) {
      return <span className={`${baseClasses} bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-glow animate-pulse-glow`}>{badge}</span>;
    }
    
    if (isCurrency) {
      return (
        <span className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow`}>
          {badge}
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} ${
        isActive 
          ? 'bg-gradient-to-r from-neon-blue to-electric-purple text-white shadow-glow' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 group-hover:from-neon-blue group-hover:to-electric-purple group-hover:text-white'
      } transition-all duration-300`}>
        {badge}
      </span>
    );
  };

  const renderMenuItem = (item, index) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.key];
    const isActive = isActiveLink(item.path) || isActiveParent(item);

    return (
      <div key={item.key} className="mb-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {hasSubmenu ? (
            <motion.button
              onClick={() => toggleMenu(item.key)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'glass border border-neon-blue/50 text-white shadow-glow'
                  : 'glass border border-white/10 text-gray-300 hover:border-neon-blue/30 hover:text-white'
              }`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-electric-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <MenuIcon icon={item.icon} isActive={isActive} />
              <div className="flex-1 text-left relative z-10">
                <p className="font-bold">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                )}
              </div>
              <MenuBadge badge={item.badge} isActive={isActive} />
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          ) : (
            <Link
              to={item.path}
              onClick={onClose}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'glass border border-neon-blue/50 text-white shadow-glow'
                    : 'glass border border-white/10 text-gray-300 hover:border-neon-blue/30 hover:text-white'
                }`}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-electric-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <MenuIcon icon={item.icon} isActive={isActive} />
                <div className="flex-1 relative z-10">
                  <p className="font-bold">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                <MenuBadge badge={item.badge} isActive={isActive} />
              </motion.div>
            </Link>
          )}
        </motion.div>

        <AnimatePresence>
          {hasSubmenu && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="ml-6 mt-3 space-y-2 overflow-hidden"
            >
              {item.submenu.map((subItem, subIndex) => (
                <motion.div
                  key={subItem.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: subIndex * 0.1, type: "spring", stiffness: 150 }}
                >
                  <Link
                    to={subItem.path}
                    onClick={onClose}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
                        isActiveLink(subItem.path)
                          ? 'bg-gradient-to-r from-neon-purple/20 to-electric-purple/20 text-white border border-neon-purple/30'
                          : 'glass border border-white/5 text-gray-400 hover:border-neon-purple/20 hover:text-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors duration-300">
                        <subItem.icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1">{subItem.title}</span>
                      {subItem.badge && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-bold">
                          {subItem.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-full glass border-r border-white/10 z-50 kinetic-waves
          w-80 sm:w-80 md:w-80 lg:w-80 xl:w-80
          ${isOpen ? 'md:relative md:translate-x-0 md:z-0' : 'md:relative md:translate-x-0 md:z-0'}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(24px)',
          borderImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(139, 92, 246, 0.3), rgba(255, 0, 128, 0.3)) 1',
        }}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="relative h-14 w-14 bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-3xl flex items-center justify-center shadow-glow"
                whileHover={{ rotate: 5 }}
              >
                <Gamepad2 className="h-8 w-8 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/30 rounded-3xl"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white font-gaming">FREE FIRE</h1>
                <p className="text-sm text-neon-blue font-semibold">ULTIMATE ARENA</p>
              </div>
            </motion.div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl glass border border-white/20 text-gray-400 hover:text-white hover:border-neon-red/50 transition-all duration-300 md:hidden"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Enhanced User Info */}
          {user && (
            <motion.div 
              className="px-8 py-6 border-b border-white/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="relative h-14 w-14 bg-gradient-to-br from-neon-purple to-electric-blue rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-white font-bold text-lg">
                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg truncate">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-gray-400 text-sm truncate flex items-center space-x-2">
                    <Target className="h-3 w-3" />
                    <span>@{user.username}</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Elite Warrior</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
            
            {isAdmin && (
              <>
                <div className="my-8 px-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1"></div>
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-500/30">
                      <Shield className="h-4 w-4 text-red-400" />
                      <span className="text-red-300 text-xs font-bold uppercase tracking-wide">Admin Zone</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1"></div>
                  </div>
                </div>
                {adminMenuItems.map((item, index) => 
                  renderMenuItem(item, menuItems.length + index)
                )}
              </>
            )}
          </nav>

          {/* Enhanced Footer */}
          <motion.div 
            className="p-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass rounded-2xl p-4 text-center border border-neon-blue/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Flame className="h-4 w-4 text-neon-red animate-pulse" />
                <span className="text-white text-sm font-bold">Free Fire Arena</span>
                <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-xs text-gray-400">Version 2025.1.0</p>
              <p className="text-xs text-gray-500 mt-1">© 2025 Ultimate Gaming</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;