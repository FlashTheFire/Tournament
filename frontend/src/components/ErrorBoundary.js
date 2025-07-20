import React from 'react';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is the FastAPI validation error we're trying to catch
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🔥 CAUGHT FASTAPI VALIDATION ERROR OBJECT:', error);
      console.error('Error info:', errorInfo);
      
      // Log the component stack to see where the error originated
      if (errorInfo.componentStack) {
        console.error('Component stack:', errorInfo.componentStack);
      }
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-container p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-white">
          <h2 className="text-lg font-bold text-red-400 mb-2">Something went wrong.</h2>
          <p className="text-gray-300 text-sm mb-4">
            An error occurred while rendering this component. This has been logged for debugging.
          </p>
          
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer mb-2">Error Details (Development Only)</summary>
              <pre className="whitespace-pre-wrap overflow-auto max-h-40 bg-black/20 p-2 rounded">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;