interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPageNew({ onNavigate }: LandingPageProps) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Welcome to StockFx</h1>
      <p>The next-generation platform for stocks, crypto, and ETFs.</p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => onNavigate('register')} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Get Started
        </button>
        <button onClick={() => onNavigate('login')} style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign In
        </button>
      </div>
    </div>
  );
}
