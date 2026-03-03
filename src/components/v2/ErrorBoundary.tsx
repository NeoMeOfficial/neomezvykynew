import { Component, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
          <AlertCircle className="w-10 h-10 text-[#C27A6E] mb-3" />
          <h3 className="text-[15px] font-semibold text-[#2E2218] mb-1">
            {this.props.fallbackMessage || 'Niečo sa pokazilo'}
          </h3>
          <p className="text-[13px] text-[#8B7560] mb-4">
            Skús to znova alebo sa vráť späť.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-white"
            style={{ background: '#6B4C3B' }}
          >
            <RotateCcw className="w-4 h-4" />
            Skúsiť znova
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
