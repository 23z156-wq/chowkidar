import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-positive)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-sm)]';

  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs min-h-[36px] sm:min-h-[40px]',
    md: 'h-11 px-5 text-sm min-h-[44px]',
    lg: 'h-12 px-6 text-base min-h-[48px]',
  };

  const variantClasses = {
    primary: 'bg-[var(--color-accent-positive)] text-white hover:bg-[#009e76] shadow-sm',
    secondary: 'bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-sm',
    danger: 'bg-[var(--color-accent-negative)] text-white hover:bg-[#d03e43] shadow-sm',
    ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};
