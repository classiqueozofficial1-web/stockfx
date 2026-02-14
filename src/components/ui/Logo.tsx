interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', variant = 'dark', showText = true, className = '' }: LogoProps) {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10';
  const textColor = variant === 'light' ? 'text-white' : 'text-dark-950';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold`}>
        SF
      </div>
      {showText && <span className={`font-bold ${textColor}`}>StockFx</span>}
    </div>
  );
}
