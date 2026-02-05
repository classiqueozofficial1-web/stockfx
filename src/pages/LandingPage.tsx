 import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, Zap, Shield, Smartphone, Star, Quote, ChevronDown, Mail, X, CheckCircle2, Lock, Users, Globe, Briefcase, Wallet, CreditCard, Cloud, Phone, Activity } from 'lucide-react';
import { Logo } from '../components/investment/Logo';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

type Testimonial = {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
};

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useTranslation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Chen',
      role: 'Day Trader',
      company: 'Independent',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      quote: 'The platform is incredibly fast. My orders execute in milliseconds. Worth every penny.',
      rating: 5,
    },
    {
      name: 'Michael Johnson',
      role: 'Portfolio Manager',
      company: 'Johnson Capital',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      quote: 'Best trading platform I\'ve used. Charts, tools, and support are all top-notch.',
      rating: 5,
    },
    {
      name: 'David Park',
      role: 'Tech Entrepreneur',
      company: 'StartupX',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      quote: 'Security and speed matter for my business. StockFx API integration with fintech tools is seamless.',
      rating: 5,
    },
    {
      name: 'Jessica Rodriguez',
      role: 'Wealth Advisor',
      company: 'Rodriguez & Associates',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'Best platform for managing multi-client portfolios. The reporting tools save me hours daily.',
      rating: 5,
    },
    {
      name: 'James Mitchell',
      role: 'Crypto Investor',
      company: 'Independent',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      quote: 'Seamless crypto trading with the same professional tools as traditional stocks. Highly impressed!',
      rating: 5,
    },
    {
      name: 'Emma Thompson',
      role: 'Financial Analyst',
      company: 'Global Insights',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'The analytics dashboard is phenomenal. Real-time insights that actually help me make better decisions.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How do I get started with StockFx?',
      answer: 'Simply create a free account, complete verification, and fund your account. Start trading within minutes. We also offer a demo account with $100k in virtual funds.',
    },
    {
      question: 'What are the fees?',
      answer: 'Stock and ETF trades are commission-free. Crypto trades: 0.5% fee. Options: $0.65 per contract. No account minimums or hidden fees.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes. Cash is FDIC insured up to $250k, securities protected by SIPC up to $500k. We use 256-bit encryption, 2FA, and cold storage for 95% of assets.',
    },
    {
      question: 'Can I trade on mobile?',
      answer: 'Absolutely! Our full-featured mobile app gives you complete trading, charting, and account management on iOS and Android.',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$1,000 - $5,000',
      description: 'Initial Investment Range',
      duration: '1 Month',
      features: ['Commission-free trades', 'Basic charting tools', 'Mobile app access', '2 watchlists', 'Email support'],
    },
    {
      name: 'Pro',
      price: '$5,000 - $25,000',
      description: 'Growth Investment Range',
      duration: '2-3 Months',
      features: ['Advanced charting & analysis', 'Real-time Level 2 data', 'Unlimited watchlists', 'Priority 24/7 support', 'API access', 'Advanced alerts'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$25,000+',
      description: 'Premium Investment Range',
      duration: '4+ Months',
      features: ['Dedicated portfolio manager', 'Custom strategy consulting', 'White-label solutions', 'Advanced integrations', 'SLA guarantees', 'Institutional pricing'],
    },
  ];

  // Show contact modal every 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setShowContactModal(true);
    }, 120000); // 2 minutes

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo size="md" variant="light" showText={true} />
        </div>
        <div className="flex gap-3 items-center">
          <LanguageSwitcher />
          <button onClick={() => onNavigate('login')} className="px-4 py-2 text-white hover:text-amber-400 transition">{t('nav.signIn')}</button>
          <button onClick={() => onNavigate('register')} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition">{t('nav.getStarted')}</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
          {t('hero.badge')}
        </div>
        <h1 className="text-6xl font-black text-white mb-6 leading-tight">
          {t('hero.title1')}
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{t('hero.title2')}</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onNavigate('register')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-xl transition text-lg">
            {t('hero.startButton')}
          </button>
          <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-white/10 border border-slate-400 text-white rounded-lg font-semibold hover:bg-white/20 transition text-lg">
            {t('hero.signInButton')}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">{t('features.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Zap className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('features.fast.name')}</h3>
            <p className="text-slate-300 text-sm">{t('features.fast.desc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Shield className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('features.security.name')}</h3>
            <p className="text-slate-300 text-sm">{t('features.security.desc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Smartphone className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('features.mobile.name')}</h3>
            <p className="text-slate-300 text-sm">{t('features.mobile.desc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Globe className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('features.global.name')}</h3>
            <p className="text-slate-300 text-sm">{t('features.global.desc')}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">{t('testimonials.title')}</h2>
        <p className="text-center text-slate-300 mb-12">{t('testimonials.subtitle')}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-amber-500/30 mb-3" />
              <p className="text-sm text-slate-300 mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center">
                <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-amber-500/30" />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-4xl font-bold text-amber-400">2M+</p>
          <p className="text-slate-300 mt-2">{t('stats.traders')}</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-amber-400">$500B+</p>
          <p className="text-slate-300 mt-2">{t('stats.assets')}</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-amber-400">0%</p>
          <p className="text-slate-300 mt-2">{t('stats.commission')}</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-amber-400">99.9%</p>
          <p className="text-slate-300 mt-2">{t('stats.uptime')}</p>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">{t('pricing.title')}</h2>
        <p className="text-center text-slate-300 mb-12">{t('pricing.subtitle')}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((plan, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedPlan(expandedPlan === i ? null : i)}
              className={`rounded-xl p-8 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                expandedPlan === i 
                  ? 'ring-2 ring-amber-400 scale-105' 
                  : ''
              } ${plan.popular ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500 shadow-xl' : 'bg-white/5 border-white/10'}`}>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {plan.popular && <div className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold mb-4">{t('pricing.pro.popular')}</div>}
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                </div>
                <ChevronDown className={`h-6 w-6 text-amber-400 transition-transform duration-300 flex-shrink-0 ml-2 ${expandedPlan === i ? 'rotate-180' : ''}`} />
              </div>

              <p className="text-3xl font-black text-amber-400 mb-2">{plan.price}</p>
              <p className="text-sm text-amber-300 font-semibold mb-6">{t('pricing.starter.duration')}: {plan.duration}</p>
              
              <ul className={`space-y-3 overflow-hidden transition-all duration-300 ${expandedPlan === i ? 'mb-8 max-h-96 opacity-100' : 'max-h-96 opacity-100'}`}>
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {expandedPlan === i && (
                <div className="animate-fadeIn pt-4 border-t border-white/10">
                  <p className="text-slate-300 text-sm mb-4">Ready to start your investment journey? Join thousands of successful investors today.</p>
                </div>
              )}

              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  onNavigate('register');
                }} 
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${plan.popular ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {t('pricing.button')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Trusted by Industry Leaders</h2>
        <p className="text-center text-slate-300 mb-16">Powering the world's most innovative trading platforms</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <TrendingUp className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Goldman Sachs</p>
            <p className="text-slate-400 text-xs mt-1">Market Data Partner</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <BarChart3 className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Bloomberg</p>
            <p className="text-slate-400 text-xs mt-1">News & Analytics</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <Briefcase className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Morgan Stanley</p>
            <p className="text-slate-400 text-xs mt-1">Trading Infrastructure</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <Activity className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Nasdaq</p>
            <p className="text-slate-400 text-xs mt-1">Exchange Integration</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <Wallet className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Coinbase</p>
            <p className="text-slate-400 text-xs mt-1">Crypto Exchange</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <CreditCard className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Stripe</p>
            <p className="text-slate-400 text-xs mt-1">Payment Gateway</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <Cloud className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">AWS</p>
            <p className="text-slate-400 text-xs mt-1">Cloud Infrastructure</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition">
            <Phone className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Twilio</p>
            <p className="text-slate-400 text-xs mt-1">Communication API</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-slate-300 mb-12">Everything you need to know about StockFx</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="text-white font-semibold text-left">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-amber-400 transition ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <div className="px-6 pb-4 text-slate-300 border-t border-white/10">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Security */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">{t('trust.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
            <Lock className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('trust.security.name')}</h3>
            <p className="text-slate-300">{t('trust.security.desc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
            <Users className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('trust.insured.name')}</h3>
            <p className="text-slate-300">{t('trust.insured.desc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
            <BarChart3 className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('trust.compliant.name')}</h3>
            <p className="text-slate-300">{t('trust.compliant.desc')}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
        <p className="text-xl text-slate-300 mb-8">{t('cta.subtitle')}</p>
        <button onClick={() => onNavigate('register')} className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-xl transition text-lg">
          {t('cta.button')}
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-6 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 pb-8 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Logo size="md" variant="light" showText={true} />
            </div>
            <p className="text-slate-400 text-sm max-w-xs">The next-generation platform for stocks, crypto, and ETFs. Professional tools. Zero complexity.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-amber-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-amber-400">Pricing</a></li>
                <li><a href="#security" className="hover:text-amber-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#about" className="hover:text-amber-400">About Us</a></li>
                <li><a href="#blog" className="hover:text-amber-400">Blog</a></li>
                <li><a href="#contact" className="hover:text-amber-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/policies/privacy.html" target="_blank" className="hover:text-amber-400">Privacy</a></li>
                <li><a href="/policies/terms.html" target="_blank" className="hover:text-amber-400">Terms</a></li>
                <li><a href="/policies/disclosures.html" target="_blank" className="hover:text-amber-400">Disclosures</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Follow Us</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#twitter" className="hover:text-amber-400">Twitter</a></li>
                <li><a href="#linkedin" className="hover:text-amber-400">LinkedIn</a></li>
                <li><a href="#youtube" className="hover:text-amber-400">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 StockFx Investment Inc. All rights reserved. NMLS #123456</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal - Pops up every 2 mins */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-xl p-8 max-w-sm w-full shadow-2xl animate-bounce">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold text-white">{t('contact.title')}</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-slate-300 mb-6">{t('contact.message')}</p>
            <div className="space-y-3">
              <button onClick={() => { setShowContactModal(false); window.location.href = 'mailto:support@stockfx.com'; }} className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition">
                {t('contact.contact')}
              </button>
              <button onClick={() => setShowContactModal(false)} className="w-full px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition">
                {t('contact.later')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
