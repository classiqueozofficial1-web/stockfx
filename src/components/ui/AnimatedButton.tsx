import { ReactNode } from 'react';

interface AnimatedButtonProps {
  onClick?: (e?: any) => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

export function AnimatedButton({
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: AnimatedButtonProps) {
  const baseClass = 'font-semibold rounded-lg transition-all duration-200 active:scale-95';
  
  const sizeClass = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14',
  }[size];

  const variantClass = {
    primary: 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
    secondary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg',
  }[variant];

  return (
    <button 
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
