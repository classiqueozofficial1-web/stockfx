import React, { useState, Suspense } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from './Logo';
const LanguageModal = React.lazy(() => import('../ui/LanguageModal').then(m => ({ default: m.LanguageModal })) );
interface NavbarProps {
  onNavigate: (page: string) => void;
}
export function Navbar({ onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="cursor-pointer animate-logo-entrance flex items-center gap-3"
            onClick={() => onNavigate('landing')}>

            <Logo size="lg" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">

              Features
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">

              Market Data
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">

              About
            </a>
            <div className="flex items-center space-x-4 ml-4">
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Log In
              </Button>
              <Button onClick={() => onNavigate('register')}>
                Get Started
              </Button>
              <Button variant="ghost" onClick={() => setIsLangOpen(true)}>
                Language
              </Button>
              <Button variant="ghost" onClick={() => {
                // cycle background mode: retentive -> low -> off -> retentive
                try {
                  const cur = (localStorage.getItem('stockfx_bg') || 'retentive');
                  const next = cur === 'retentive' ? 'low' : cur === 'low' ? 'off' : 'retentive';
                  localStorage.setItem('stockfx_bg', next);
                  window.dispatchEvent(new CustomEvent('stockfx:bg-change'));
                } catch (e) {}
              }}>
                BG
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2">

              {isMenuOpen ?
              <X className="h-6 w-6" /> :

              <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Language modal mount and hidden Google Translate div */}
      <Suspense fallback={null}>
        <LanguageModal open={isLangOpen} onClose={() => setIsLangOpen(false)} />
      </Suspense>
      <div id="google_translate_element" className="hidden" />

      {/* Mobile Menu */}
      {isMenuOpen &&
      <div className="md:hidden bg-white border-t border-slate-200 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a
            href="#features"
            className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md">

              Features
            </a>
            <a
            href="#stats"
            className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md">

              Market Data
            </a>
            <a
            href="#about"
            className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md">

              About
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                onNavigate('login');
                setIsMenuOpen(false);
              }}>

                Log In
              </Button>
              <Button
              className="w-full justify-center"
              onClick={() => {
                onNavigate('register');
                setIsMenuOpen(false);
              }}>

                Get Started
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => {
                  setIsLangOpen(true);
                  setIsMenuOpen(false);
                }}>
                Language
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => {
                  try {
                    const cur = (localStorage.getItem('stockfx_bg') || 'retentive');
                    const next = cur === 'retentive' ? 'low' : cur === 'low' ? 'off' : 'retentive';
                    localStorage.setItem('stockfx_bg', next);
                    window.dispatchEvent(new CustomEvent('stockfx:bg-change'));
                    setIsMenuOpen(false);
                  } catch (e) {}
                }}>
                BG
              </Button>
            </div>
          </div>
        </div>
      }
    </nav>);

}