// Safe toast wrapper to prevent object rendering errors
import toast from 'react-hot-toast';

// Create a safe wrapper that ensures only strings are passed to toast
const safeToast = {
  success: (message) => {
    const safeMessage = typeof message === 'string' ? message : 'Operation successful';
    return toast.success(safeMessage);
  },
  
  error: (message) => {
    let safeMessage = 'An error occurred';
    
    if (typeof message === 'string') {
      safeMessage = message;
    } else if (message && typeof message === 'object') {
      // Handle various object types that might be passed
      if (message.message) {
        safeMessage = String(message.message);
      } else if (message.msg) {
        safeMessage = String(message.msg);
      } else if (message.detail) {
        if (typeof message.detail === 'string') {
          safeMessage = message.detail;
        } else if (Array.isArray(message.detail)) {
          safeMessage = message.detail.map(err => 
            typeof err === 'object' && err.msg ? err.msg : String(err)
          ).join(', ');
        }
      } else {
        safeMessage = JSON.stringify(message);
      }
    }
    
    console.log('🔵 SafeToast: Processing error message:', safeMessage);
    return toast.error(safeMessage);
  },
  
  loading: (message) => {
    const safeMessage = typeof message === 'string' ? message : 'Loading...';
    return toast.loading(safeMessage);
  },
  
  // Pass through other toast methods
  dismiss: toast.dismiss,
  promise: toast.promise,
  custom: toast.custom,
};

export default safeToast;