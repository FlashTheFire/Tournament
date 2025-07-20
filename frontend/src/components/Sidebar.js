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

  // Mobile-First Icon Component
  const MenuIcon = ({ icon: Icon, isActive }) => (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`rounded-xl flex items-center justify-center transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-neon-blue to-electric-purple shadow-glow' 
          : 'bg-white/10 group-hover:bg-neon-blue/20'
      }
        /* Mobile: smaller icon container */
        w-8 h-8
        /* Desktop: larger icon container */
        lg:w-10 lg:h-10
      `}
    >
      <Icon className={`${isActive ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors
        /* Mobile: smaller icon */
        h-4 w-4
        /* Desktop: larger icon */
        lg:h-5 lg:w-5
      `} />
    </motion.div>
  );

  // Mobile-First Badge Component
  const MenuBadge = ({ badge, isActive }) => {
    if (!badge) return null;
    
    const isAdmin = badge === 'ADMIN';
    const isCurrency = badge.startsWith('₹');
    const baseClasses = "ml-auto font-bold uppercase tracking-wide rounded-full text-2xs px-2 py-0.5 lg:text-xs lg:px-3 lg:py-1";
    
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
      <div key={item.key} className="mb-1.5 sm:mb-2">
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
              className={`w-full flex items-center font-semibold transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'glass-mobile border border-neon-blue/50 text-white shadow-glow'
                  : 'glass-mobile border border-white/10 text-gray-300 hover:border-neon-blue/30 hover:text-white'
              }
                /* Mobile: extra compact menu item for small screens */
                space-x-2 px-3 py-2.5 rounded-lg text-xs
                /* Small mobile: slightly larger */
                xs:space-x-3 xs:px-4 xs:py-3 xs:rounded-xl xs:text-sm
                /* Tablet: normal sizing */
                sm:text-base
                /* Desktop: spacious menu item */
                lg:space-x-4 lg:px-6 lg:py-4 lg:rounded-2xl
              `}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-electric-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <MenuIcon icon={item.icon} isActive={isActive} />
                <div className="flex-1 text-left relative z-10">
                <p className="font-bold leading-tight
                  /* Mobile: much smaller title for better fit */
                  text-xs
                  /* Small mobile: slightly larger */
                  xs:text-sm
                  /* Tablet: normal size */
                  sm:text-sm
                  /* Desktop: larger title */
                  lg:text-base
                ">{item.title}</p>
                {item.description && (
                  <p className="text-gray-400 mt-0.5 leading-tight
                    /* Mobile: tiny description, hidden if too cramped */
                    text-2xs hidden xs:block
                    /* Small mobile: show with tiny text */
                    xs:text-2xs
                    /* Desktop: small description */
                    lg:text-xs
                  ">{item.description}</p>
                )}
              </div>
              <MenuBadge badge={item.badge} isActive={isActive} />
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
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
                className={`flex items-center font-semibold transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'glass-mobile border border-neon-blue/50 text-white shadow-glow'
                    : 'glass-mobile border border-white/10 text-gray-300 hover:border-neon-blue/30 hover:text-white'
                }
                  /* Mobile: extra compact menu item for small screens */
                  space-x-2 px-3 py-2.5 rounded-lg text-xs
                  /* Small mobile: slightly larger */
                  xs:space-x-3 xs:px-4 xs:py-3 xs:rounded-xl xs:text-sm
                  /* Tablet: normal sizing */
                  sm:text-base
                  /* Desktop: spacious menu item */
                  lg:space-x-4 lg:px-6 lg:py-4 lg:rounded-2xl
                `}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-electric-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <MenuIcon icon={item.icon} isActive={isActive} />
                <div className="flex-1 relative z-10">
                  <p className="font-bold
                    /* Mobile: smaller title */
                    text-sm
                    /* Desktop: larger title */
                    lg:text-base
                  ">{item.title}</p>
                  {item.description && (
                    <p className="text-gray-400 mt-0.5
                      /* Mobile: tiny description */
                      text-2xs
                      /* Desktop: small description */
                      lg:text-xs
                    ">{item.description}</p>
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
              className="overflow-hidden
                /* Mobile: compact submenu spacing */
                ml-4 mt-2 space-y-1
                /* Desktop: spacious submenu spacing */
                lg:ml-6 lg:mt-3 lg:space-y-2
              "
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
                      className={`flex items-center font-medium transition-all duration-300 group relative overflow-hidden ${
                        isActiveLink(subItem.path)
                          ? 'bg-gradient-to-r from-neon-purple/20 to-electric-purple/20 text-white border border-neon-purple/30'
                          : 'glass-mobile border border-white/5 text-gray-400 hover:border-neon-purple/20 hover:text-white'
                      }
                        /* Mobile: compact submenu item */
                        space-x-2 px-3 py-2 rounded-lg
                        /* Desktop: spacious submenu item */
                        lg:space-x-3 lg:px-5 lg:py-3 lg:rounded-xl
                      `}
                    >
                      <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors duration-300
                        /* Mobile: smaller submenu icon */
                        w-6 h-6
                        /* Desktop: larger submenu icon */
                        lg:w-8 lg:h-8
                      ">
                        <subItem.icon className="
                          /* Mobile: smaller icon */
                          h-3 w-3
                          /* Desktop: larger icon */
                          lg:h-4 lg:w-4
                        " />
                      </div>
                      <span className="flex-1
                        /* Mobile: smaller submenu text */
                        text-sm
                        /* Desktop: normal submenu text */
                        lg:text-base
                      ">{subItem.title}</span>
                      {subItem.badge && (
                        <span className="rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-bold
                          /* Mobile: tiny submenu badge */
                          text-2xs px-1.5 py-0.5
                          /* Desktop: small submenu badge */
                          lg:text-xs lg:px-2 lg:py-1
                        ">
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
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile-First Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-full glass-mobile border-r border-white/10 z-50 kinetic-waves
          /* Mobile: much more compact sidebar width - 80% of screen */
          w-[85vw] max-w-72
          /* Small mobile: even more compact */
          xs:w-64
          /* Tablet: medium sidebar width */  
          sm:w-80
          /* Desktop: spacious sidebar - show/hide based on isOpen */
          lg:relative lg:translate-x-0 lg:z-0
          ${isOpen ? 'lg:w-80' : 'lg:w-0 lg:border-r-0'}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(24px)',
          borderImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(139, 92, 246, 0.3), rgba(255, 0, 128, 0.3)) 1',
        }}
      >
        <div className={`flex flex-col h-full relative z-10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
          {/* Mobile-First Header */}
          <div className="flex items-center justify-between border-b border-white/10
            /* Mobile: compact header */
            p-4
            /* Desktop: spacious header */
            lg:p-8
          ">
            <motion.div 
              className="flex items-center space-x-3 lg:space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="relative bg-gradient-to-br from-neon-blue via-electric-purple to-neon-red rounded-3xl flex items-center justify-center shadow-glow
                  /* Mobile: smaller logo */
                  h-10 w-10
                  /* Desktop: larger logo */
                  lg:h-14 lg:w-14
                "
                whileHover={{ rotate: 5 }}
              >
                <Gamepad2 className="text-white
                  /* Mobile: smaller logo icon */
                  h-6 w-6
                  /* Desktop: larger logo icon */
                  lg:h-8 lg:w-8
                " />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/30 rounded-3xl"
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-white font-gaming font-bold
                  /* Mobile: smaller brand text */
                  text-lg
                  /* Desktop: larger brand text */
                  lg:text-2xl
                ">FREE FIRE</h1>
                <p className="text-neon-blue font-semibold
                  /* Mobile: smaller tagline */
                  text-xs
                  /* Desktop: larger tagline */
                  lg:text-sm
                ">ULTIMATE ARENA</p>
              </div>
            </motion.div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="glass-mobile border border-white/20 text-gray-400 hover:text-white hover:border-neon-red/50 transition-all duration-300 lg:hidden
                /* Mobile: smaller close button */
                p-2 rounded-lg
                /* Tablet: larger close button */
                sm:p-3 sm:rounded-xl
              "
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </div>

          {/* Mobile-First User Info */}
          {user && (
            <motion.div 
              className="border-b border-white/10
                /* Mobile: compact user section */
                px-4 py-4
                /* Desktop: spacious user section */
                lg:px-8 lg:py-6
              "
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <motion.div 
                  className="relative bg-gradient-to-br from-neon-purple to-electric-blue rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-glow
                    /* Mobile: smaller avatar */
                    h-10 w-10
                    /* Desktop: larger avatar */
                    lg:h-14 lg:w-14
                  "
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-white font-bold
                    /* Mobile: smaller avatar text */
                    text-sm
                    /* Desktop: larger avatar text */
                    lg:text-lg
                  ">
                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full border-2 border-white animate-pulse
                    /* Mobile: smaller status dot */
                    w-3 h-3
                    /* Desktop: larger status dot */
                    lg:w-5 lg:h-5
                  "></div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate
                    /* Mobile: smaller name */
                    text-sm
                    /* Desktop: larger name */
                    lg:text-lg
                  ">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-gray-400 truncate flex items-center space-x-1
                    /* Mobile: smaller username */
                    text-xs
                    /* Desktop: larger username */
                    lg:text-sm
                  ">
                    <Target className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                    <span>@{user.username}</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold uppercase tracking-wide
                      /* Mobile: tiny status */
                      text-2xs
                      /* Desktop: small status */
                      lg:text-xs
                    ">Elite Warrior</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile-First Menu Items */}
          <nav className="flex-1 overflow-y-auto
            /* Mobile: compact menu padding */
            px-3 py-4 space-y-1
            /* Desktop: spacious menu padding */
            lg:px-6 lg:py-6 lg:space-y-3
          ">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
            
            {isAdmin && (
              <>
                <div className="my-6 px-2 lg:my-8 lg:px-4">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent flex-1"></div>
                    <div className="flex items-center space-x-1 lg:space-x-2 px-2 py-1 lg:px-3 lg:py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-500/30">
                      <Shield className="h-3 w-3 lg:h-4 lg:w-4 text-red-400" />
                      <span className="text-red-300 font-bold uppercase tracking-wide
                        /* Mobile: tiny admin label */
                        text-2xs
                        /* Desktop: small admin label */
                        lg:text-xs
                      ">Admin Zone</span>
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

          {/* Mobile-First Footer */}
          <motion.div 
            className="border-t border-white/10
              /* Mobile: compact footer */
              p-4
              /* Desktop: spacious footer */
              lg:p-6
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-mobile rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center border border-neon-blue/20">
              <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1 lg:mb-2">
                <Flame className="h-3 w-3 lg:h-4 lg:w-4 text-neon-red animate-pulse" />
                <span className="text-white font-bold
                  /* Mobile: smaller brand name */
                  text-xs
                  /* Desktop: larger brand name */
                  lg:text-sm
                ">Free Fire Arena</span>
                <Star className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-400
                /* Mobile: tiny version */
                text-2xs
                /* Desktop: small version */
                lg:text-xs
              ">Version 2025.1.0</p>
              <p className="text-gray-500 mt-0.5 lg:mt-1
                /* Mobile: tiny copyright */
                text-2xs
                /* Desktop: small copyright */
                lg:text-xs
              ">© 2025 Ultimate Gaming</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;