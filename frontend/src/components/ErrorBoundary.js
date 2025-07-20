import React from 'react';

// Safe rendering utility to prevent React child errors
const safeRender = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'object') {
    // Handle FastAPI validation error objects specifically
    if (value.type && value.msg) {
      return value.msg;
    }
    if (value.detail) {
      if (typeof value.detail === 'string') {
        return value.detail;
      }
      if (Array.isArray(value.detail)) {
        return value.detail.map(err => 
          typeof err === 'string' ? err : err.msg || 'Validation error'
        ).join(', ');
      }
      if (value.detail.msg) {
        return value.detail.msg;
      }
    }
    // Last resort - stringify safely
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('🔴 Error info:', errorInfo);
    
    // Handle specific React child error
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🔴 Detected React child rendering error - likely FastAPI validation error object');
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-cosmic-black flex items-center justify-center">
          <div className="glass rounded-2xl p-8 max-w-md mx-4 border border-neon-red/20">
            <div className="text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                🎮 Arena Error
              </h2>
              <p className="text-gray-400 mb-6">
                Something went wrong in the game arena. Our tech team has been notified.
              </p>
              
              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="text-neon-red cursor-pointer mb-2">Technical Details</summary>
                  <pre className="text-xs text-gray-500 bg-black/40 p-3 rounded overflow-auto">
                    {safeRender(this.state.error.toString())}
                  </pre>
                  <pre className="text-xs text-gray-500 bg-black/40 p-3 rounded overflow-auto mt-2">
                    {safeRender(this.state.errorInfo.componentStack)}
                  </pre>
                </details>
              )}
              
              <button
                className="btn-primary px-6 py-2 rounded-lg"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                🔄 Respawn
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { safeRender };