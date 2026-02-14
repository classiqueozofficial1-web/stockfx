import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'gradient';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  shadow = 'md',
  className = '',
  onClick,
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white border-dark-100 hover:border-dark-200',
    ghost: 'bg-transparent border-dark-200 hover:bg-dark-50',
    gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200',
  };

  const shadowClasses = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${shadowClasses[shadow]} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
