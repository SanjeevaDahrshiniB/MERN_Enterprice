import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/helpers/classnames';

export interface LoaderProps {
  size?: number;
  message?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 28, message, className }) => {
  return (
    <div className={cn('loader-container', className)}>
      <Loader2 size={size} className="animate-spin loader-spinner" />
      {message && <p className="loader-text">{message}</p>}
    </div>
  );
};
