interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function Alert({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 text-sm font-medium text-red-400 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          Try again
        </button>
      )}
    </div>
  );
}
