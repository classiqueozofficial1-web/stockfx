import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclosuresPage } from './pages/DisclosuresPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import './i18n/config';

type Page = 'landing' | 'login' | 'register' | 'verify-email' | 'dashboard' | 'admin' | 'admin-login' | 'privacy' | 'terms' | 'disclosures' | 'cookies';
import { ErrorBoundary } from './components/ErrorBoundary';
import { fetchCurrentUser, setCurrentUserFromProfile } from './lib/session';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);
  
  // Simple hash-based routing handler
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'register') {
        setCurrentPage('register');
      } else if (hash === 'verify-email') {
        setCurrentPage('verify-email');
      } else if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === 'admin') {
        setCurrentPage('admin');
      } else if (hash === 'admin-login') {
        setCurrentPage('admin-login');
      } else {
        setCurrentPage('landing');
      }
    };
    // Initialize based on current hash
    handleHashChange();
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    // Fetch current user from API (if any)
    (async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) setCurrentUserFromProfile(user);
      } catch (e) {
        console.debug('No active session');
      }
    })();
    
    // Hidden keyboard shortcut: Ctrl+Shift+A for admin access
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        setAdminUnlocked(true);
        window.location.hash = 'admin-login';
        console.log('🔐 Admin mode unlocked via keyboard shortcut');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  // Handle logo clicks (5 clicks to unlock admin)
  const handleLogoClick = () => {
    const now = Date.now();
    // Reset if more than 3 seconds have passed
    if (now - lastLogoClickTime > 3000) {
      setLogoClickCount(1);
    } else {
      setLogoClickCount(prev => prev + 1);
    }
    setLastLogoClickTime(now);
    
    // After 5 rapid clicks, unlock admin
    if (logoClickCount + 1 === 5) {
      setAdminUnlocked(true);
      window.location.hash = 'admin-login';
      console.log('🔐 Admin mode unlocked via logo easter egg');
    }
  };
  const navigate = (page: string) => {
    window.location.hash = page === 'landing' ? '' : page;
    // State update happens via the hashchange listener
  };
  const [adminAuthed, setAdminAuthed] = useState(false);
  
  const handleAdminLogout = () => {
    setAdminAuthed(false);
    window.location.hash = 'admin-login';
  };
  
  return (
    <ErrorBoundary>
      {currentPage === 'landing' && <LandingPage onNavigate={navigate} onLogoClick={handleLogoClick} />}
      {currentPage === 'login' && <LoginPage onNavigate={navigate} />}
      {currentPage === 'register' && <RegisterPage onNavigate={navigate} />}
      {currentPage === 'verify-email' && <VerifyEmailPage onNavigate={navigate} />}
      {currentPage === 'dashboard' && <DashboardPage onNavigate={navigate} />}
      {currentPage === 'admin-login' && !adminAuthed && <AdminLoginPage onSuccess={() => { setAdminAuthed(true); setCurrentPage('admin'); window.location.hash = 'admin'; }} />}
      {((currentPage === 'admin-login' && adminAuthed) || currentPage === 'admin') && <AdminPage onLogout={handleAdminLogout} />}
      {currentPage === 'privacy' && <PrivacyPage onNavigate={navigate} />}
      {currentPage === 'terms' && <TermsPage onNavigate={navigate} />}
      {currentPage === 'disclosures' && <DisclosuresPage onNavigate={navigate} />}
      {currentPage === 'cookies' && <CookiePolicyPage onNavigate={navigate} />}
    </ErrorBoundary>);

  }