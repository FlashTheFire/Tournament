/**
 * Safe toast utility to prevent React rendering errors
 * This ensures that only strings are passed to react-hot-toast
 */

import { toast } from 'react-hot-toast';

const processMessage = (message) => {
  // If already a string, return as is
  if (typeof message === 'string') {
    return message;
  }
  
  // If it's a validation error object from FastAPI
  if (message && typeof message === 'object') {
    // Handle FastAPI validation errors
    if (message.detail) {
      if (Array.isArray(message.detail)) {
        return message.detail.map(err => {
          if (err && typeof err === 'object' && err.msg) {
            return err.msg;
          }
          return typeof err === 'string' ? err : 'Validation error';
        }).join(', ');
      }
      if (typeof message.detail === 'string') {
        return message.detail;
      }
      if (message.detail.msg) {
        return message.detail.msg;
      }
    }
    
    // Handle error objects with common properties
    if (message.message) return message.message;
    if (message.msg) return message.msg;
    if (message.error) return message.error;
    
    // Last resort - try to stringify and extract meaningful info
    try {
      const stringified = JSON.stringify(message);
      return stringified.length > 500 ? 'An error occurred' : stringified;
    } catch {
      return 'An error occurred';
    }
  }
  
  // For any other type, convert to string safely
  return String(message || 'An error occurred');
};

export const safeToast = {
  success: (message) => {
    const safeMessage = processMessage(message);
    toast.success(safeMessage);
  },
  
  error: (message) => {
    const safeMessage = processMessage(message);
    toast.error(safeMessage);
  },
  
  loading: (message) => {
    const safeMessage = processMessage(message);
    return toast.loading(safeMessage);
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};

export default safeToast;