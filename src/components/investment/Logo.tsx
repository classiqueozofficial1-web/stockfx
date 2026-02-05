import { useId, useState } from 'react';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}
export function Logo({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = ''
}: LogoProps) {
  const [isTextVisible, setIsTextVisible] = useState(true);
  const sizes = {
    sm: {
      icon: 'h-10 w-10',
      text: 'text-xl',
      subtitle: 'text-xs'
    },
    md: {
      icon: 'h-12 w-12',
      text: 'text-2xl',
      subtitle: 'text-sm'
    },
    lg: {
      icon: 'h-16 w-16',
      text: 'text-3xl',
      subtitle: 'text-sm'
    },
    xl: {
      icon: 'h-20 w-20',
      text: 'text-4xl',
      subtitle: 'text-sm'
    }
  };
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const uniqueId = useId();
  return (
    <div className={`flex items-center group cursor-pointer ${className}`} onClick={() => setIsTextVisible(!isTextVisible)}>
      <div className={`${sizes[size].icon} relative transition-transform duration-300 ease-out group-hover:scale-105`}>
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-2xl blur-2xl scale-125 opacity-80" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="StockFx logo"
          className="w-full h-full relative z-10 drop-shadow-2xl">

          <defs>
            {/* Black to dark gradient for base */}
            <linearGradient
              id={`${uniqueId}-baseGrad`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">

              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            {/* Gold radiant gradient */}
            <linearGradient
              id={`${uniqueId}-goldGrad`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">

              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Radial glow for center */}
            <radialGradient
              id={`${uniqueId}-radialGlow`}
              cx="50%"
              cy="30%"
              r="60%">

              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            {/* Shine effect */}
            <linearGradient
              id={`${uniqueId}-shine`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">

              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter
              id={`${uniqueId}-shadow`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%">

              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="#F59E0B"
                floodOpacity="0.3" />

            </filter>
          </defs>

          {/* Main shape - rounded square */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill={`url(#${uniqueId}-baseGrad)`} />


          {/* Inner radial glow */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill={`url(#${uniqueId}-radialGlow)`} />


          {/* Gold border accent */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="11"
            fill="none"
            stroke={`url(#${uniqueId}-goldGrad)`}
            strokeWidth="1.5" />


          {/* Shine overlay */}
          <path
            d="M14 3 Q24 3 34 3 Q43 3 44 12 L44 20 Q30 25 14 3 Z"
            fill={`url(#${uniqueId}-shine)`}
            opacity="0.5" />


          {/* SFX Monogram - stylized (bolder strokes + polished accents) */}
          <g filter={`url(#${uniqueId}-shadow)`}>
            <g transform="translate(0,0)">
            {/* S - as rising bars */}
            <path
              d="M9 33 L9 27 L14 27 L14 23 L19 23 L19 18"
              stroke={`url(#${uniqueId}-goldGrad)`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" />


            {/* F - integrated with chart */}
            <path
              d="M20 33 L20 15 M20 15 L29 15 M20 24 L28 24"
              stroke={`url(#${uniqueId}-goldGrad)`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" />


            {/* X - as crossing trend lines */}
            <path
              d="M29 33 L39 15 M29 15 L39 33"
              stroke={`url(#${uniqueId}-goldGrad)`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" />


            {/* Upward arrow accent on top */}
            <path
              d="M34 11 L38 7 L42 11"
              stroke="#FFF7CD"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.95" />


            {/* Small dot accents */}
            <circle cx="38" cy="7" r="1.8" fill="#FFF7CD" opacity="0.95" />

            {/* glossy highlight */}
            <path d="M6 10 C12 6, 36 6, 42 10" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.08" fill="none" />
          </g>
          </g>

          {/* Bottom accent line */}
          <rect
            x="10"
            y="38"
            width="28"
            height="2"
            rx="1"
            fill={`url(#${uniqueId}-goldGrad)`}
            opacity="0.6" />

        </svg>
      </div>

      {showText &&
      <div className="ml-2 overflow-hidden">
          <div className={`flex items-baseline transition-all duration-300 ease-out ${isTextVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <span
            className={`${sizes[size].text} font-extrabold tracking-wide ${textColor} leading-none`}>

              Stock
            </span>
            <span
            className={`${sizes[size].text} font-extrabold tracking-wide ml-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent leading-none drop-shadow-sm`}>

              Fx
            </span>
          </div>
          {size !== 'sm' &&
        <span
          className={`block ${sizes[size].subtitle} uppercase tracking-wider ${variant === 'light' ? 'text-amber-200/80' : 'text-amber-600/80'} font-semibold -mt-1 transition-all duration-300 ease-out ${isTextVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>

              INVESTMENT
            </span>
        }
        </div>
      }
    </div>);

}
// Standalone icon for backgrounds - updated with new style
export function LogoIcon({ className = '' }: {className?: string;}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>

      <defs>
        <linearGradient id="bgLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#bgLogoGrad)" />

      <path
        d="M10 32 L10 28 L14 28 L14 24 L18 24 L18 20"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none" />

      <path
        d="M20 32 L20 16 M20 16 L28 16 M20 23 L26 23"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none" />

      <path
        d="M30 32 L38 16 M30 16 L38 32"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none" />

    </svg>);

}