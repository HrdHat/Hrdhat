import React, { Component, ErrorInfo, ReactNode } from "react";
import { FLRASessionManager } from "../utils/flrasessionmanager";
import "../styles/errorboundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class FormErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Clear any stored errors
    FLRASessionManager.clearErrors();

    // Call custom reset handler if provided
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Check for stored validation/system errors
      const storedErrors = FLRASessionManager.getErrors();

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>

            {storedErrors.length > 0 && (
              <div className="stored-errors">
                <h3>Storage Errors:</h3>
                <ul>
                  {storedErrors.map((error, index) => (
                    <li key={index} className={`error-item ${error.type}`}>
                      <strong>{error.type}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {this.state.error && (
              <div className="error-details">
                <h3>Error Details:</h3>
                <pre>{this.state.error.toString()}</pre>
              </div>
            )}

            <div className="error-actions">
              <button onClick={this.handleReset} className="reset-button">
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
