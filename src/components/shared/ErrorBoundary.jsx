import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service like Sentry here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 my-6 mx-auto max-w-md border border-border bg-card text-card-foreground rounded-xl shadow-md text-center animate-fade-in">
          {/* Warning Icon Graphic */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl mb-4 font-bold">
            !
          </div>

          <h2 className="text-xl font-semibold tracking-tight mb-2">Something went wrong in the UI</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            We encountered a slight rendering glitch inside this panel. Refreshing should restore order.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;