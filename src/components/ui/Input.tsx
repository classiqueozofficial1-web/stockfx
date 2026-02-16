import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  size = 'md',
  ...props
}: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-dark-800 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-xl border-2 transition-all duration-200
            text-dark-900 placeholder-dark-400 
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${sizeStyles[size]}
            ${
              error
                ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-500 focus:ring-2'
                : 'border-dark-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-dark-300'
            }
            disabled:bg-dark-100 disabled:text-dark-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-dark-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-dark-500">{helperText}</p>
      )}
    </div>
  );
}