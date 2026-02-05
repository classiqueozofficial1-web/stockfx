import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console; in production send to monitoring
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl bg-white rounded-xl shadow p-6 border border-red-100">
            <h2 className="text-xl font-bold text-red-700 mb-2">An error occurred</h2>
            <p className="text-sm text-slate-700 mb-4">Something went wrong while rendering the app. The error has been logged to the console.</p>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">{this.state.error?.message}</pre>
            <div className="mt-4 text-right">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
