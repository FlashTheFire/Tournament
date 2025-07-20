import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Wallet, 
  CheckCircle, 
  X, 
  Loader, 
  Trophy,
  Coins,
  Timer,
  Zap,
  Gift,
  Crown,
  Star
} from 'lucide-react';
import { paytmService } from '../services/PaytmService';
import safeToast from '../utils/safeToast';

const PremiumQRPayment = ({ isOpen, onClose, amount, onSuccess }) => {
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && amount) {
      generateQR();
      startCountdown();
    }
    
    return () => {
      setCountdown(300);
      setProgress(0);
    };
  }, [isOpen, amount]);

  const generateQR = async () => {
    setIsLoading(true);
    setPaymentStatus('generating');
    
    try {
      const result = await paytmService.generatePaymentQR(amount);
      
      if (result.success) {
        setQrData(result);
        setPaymentStatus('waiting');
        startPolling(result.orderId);
        safeToast.success('🎮 QR Code generated! Scan to add battle funds');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('QR Generation failed:', error);
      setPaymentStatus('error');
      safeToast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = async (orderId) => {
    await paytmService.pollPaymentStatus(orderId, (update) => {
      setProgress(update.progress);
      setStatusMessage(update.message);
      
      if (update.status.isPaid) {
        setPaymentStatus('success');
        safeToast.success('🏆 Payment successful! Battle funds added!');
        setTimeout(() => {
          onSuccess && onSuccess(update.status);
          onClose();
        }, 2000);
      }
    });
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'generating':
        return <Loader className="h-8 w-8 text-neon-blue animate-spin" />;
      case 'waiting':
        return <QrCode className="h-8 w-8 text-neon-purple animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-neon-green" />;
      case 'expired':
        return <Timer className="h-8 w-8 text-neon-red" />;
      case 'error':
        return <X className="h-8 w-8 text-red-500" />;
      default:
        return <QrCode className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success': return 'from-neon-green to-emerald-500';
      case 'waiting': return 'from-neon-purple to-electric-purple';
      case 'error': return 'from-red-500 to-red-600';
      case 'expired': return 'from-orange-500 to-red-500';
      default: return 'from-neon-blue to-electric-blue';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gradient-to-br from-cosmic-dark to-cosmic-black rounded-3xl border border-white/20 shadow-2xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: paymentStatus === 'generating' ? 360 : 0 }}
                  transition={{ duration: 2, repeat: paymentStatus === 'generating' ? Infinity : 0, ease: "linear" }}
                  className={`p-3 rounded-xl bg-gradient-to-r ${getStatusColor()}`}
                >
                  {getStatusIcon()}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white font-gaming">Add Battle Funds</h3>
                  <p className="text-gray-400 text-sm">Secure Paytm Payment</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg glass border border-white/20 text-gray-400 hover:text-white hover:border-neon-red/50"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-4 border border-neon-blue/30"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-4 w-4 text-neon-blue" />
                  <span className="text-gray-400 text-sm">Amount</span>
                </div>
                <p className="text-white text-xl font-bold">₹{amount}</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-4 border border-neon-green/30"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Coins className="h-4 w-4 text-neon-green" />
                  <span className="text-gray-400 text-sm">You Get</span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-white text-lg font-bold">{paytmService.amountToCoins(amount)}</p>
                  <span className="text-neon-green text-xs">COINS</span>
                </div>
              </motion.div>
            </div>

            {/* Bonus Display */}
            {paytmService.getBonusPercentage(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 glass rounded-xl p-3 border border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-orange-500/10"
              >
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">
                    {paytmService.getBonusPercentage(amount)}% BONUS COINS!
                  </span>
                  <Crown className="h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
              </motion.div>
            )}
          </div>

          {/* QR Code Section */}
          <div className="p-6">
            {isLoading || paymentStatus === 'generating' ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-white font-semibold mb-2">Generating QR Code...</p>
                <p className="text-gray-400 text-sm">Please wait while we prepare your payment</p>
              </div>
            ) : qrData && paymentStatus === 'waiting' ? (
              <div className="text-center">
                {/* QR Code */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative mb-6"
                >
                  <div className="glass rounded-2xl p-4 border border-white/20 inline-block">
                    <img 
                      src={qrData.qrImage} 
                      alt="Payment QR Code"
                      className="w-48 h-48 rounded-xl"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-neon-blue to-electric-purple rounded-full flex items-center justify-center"
                  >
                    <Zap className="h-4 w-4 text-white" />
                  </motion.div>
                </motion.div>

                {/* Instructions */}
                <div className="space-y-3 mb-6">
                  <p className="text-white font-semibold">Scan QR with any UPI app</p>
                  <p className="text-gray-400 text-sm">
                    Use Paytm, PhonePe, Google Pay, or any UPI app to scan and pay
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Checking payment...</span>
                    <span className="text-neon-blue text-sm font-bold">{formatTime(countdown)}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-neon-blue to-electric-purple"
                    />
                  </div>
                </div>

                {/* Status Message */}
                <motion.p
                  key={statusMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-neon-purple text-sm font-medium"
                >
                  {statusMessage}
                </motion.p>
              </div>
            ) : paymentStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="h-16 w-16 bg-gradient-to-r from-neon-green to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-2xl font-bold text-neon-green mb-2 font-gaming">VICTORY!</h4>
                <p className="text-white font-semibold mb-2">Payment Successful</p>
                <p className="text-gray-400 text-sm">
                  Battle funds have been added to your account
                </p>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-red-400 font-semibold">Payment Failed</p>
                <p className="text-gray-400 text-sm mt-2">Please try again</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateQR}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-neon-blue to-electric-blue rounded-lg text-white font-semibold"
                >
                  Generate New QR
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumQRPayment;