import { Component, type ReactNode } from "react";

function FallbackScreen({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-background p-8 text-center text-white"
    >
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted">
          The app encountered an unexpected error. You can try reloading.
        </p>
        <button
          onClick={onReset}
          className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppCrashFallback extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  private handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <FallbackScreen onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
