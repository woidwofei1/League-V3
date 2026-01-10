import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorPanelProps {
  title?: string;
  message: string;
  details?: string;
  hints?: string[];
  onRetry?: () => void;
}

export function ErrorPanel({
  title = 'Something went wrong',
  message,
  details,
  hints,
  onRetry,
}: ErrorPanelProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-6">
      <div className="w-full max-w-sm">
        <div className="bg-bg-surface border border-accent-danger/30 rounded-lg p-6">
          {/* Icon and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-danger/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-accent-danger" />
            </div>
            <h2 className="text-headline text-text-primary">{title}</h2>
          </div>

          {/* Main message */}
          <p className="text-body text-text-secondary mb-4">{message}</p>

          {/* Technical details */}
          {details && (
            <div className="mb-4 p-3 bg-bg-elevated rounded-md border border-border-subtle">
              <p className="text-caption text-text-muted font-mono break-all">
                {details}
              </p>
            </div>
          )}

          {/* Diagnostic hints */}
          {hints && hints.length > 0 && (
            <div className="mb-4">
              <p className="text-caption text-text-muted uppercase tracking-wider mb-2">
                Troubleshooting
              </p>
              <ul className="space-y-1">
                {hints.map((hint, i) => (
                  <li key={i} className="text-caption text-text-secondary flex items-start gap-2">
                    <span className="text-accent-cyan">•</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Retry button */}
          {onRetry && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
