import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: '#F0E6DA' }}>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-[#6B4C3B] mb-4">Niečo sa pokazilo</h1>
            
            <p className="text-[#8B7560] mb-6 text-sm leading-relaxed">
              Aplikácia narazila na neočakávanú chybu. Skús to znovu alebo sa vráť na hlavnú stránku.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="w-full py-3 px-4 bg-[#B8864A] text-white rounded-xl font-medium hover:bg-[#A67640] transition-colors"
              >
                Skúsiť znovu
              </button>
              
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="w-full py-3 px-4 border border-[#B8864A] text-[#B8864A] rounded-xl font-medium hover:bg-[#B8864A] hover:text-white transition-colors"
              >
                Ísť na domovskú stránku
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-[#8B7560] cursor-pointer">Chyba (klikni pre detail)</summary>
                <pre className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.error.stack && '\n' + this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;