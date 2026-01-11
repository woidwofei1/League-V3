import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center justify-center font-mono">
                    <h1 className="text-3xl text-red-500 mb-4">CRITICAL SYSTEM FAILURE</h1>
                    <div className="bg-black p-6 rounded-lg border border-red-500/50 max-w-3xl w-full overflow-auto">
                        <h2 className="text-xl font-bold mb-2">{this.state.error?.name}: {this.state.error?.message}</h2>
                        <pre className="text-xs text-neutral-400 whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-white font-bold transition-colors"
                    >
                        REBOOT SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
