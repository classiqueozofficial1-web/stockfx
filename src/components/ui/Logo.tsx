interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', variant = 'dark', showText = true, className = '' }: LogoProps) {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10';
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const bgGradient = variant === 'light' ? 'from-emerald-400 to-emerald-600' : 'from-emerald-600 to-emerald-700';

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="StockFx logo" role="img">
      <div className={`${sizeClass} rounded-lg bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-bold`}>
        SF
      </div>
      {showText && <span className={`font-bold ${textColor}`}>StockFx</span>}
    </div>
  );
}
