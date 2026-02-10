interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPageNew({ onNavigate }: LandingPageProps) {
  return (
    <div className="px-6 py-10 sm:px-8 sm:py-16 text-center font-sans">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome to StockFx</h1>
      <p className="text-sm sm:text-base text-slate-600 mb-6">The next-generation platform for stocks, crypto, and ETFs.</p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => onNavigate('register')} className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:opacity-95">
          Get Started
        </button>
        <button onClick={() => onNavigate('login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:opacity-95">
          Sign In
        </button>
      </div>
    </div>
  );
}
