import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...rest }) => {
  const baseClasses =
    'bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] transition-all duration-150';
  const padding = noPadding ? '' : 'p-5 sm:p-6';

  return (
    <div className={`${baseClasses} ${padding} ${className}`} {...rest}>
      {children}
    </div>
  );
};
