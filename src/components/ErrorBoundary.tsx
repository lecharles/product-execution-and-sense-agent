/**
 * Error Boundary Component - Comprehensive Error Handling
 * 
 * This component provides application-wide error handling to prevent complete app crashes
 * when JavaScript errors occur in the component tree. It offers:
 * 
 * Features:
 * - Catches JavaScript errors anywhere in the child component tree
 * - Displays fallback UI instead of crashing the entire application
 * - Provides error recovery options (retry, reload)
 * - Shows detailed error information in development mode
 * - Logs errors for debugging and monitoring
 * - Graceful error handling with professional UI
 * 
 * Usage:
 * - Wrap your app or major sections in <ErrorBoundary>
 * - Optionally provide custom fallback UI via the fallback prop
 * - Works with both class and functional components
 * 
 * Architecture:
 * - Class component (required for error boundaries in React)
 * - Companion hook for functional component error handling
 * - Integration with shadcn/ui components for consistent styling
 * 
 * Created: Day 2 - State Management & Error Handling Implementation
 * Author: PM Interview Practice Agent Development Team
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error Boundary Props Interface
 */
interface Props {
  children: ReactNode; // Child components to wrap and protect
  fallback?: ReactNode; // Optional custom fallback UI (defaults to built-in error UI)
}

/**
 * Error Boundary State Interface
 */
interface State {
  hasError: boolean; // Whether an error has been caught
  error?: Error; // The actual error object (for debugging)
  errorInfo?: ErrorInfo; // React error info with component stack
}

/**
 * Error Boundary Class Component
 * 
 * React Error Boundaries must be class components as they use lifecycle methods
 * that are not available in functional components (componentDidCatch, getDerivedStateFromError)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Initialize with no error state
    this.state = { hasError: false };
  }

  /**
   * Static method called when an error is thrown during rendering
   * This is used to update state so the next render shows the fallback UI
   * @param error - The error that was thrown
   * @returns New state object indicating an error occurred
   */
  static getDerivedStateFromError(error: Error): State {
    // Update state to trigger fallback UI on next render
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught
   * Used for logging errors and updating state with additional error info
   * @param error - The error that was thrown
   * @param errorInfo - React-specific error information including component stack
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging and monitoring
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with detailed error information
    this.setState({ error, errorInfo });
  }

  /**
   * Reset Error State
   * Allows user to attempt recovery by clearing the error state
   */

  handleReset = () => {
    // Clear error state to attempt recovery
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  /**
   * Force Page Reload
   * Nuclear option - reload the entire page to recover from persistent errors
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Render Method
   * Returns either the fallback UI (if error) or normal children (if no error)
   */

  render() {
    // If an error has been caught, show fallback UI
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Error UI - Professional error display with recovery options
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            {/* Error Header with Icon */}
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. This has been logged and we're looking into it.
              </CardDescription>
            </CardHeader>
            
            {/* Error Details (Development Only) */}
            <CardContent>
              {/* Show detailed error information only in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Error Details (Development Only)</h4>
                  <pre className="text-xs text-muted-foreground overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </CardContent>

            {/* Recovery Action Buttons */}
            <CardFooter className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

/**
 * Error Handler Hook for Functional Components
 * 
 * This hook provides error handling capabilities to functional components
 * that can't use Error Boundaries directly. When an error is set via handleError,
 * it will be thrown and caught by the nearest Error Boundary.
 * 
 * Usage:
 * const { handleError, resetError } = useErrorHandler();
 * 
 * try {
 *   // risky operation
 * } catch (error) {
 *   handleError(error);
 * }
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  // Reset error state
  const resetError = () => setError(null);

  // Handle error by logging and setting state
  const handleError = React.useCallback((error: Error) => {
    console.error('Error handled:', error);
    setError(error);
  }, []);

  // Throw error if one is set (will be caught by Error Boundary)
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};