
import { useEffect, useRef, useState } from 'react';
import { LogoIcon } from './Logo';
interface AnimatedBackgroundProps {
  variant?: 'light' | 'dark';
  density?: 'low' | 'medium' | 'high';
  intensity?: 'low' | 'medium' | 'high' | 'retentive';
}
export function AnimatedBackground({
  variant = 'light',
  density = 'medium',
  intensity = 'medium'
}: AnimatedBackgroundProps) {
  const colorClass = variant === 'dark' ? 'text-white' : 'text-emerald-600';
  const densityConfig = {
    low: 8,
    medium: 15,
    high: 24
  };
  const logoCount = densityConfig[density];

  // Respect prefers-reduced-motion and a user setting stored in localStorage
  const [bgMode, setBgMode] = useState<'off' | 'low' | 'retentive'>(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'off';
      }
    } catch (e) {
      // ignore
    }
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('stockfx_bg') as 'off' | 'low' | 'retentive' | null) : null;
    if (saved) return saved;
    return intensity === 'retentive' ? 'retentive' : 'low';
  });

  useEffect(() => {
    const onStorage = () => {
      const saved = (localStorage.getItem('stockfx_bg') as 'off' | 'low' | 'retentive' | null);
      setBgMode(saved || (intensity === 'retentive' ? 'retentive' : 'low'));
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('stockfx:bg-change', onStorage as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('stockfx:bg-change', onStorage as EventListener);
    };
  }, [intensity]);
  // Generate random but consistent positions
  const logos = Array.from(
    {
      length: logoCount
    },
    (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      size: 40 + (i % 4) * 20,
      delay: (i * 0.8) % 8,
      duration: 15 + (i % 5) * 5,
      direction: i % 2 === 0 ? 'normal' : 'reverse'
    })
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax effect based on pointer movement (disabled if bgMode is 'off')
  useEffect(() => {
    if (!wrapperRef.current) return;
    if (bgMode === 'off') {
      // reset transform
      wrapperRef.current.style.transform = '';
      return;
    }
    const el = wrapperRef.current;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      const factor = bgMode === 'retentive' ? 10 : 3;
      const tx = x * factor;
      const ty = y * factor;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [bgMode]);

  // Canvas particle system (activated only when bgMode === 'retentive')
  useEffect(() => {
    if (bgMode !== 'retentive') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const devicePixelRatio = window.devicePixelRatio || 1;
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = Math.round(innerWidth * devicePixelRatio);
      canvas.height = Math.round(innerHeight * devicePixelRatio);
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const initParticles = () => {
      const count = 100; // retentive -> many particles
      particles = Array.from({ length: count }, () => {
        const speed = 0.3 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * canvas.width / devicePixelRatio,
          y: Math.random() * canvas.height / devicePixelRatio,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 0.6 + Math.random() * 2.4
        };
      });
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // particles
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = width;
        if (p.x > width + 10) p.x = 0;
        if (p.y < -10) p.y = height;
        if (p.y > height + 10) p.y = 0;

        // draw
        ctx.beginPath();
        ctx.fillStyle = variant === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(16,185,129,0.55)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // lines between nearby particles
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max = 120 * 120;
          if (d2 < max) {
            const alpha = 0.1 * (1 - d2 / max);
            ctx.strokeStyle = variant === 'dark' ? `rgba(255,255,255,${alpha})` : `rgba(16,185,129,${alpha})`;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      initParticles();
    };

    resize();
    initParticles();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [bgMode, variant]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Canvas for retentive particle effect */}
      <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${bgMode === 'retentive' ? 'z-0' : 'hidden'}`} />

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 ${variant === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50/30'} ${bgMode === 'off' ? '' : 'opacity-90'}`} />

      {/* Damping overlay to reduce visual intensity when enabled */}
      {bgMode !== 'off' && (
        <div className={`absolute inset-0 pointer-events-none ${variant === 'dark' ? 'bg-black/6' : 'bg-white/10'}`} />
      )}


      {/* Animated logos */}
      {logos.map((logo) =>
      <div
        key={logo.id}
        className={`absolute ${colorClass}`}
        style={{
          left: logo.left,
          top: logo.top,
          width: logo.size,
          height: logo.size,
          animation: `float-${logo.id % 3} ${logo.duration}s ease-in-out infinite`,
          animationDelay: `${logo.delay}s`,
          animationDirection: logo.direction
        }}>

          <LogoIcon className="w-full h-full" />
        </div>
      )}

      {/* Additional ambient elements */}
      <div
        className={`absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-3xl ${variant === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-400/20'}`}
        style={{
          animation: 'pulse-slow 8s ease-in-out infinite',
          zIndex: 0
        }} />

      <div
        className={`absolute bottom-1/4 -left-20 w-80 h-80 rounded-full blur-3xl ${variant === 'dark' ? 'bg-teal-500/10' : 'bg-teal-400/15'}`}
        style={{
          animation: 'pulse-slow 10s ease-in-out infinite',
          animationDelay: '2s',
          zIndex: 0
        }} />


      {/* Grid pattern overlay */}
      <div
        className={`absolute inset-0 opacity-[0.02] ${variant === 'dark' ? 'invert' : ''}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

    </div>);
}
