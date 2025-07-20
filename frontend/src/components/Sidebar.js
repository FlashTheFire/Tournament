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
            <button
              onClick={() => toggleMenu(item.key)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MenuIcon icon={item.icon} isActive={isActive} />
              <span className="flex-1 text-left">{item.title}</span>
              <MenuBadge badge={item.badge} isActive={isActive} />
              <ChevronRight 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          ) : (
            <Link
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MenuIcon icon={item.icon} isActive={isActive} />
              <span className="flex-1">{item.title}</span>
              <MenuBadge badge={item.badge} isActive={isActive} />
            </Link>
          )}
        </motion.div>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 mt-2 space-y-1 overflow-hidden"
            >
              {item.submenu.map((subItem, subIndex) => (
                <motion.div
                  key={subItem.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: subIndex * 0.05 }}
                >
                  <Link
                    to={subItem.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      isActiveLink(subItem.path)
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                    }`}
                  >
                    <subItem.icon className="h-4 w-4" />
                    <span>{subItem.title}</span>
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
        className="fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 md:relative md:translate-x-0 md:z-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GamepadIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Tournament</h1>
                <p className="text-xs text-gray-400">Gaming Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
            
            {isAdmin && (
              <>
                <div className="my-6 px-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                {adminMenuItems.map((item, index) => 
                  renderMenuItem(item, menuItems.length + index)
                )}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center text-xs text-gray-500">
              <p>Tournament Platform v1.0</p>
              <p className="mt-1">© 2025 Gaming Arena</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;