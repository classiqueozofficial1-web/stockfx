import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  BarChart3,
  Lock,
  Users,
  Star,
  CheckCircle2,
  Briefcase,
  Quote,
  Mail,
  X,
  Phone,
  Activity,
  Wallet,
  CreditCard,
  Cloud,
  ChevronDown,
} from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Logo } from '../components/investment/Logo';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { FeatureCard } from '../components/ui/FeatureCard';
import { StatCounter } from '../components/ui/StatCounter';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useTranslation();
  
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePartner, setActivePartner] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);



  const testimonials = [
    {
      name: 'Dominic Lee',
      role: 'Day Trader',
      country: 'Singapore',
      flag: '🇸🇬',
      text: 'As a beginner, I was nervous about investing. StockFx\'s educational resources helped me make wiser decisions, and I ended the quarter with profits above my expectations.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=11',
    },
    {
      name: 'Michael Johnson',
      role: 'Portfolio Manager',
      country: 'United States',
      flag: '🇺🇸',
      text: 'I started investing with StockFx six months ago. After learning their strategy tips and sticking to a plan, I saw my portfolio grow steadily. I\'m really happy with the results.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=12',
    },
    {
      name: 'Jessica Rodriguez',
      role: 'Wealth Advisor',
      country: 'Mexico',
      flag: '🇲🇽',
      text: 'I funded my StockFx account with $10,000 after doing my own research and planning my strategy carefully. Over time, by staying disciplined and managing my risk, my portfolio grew significantly. I appreciated having access to market tools and educational resources that helped me make informed decisions. While I understand investing always carries risk, I\'m happy with the progress I\'ve achieved so far.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=47',
    },
    {
      name: 'Emma Thompson',
      role: 'Financial Analyst',
      country: 'United Kingdom',
      flag: '🇬🇧',
      text: 'I opened my StockFx account with $2,000 and committed to a disciplined strategy over several months. Through careful research and calculated trades, my account eventually grew by about 50%, reaching nearly $3,000. I understand markets involve risk, but I\'m proud of the progress I made using the tools and insights available on the platform.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=48',
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
      question: 'Can I invest on mobile?',
      answer: 'Absolutely! Our full-featured mobile app gives you complete investing, charting, and account management on iOS and Android.',
    },
  ];

  const pricing = [
    {
      name: 'Basic Investment',
      price: '$300 - $5,000',
      description: 'Standard Investment Range',
      duration: '1 Month',
      isStandard: true,
      features: ['Commission-free investments', 'Basic charting tools', 'Mobile app access', '2 watchlists', 'Email support'],
    },
    {
      name: 'Premium',
      price: '$5,000 - $50,000',
      description: 'Growth Investment Range',
      duration: '2-3 Months',
      features: ['Advanced charting & analysis', 'Real-time Level 2 data', 'Unlimited watchlists', 'Priority 24/7 support', 'API access', 'Advanced alerts'],
      popular: true,
    },
    {
      name: 'Gold',
      price: '$50,000+',
      description: 'Premium Investment Range',
      duration: '3-6 Months',
      features: ['Dedicated portfolio manager', 'Custom strategy consulting', 'White-label solutions', 'Advanced integrations', 'VIP support', 'Exclusive research'],
    },
    {
      name: 'Annual Investment',
      price: '$100,000+',
      description: 'Institutional Investment Range',
      duration: '12+ Months',
      features: ['Dedicated investment advisor', 'Full portfolio management', 'Custom hedge strategies', '24/7 concierge support', 'Priority execution', 'Exclusive events & networking'],
    },
  ];

  // Show WhatsApp modal every 1 minute
  useEffect(() => {
    const waTimer = setInterval(() => {
      setShowWhatsAppModal(true);
    }, 60000);

    return () => clearInterval(waTimer);
  }, []);

  const handleLogoClick = () => {
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-full mx-auto border-b border-white/10">
        <div className="flex items-center cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0" onClick={handleLogoClick}>
          <Logo size="sm" showText={true} variant="light" />
        </div>
        <div className="hidden md:flex items-center gap-8 lg:gap-10 ml-auto">
          <LanguageSwitcher />
          <AnimatedButton onClick={() => onNavigate('login')} variant="ghost" size="sm">{t('nav.signIn')}</AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="md">{t('nav.getStarted')}</AnimatedButton>
        </div>
        <div className="md:hidden flex items-center gap-2 sm:gap-3 ml-auto">
          <LanguageSwitcher />
          <AnimatedButton onClick={() => onNavigate('login')} variant="ghost" size="sm">{t('nav.signIn')}</AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="sm">Get Started</AnimatedButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
        <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
          <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" />
          {t('hero.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
          {t('hero.title1')}
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{t('hero.title2')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="md">
            {t('hero.startButton')}
          </AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('login')} variant="outline" size="md">
            {t('hero.signInButton')}
          </AnimatedButton>
        </div>
      </section>

      {/* Features Section with Visualization */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-10">{t('features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FeatureCard 
            index={0}
            icon="?" 
            title={t('features.fast.name')} 
            description={t('features.fast.desc')}
            color="amber" />
          <FeatureCard 
            index={1}
            icon="??" 
            title={t('features.security.name')} 
            description={t('features.security.desc')}
            color="blue" />
          <FeatureCard 
            index={2}
            icon="??" 
            title={t('features.mobile.name')} 
            description={t('features.mobile.desc')}
            color="emerald" />
          <FeatureCard 
            index={3}
            icon="??" 
            title={t('features.global.name')} 
            description={t('features.global.desc')}
            color="purple" />
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 sm:mb-6">{t('testimonials.title')}</h2>
        <p className="text-center text-slate-300 mb-12 text-sm sm:text-base">{t('testimonials.subtitle')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group flex flex-col bg-gradient-to-br from-white/5 to-amber-500/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 md:hover:scale-105 md:hover:-translate-y-2"
            >
              {/* Top Section: Photo & Country Info */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-white/10">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-20 w-20 rounded-full object-cover border-3 border-amber-400/50 mb-4 shadow-lg shadow-amber-500/20"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="font-bold text-white text-lg">{testimonial.name}</p>
                    <span className="text-2xl">{testimonial.flag}</span>
                  </div>
                  <p className="text-sm font-semibold text-amber-400">{testimonial.role}</p>
                  <p className="text-xs text-slate-400 mt-1">{testimonial.country}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <div className="mb-6 flex-1">
                <Quote className="h-5 w-5 text-amber-500/40 mb-3" />
                <p className="text-sm text-slate-300 italic leading-relaxed">{testimonial.text}</p>
              </div>

              {/* Bottom Badge */}
              <div className="flex items-center justify-center py-3 px-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <span className="text-xs font-semibold text-amber-300">Verified Investor</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats with Visualizations */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-10">Platform Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCounter label={t('stats.investors')} value="2M+" icon="??" trend="up" />
          <StatCounter label={t('stats.assets')} value="$500B+" icon="??" trend="up" />
          <StatCounter label={t('stats.commission')} value="0%" icon="?" />
          <StatCounter label={t('stats.uptime')} value="99.9%" icon="?" trend="up" />
        </div>
      </section>

      {/* Investment Plans */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Why Choose StockFx?</h2>
        <p className="text-center text-slate-300 mb-12">{t('pricing.subtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricing.map((plan, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedPlan(expandedPlan === i ? null : i)}
              className={`rounded-xl p-6 border transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/50 animate-in fade-in slide-in-from-left-8 ${
                expandedPlan === i 
                  ? 'ring-2 ring-amber-400 scale-105 -translate-y-2 shadow-2xl shadow-amber-500/50' 
                  : ''
              } ${plan.popular ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500 shadow-xl' : plan.isStandard ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: 'both'
              }}>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {plan.popular && <div className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold mb-4">Most Popular</div>}
                  {plan.isStandard && <div className="inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold mb-4">Standard</div>}
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                </div>
                <ChevronDown className={`h-6 w-6 text-amber-400 transition-transform duration-300 flex-shrink-0 ml-2 ${expandedPlan === i ? 'rotate-180' : ''}`} />
              </div>

              <p className="text-3xl font-black text-amber-400 mb-2">{plan.price}</p>
              <p className="text-sm text-amber-300 font-semibold mb-6">Duration: {plan.duration}</p>
              
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

              <AnimatedButton 
                onClick={(e) => { 
                  if (e) e.stopPropagation();
                  onNavigate('register');
                }} 
                variant={plan.popular ? "primary" : "outline"}
                size="md"
                className="w-full">
                {t('pricing.button')}
              </AnimatedButton>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Trusted by Industry Leaders</h2>
        <p className="text-center text-slate-300 mb-16">Powering the world's most innovative trading platforms</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {[
            { name: 'Goldman Sachs', desc: 'Market Data Partner', Icon: TrendingUp },
            { name: 'Bloomberg', desc: 'News & Analytics', Icon: BarChart3 },
            { name: 'Morgan Stanley', desc: 'Trading Infrastructure', Icon: Briefcase },
            { name: 'Nasdaq', desc: 'Exchange Integration', Icon: Activity },
            { name: 'Coinbase', desc: 'Crypto Exchange', Icon: Wallet },
            { name: 'Stripe', desc: 'Payment Gateway', Icon: CreditCard },
            { name: 'AWS', desc: 'Cloud Infrastructure', Icon: Cloud },
            { name: 'Twilio', desc: 'Communication API', Icon: Phone },
          ].map((p, idx) => {
            const Icon = p.Icon as any;
            const active = activePartner === idx;
            return (
              <div
                key={p.name}
                onClick={() => setActivePartner(active ? null : idx)}
                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center transition-transform duration-300 cursor-pointer ${
                  active ? 'transform -translate-y-3 scale-105 ring-2 ring-amber-400 bg-white/10 z-20' : 'hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                <Icon className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                <p className="text-white font-semibold">{p.name}</p>
                <p className="text-slate-400 text-xs mt-1">{p.desc}</p>
                {active && (
                  <div className="mt-4 text-sm text-slate-200 p-3 bg-black/20 rounded">
                    Trusted partner since 2018 � delivering low-latency market data and enterprise-grade integrations with StockFx.
                  </div>
                )}
              </div>
            );
          })}
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
        <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="lg">
          {t('cta.button')}
        </AnimatedButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-6 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 pb-8 border-b border-slate-700">
            <div className="flex items-center gap-1 mb-2">
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
            <p>&copy; 2012 StockFx Investment Inc. All rights reserved. NMLS #5464336</p>
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
              <AnimatedButton onClick={() => { setShowContactModal(false); window.location.href = 'mailto:officialstockfxinvestment@gmail.com'; }} variant="primary" size="md" className="w-full">
                {t('contact.contact')}
              </AnimatedButton>
              <AnimatedButton onClick={() => setShowContactModal(false)} variant="outline" size="md" className="w-full">
                {t('contact.later')}
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
      {/* Floating WhatsApp icon - appears after 1 minute */}
      {showWhatsAppModal && (
        <div className="fixed bottom-6 right-6 z-60 flex flex-col items-end gap-2">
          <button
            onClick={() => window.open('https://wa.me/16462726231?text=Hello%20I%20need%20help%20with%20StockFx%20Investment', '_blank')}
            aria-label="Open WhatsApp"
            title="Chat on WhatsApp"
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-pulse"
          >
            <Phone className="h-6 w-6" />
          </button>
          <button onClick={() => setShowWhatsAppModal(false)} className="text-xs text-slate-300 hover:text-white">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

