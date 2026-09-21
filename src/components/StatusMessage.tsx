import type { ReactNode } from 'react';

type StatusVariant = 'info' | 'error';

interface StatusMessageProps {
  children: ReactNode;
  variant?: StatusVariant;
}

export default function StatusMessage({ children, variant = 'info' }: StatusMessageProps) {
  const className = variant === 'error' ? 'status-message error' : 'status-message';

  return <div className={className}>{children}</div>;
}