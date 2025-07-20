import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

// Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetails from './pages/TournamentDetails';
import Leaderboards from './pages/Leaderboards';
import Wallet from './pages/Wallet';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AIAnalytics from './pages/AIAnalytics';
import HamburgerDemo from './pages/HamburgerDemo';
import AdvancedGaming from './pages/AdvancedGaming';
import DemoAccess from './pages/DemoAccess';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';
import AdminTournaments from './pages/admin/AdminTournaments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Hooks
import { useAuth } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-cosmic-black via-cosmic-dark to-cosmic-deep relative overflow-hidden">
          {/* Advanced Particle Background */}
          <ParticleBackground />
          
          {/* Premium Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.1)',
                }
              },
              error: {
                style: {
                  border: '1px solid rgba(255, 0, 128, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 0, 128, 0.1)',
                }
              },
            }}
          />
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  // Premium loading animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <motion.div className="text-center">
          {/* Animated Logo/Brand */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-neon-blue to-electric-purple rounded-2xl flex items-center justify-center shadow-glow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl font-bold text-white"
            >
              🎮
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white mb-4 font-gaming"
          >
            FREE FIRE ARENA
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mb-8"
          >
            Loading the ultimate gaming experience...
          </motion.p>

          {/* Advanced Loading Spinner */}
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-neon-blue/30 border-t-neon-blue rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-electric-purple/30 border-t-electric-purple rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative z-10">
      {user && (
        <>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 overflow-auto p-4 md:p-8 relative">
              {/* Page Transition Overlay */}
              <AnimatePresence>
                {pageTransition && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-gradient-to-br from-cosmic-black/90 to-cosmic-deep/90 backdrop-blur-sm z-50 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-white font-medium">Transitioning...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  } />
                  <Route path="/tournaments" element={
                    <motion.div
                      key="tournaments"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Tournaments />
                    </motion.div>
                  } />
                  <Route path="/tournaments/:id" element={
                    <motion.div
                      key="tournament-details"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TournamentDetails />
                    </motion.div>
                  } />
                  <Route path="/leaderboards" element={
                    <motion.div
                      key="leaderboards"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Leaderboards />
                    </motion.div>
                  } />
                  <Route path="/wallet" element={
                    <motion.div
                      key="wallet"
                      initial={{ opacity: 0, rotateY: -10 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Wallet />
                    </motion.div>
                  } />
                  <Route path="/support" element={
                    <motion.div
                      key="support"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Support />
                    </motion.div>
                  } />
                  <Route path="/settings" element={
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Settings />
                    </motion.div>
                  } />
                  <Route path="/dashboard" element={
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  } />
                  <Route path="/advanced-gaming" element={
                    <motion.div
                      key="advanced-gaming"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AdvancedGaming />
                    </motion.div>
                  } />
                  {user.is_admin && (
                    <>
                      <Route path="/admin" element={
                        <motion.div
                          key="admin"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AdminPanel />
                        </motion.div>
                      } />
                      <Route path="/admin/tournaments" element={<AdminTournaments />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    </>
                  )}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </>
      )}
      
      {!user && (
        <div className="w-full">
          <Routes>
            <Route path="/login" element={
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            } />
            <Route path="/register" element={
              <motion.div
                key="register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <Register />
              </motion.div>
            } />
            <Route path="/demo" element={
              <motion.div
                key="demo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <DemoAccess />
              </motion.div>
            } />
            <Route path="/hamburger-demo" element={
              <motion.div
                key="hamburger-demo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <HamburgerDemo />
              </motion.div>
            } />
            <Route path="*" element={<Navigate to="/demo" replace />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;