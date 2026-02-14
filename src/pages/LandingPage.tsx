import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  BarChart3,
  Lock,
  Users,
  Zap,
  Globe,
  ArrowRight,
  Star,
  CheckCircle2,
  BriefcaseIcon,
  ChartCandlestick,
  Target,
  Smartphone,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Order execution in milliseconds with advanced order routing.',
      color: 'primary',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Bank-Level Security',
      description: '256-bit encryption, 2FA, and 95% cold storage assets.',
      color: 'accent',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile Trading',
      description: 'Full-featured trading app available on iOS and Android.',
      color: 'primary',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Markets',
      description: 'Access stocks, crypto, forex, and commodities worldwide.',
      color: 'accent',
    },
    {
      icon: <ChartCandlestick className="w-6 h-6" />,
      title: 'Pro Tools',
      description: 'Advanced charting, technical analysis, and backtesting.',
      color: 'primary',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Support',
      description: '24/7 professional support from experienced traders.',
      color: 'accent',
    },
  ];

  const testimonials = [
    {
      name: 'Dominic Lee',
      role: 'Day Trader',
      text: 'The fastest execution speeds I\'ve experienced. Asset orders fill in milliseconds.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=11',
    },
    {
      name: 'Michael Johnson',
      role: 'Portfolio Manager',
      text: 'Best platform I\'ve ever used. The tools, support, and execution are top-tier.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=12',
    },
    {
      name: 'Jessica Rodriguez',
      role: 'Wealth Advisor',
      text: 'Perfect for managing multi-client portfolios. Reports save me hours daily.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=14',
    },
    {
      name: 'Emma Thompson',
      role: 'Financial Analyst',
      text: 'The analytics dashboard is phenomenal. Real-time insights that help decisions.',
      rating: 5,
      image: 'https://i.pravatar.cc/200?img=16',
    },
  ];

  const stats = [
    { label: 'Active Traders', value: '2M+' },
    { label: 'Assets Under Trading', value: '$500B+' },
    { label: 'Commission Free Trades', value: '100%' },
    { label: 'Uptime Guarantee', value: '99.9%' },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for beginners',
      features: [
        'Commission-free stocks & ETFs',
        'Basic charting tools',
        'Mobile app access',
        '2 watchlists',
        'Email support',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: 'From $99/mo',
      description: 'For active traders',
      features: [
        'Everything in Starter',
        'Level 2 market data',
        'Advanced charting & analysis',
        'Unlimited watchlists',
        '24/7 priority support',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For institutions',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solutions',
        'SLA guarantees',
        'Institutional pricing',
      ],
      cta: 'Contact Sales',
    },
  ];

  return (
    <div className="bg-white">
      {/* Fixed Header */}
      <Header />

      {/* Main Content with padding for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-10 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl -z-10"></div>

          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 animate-slideInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-dark-950">Powerful Features For</span>
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Every Trader
                </span>
              </h2>
              <p className="text-lg text-dark-600 max-w-2xl mx-auto">
                Everything you need to trade smarter, faster, and more profitably.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border border-dark-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    feature.color === 'primary'
                      ? 'bg-primary-100 group-hover:bg-primary-600 text-primary-600 group-hover:text-white'
                      : 'bg-accent-100 group-hover:bg-accent-600 text-accent-600 group-hover:text-white'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-dark-950 mb-3">{feature.title}</h3>
                  <p className="text-dark-600 group-hover:text-dark-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 md:py-32 bg-gradient-to-r from-primary-900 to-accent-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-slideInUp">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Trusted by Millions Worldwide
              </h2>
              <p className="text-lg text-primary-100">
                Join traders who are changing their financial futures
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-200 to-accent-200 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <p className="text-primary-100 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl -z-10"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slideInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-dark-950">What Our Traders Say</span>
              </h2>
              <p className="text-lg text-dark-600 max-w-2xl mx-auto">
                Real reviews from real traders who trust StockFx
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white border border-dark-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-dark-950">{testimonial.name}</h4>
                      <p className="text-sm text-dark-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-dark-700 italic">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 md:py-32 bg-dark-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-slideInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-dark-950">Simple, Transparent Pricing</span>
              </h2>
              <p className="text-lg text-dark-600 max-w-2xl mx-auto">
                Choose the plan that fits your trading style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-3xl border-2 transition-all duration-300 ${
                    plan.popular
                      ? 'border-primary-600 bg-white shadow-2xl scale-105 md:scale-100 md:z-10'
                      : 'border-dark-100 bg-white hover:shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-dark-950 mb-2">{plan.name}</h3>
                    <p className="text-dark-600 text-sm mb-6">{plan.description}</p>

                    <div className="mb-8">
                      <div className="text-4xl font-bold text-dark-950">{plan.price}</div>
                      {plan.price !== 'Custom' && (
                        <p className="text-dark-600 text-sm">per month</p>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate('register')}
                      className={`w-full h-12 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                          : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {plan.cta}
                    </button>

                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-dark-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-10 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-slideInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-dark-950">Ready to Start Trading?</span>
              </h2>
              <p className="text-lg text-dark-600 mb-8">
                Join thousands of successful traders. Open your account in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('register')}
                  className="h-12 px-8 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="h-12 px-8 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>

              <p className="text-dark-600 text-sm mt-6">
                No credit card required. Start with a free trading account.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
    'from-slate-900 via-slate-800 to-slate-900',
    'from-indigo-900 via-purple-900 to-slate-900',
    'from-slate-900 via-blue-900 to-slate-900',
    'from-slate-900 via-green-900 to-slate-900',
    'from-slate-900 via-rose-900 to-slate-900',
  ];

  const testimonials: Testimonial[] = [  
    {
      name: 'Dominic Lee',
      role: 'Day Investor',
      company: 'Independent',
      image: 'https://i.pravatar.cc/200?img=11',
      quote: 'The platform is incredibly fast. My orders execute in milliseconds. Worth every penny.',
      rating:  5,
    },
    {
      name: 'Michael Johnson',
      role: 'Portfolio Manager',
      company: 'Johnson Capital',
      image: 'https://i.pravatar.cc/200?img=12',
      quote: 'Best trading platform I\'ve used. Charts, tools, and support are all top-notch.',
      rating: 5,
    },
    {
      name: 'David Park',
      role: 'Tech Entrepreneur',
      company: 'StartupX',
      image: 'https://i.pravatar.cc/200?img=13',
      quote: 'Security and speed matter for my business. StockFx API integration with fintech tools is seamless.',
      rating: 5,
    },
    {
      name: 'Jessica Rodriguez',
      role: 'Wealth Advisor',
      company: 'Rodriguez & Associates',
      image: 'https://i.pravatar.cc/200?img=14',
      quote: 'Best platform for managing multi-client portfolios. The reporting tools save me hours daily.',
      rating: 5,
    },
    {
      name: 'James Mitchell',
      role: 'Crypto Investor',
      company: 'Independent',
      image: 'https://i.pravatar.cc/200?img=15',
      quote: 'Seamless crypto trading with the same professional tools as traditional stocks. Highly impressed!',
      rating: 5,
    },
    {
      name: 'Emma Thompson',
      role: 'Financial Analyst',
      company: 'Global Insights',
      image: 'https://i.pravatar.cc/200?img=16',
      quote: 'The analytics dashboard is phenomenal. Real-time insights that actually help me make better decisions.',
      rating: 5,
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

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
      name: 'Starter',
      price: '$1,000 - $5,000',
      description: 'Initial Investment Range',
      duration: '1 Month',
      features: ['Commission-free investments', 'Basic charting tools', 'Mobile app access', '2 watchlists', 'Email support'],
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

  const [activePartner, setActivePartner] = useState<number | null>(null);


  // Show contact modal every 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setShowContactModal(true);
    }, 120000); // 2 minutes

    return () => clearInterval(timer);
  }, []);

  // Rotate background gradient every 5 seconds
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgroundGradients.length);
    }, 5000);

    return () => clearInterval(bgTimer);
  }, [backgroundGradients.length]);

  // Show WhatsApp modal every 1 minute
  useEffect(() => {
    const waTimer = setInterval(() => {
      setShowWhatsAppModal(true);
    }, 60000); // 1 minute

    return () => clearInterval(waTimer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradients[backgroundIndex]} transition-all duration-1000 ease-in-out`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 max-w-7xl mx-auto">
        <div className="hidden md:flex items-center gap-1 sm:gap-2 cursor-pointer" onClick={handleLogoClick}>
          <Logo size="sm" variant="light" showText={false} />
        </div>
        <div className="hidden md:flex gap-2 items-center">
          <LanguageSwitcher />
          <AnimatedButton onClick={() => onNavigate('login')} variant="ghost" size="sm">{t('nav.signIn')}</AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="md">{t('nav.getStarted')}</AnimatedButton>
        </div>
        <div className="md:hidden flex gap-2 items-center">
          <div className="flex items-center justify-center w-full cursor-pointer" onClick={handleLogoClick}>
            <Logo size="md" variant="light" showText={true} className="max-w-[220px]" />
          </div>
          <LanguageSwitcher />
          <AnimatedButton onClick={() => onNavigate('login')} variant="ghost" size="sm">{t('nav.signIn')}</AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="sm">Get Started</AnimatedButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20 text-center">
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium mb-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 mr-1 animate-pulse" />
          {t('hero.badge')}
        </div>
        <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 sm:mb-4 leading-tight">
          {t('hero.title1')}
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{t('hero.title2')}</span>
        </h1>
        <p className="hero-desc text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <AnimatedButton onClick={() => onNavigate('register')} variant="primary" size="md" className="hero-cta">
            {t('hero.startButton')}
          </AnimatedButton>
          <AnimatedButton onClick={() => onNavigate('login')} variant="outline" size="md" className="hero-cta">
            {t('hero.signInButton')}
          </AnimatedButton>
        </div>

        {/* Background Carousel Indicators */}
        <div className="flex gap-1 justify-center mt-6 sm:mt-8">
          {backgroundGradients.map((_, index) => (
            <button
              key={index}
              onClick={() => setBackgroundIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                backgroundIndex === index ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Background ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section with Visualization */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-10">{t('features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FeatureCard 
            icon="?" 
            title={t('features.fast.name')} 
            description={t('features.fast.desc')}
            color="amber" />
          <FeatureCard 
            icon="??" 
            title={t('features.security.name')} 
            description={t('features.security.desc')}
            color="blue" />
          <FeatureCard 
            icon="??" 
            title={t('features.mobile.name')} 
            description={t('features.mobile.desc')}
            color="emerald" />
          <FeatureCard 
            icon="??" 
            title={t('features.global.name')} 
            description={t('features.global.desc')}
            color="purple" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-2">{t('testimonials.title')}</h2>
        <p className="text-center text-slate-300 mb-8 text-xs sm:text-sm">{t('testimonials.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              onClick={() => setActiveTestimonial(activeTestimonial === i ? null : i)}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-transform duration-300 cursor-pointer ${
                activeTestimonial === i ? '-translate-y-3 scale-105 ring-2 ring-amber-400 z-20' : 'hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-amber-500/30 mb-3" />
              <p className="text-sm text-slate-300 mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center">
                <img src={t.image} alt={t.name} className={`h-12 w-12 rounded-full object-cover border border-amber-500/30 ${activeTestimonial === i ? 'ring-2 ring-amber-400' : ''}`} />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
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

      {/* Why Choose StockFx - Image Carousel Section */}
      <section className="relative py-24 sm:py-48 overflow-hidden">
        {/* Background image carousel */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundIndex % 5 === 0 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7fbda3?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundIndex % 5 === 1 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundIndex % 5 === 2 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1579532900298-0d2b25ba2b71?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundIndex % 5 === 3 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1626190174326-8eab0e94e9d0?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundIndex % 5 === 4 ? 1 : 0,
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 text-center z-10 flex flex-col justify-center h-full min-h-48 sm:min-h-64 md:min-h-96">
          <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 justify-center">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 mr-1 animate-pulse" />
            Limited Time Offer
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 sm:mb-4">
            ?? Zero-fee trading
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 mb-4 sm:mb-6 max-w-3xl mx-auto">
            Join thousands of traders making smarter decisions. Start your journey with zero commission fees.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-xl transition text-sm sm:text-base w-fit mx-auto active:scale-95"
          >
            Claim Offer
          </button>

          {/* Image carousel indicators */}
          <div className="flex gap-2 justify-center mt-16">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => setBackgroundIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === backgroundIndex % 5 ? 'w-10 bg-amber-400' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Trading - Image Carousel Section 2 */}
      <section className="relative py-24 sm:py-48 overflow-hidden">
        {/* Background image carousel */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518546305927-30bccb39ff38?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 5) % 5 === 0 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516522973542-b23dd067fdd1?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 5) % 5 === 1 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1621761191007-11cf3b393641?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 5) % 5 === 2 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 5) % 5 === 3 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1563206772-641972bea9fa?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 5) % 5 === 4 ? 1 : 0,
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 flex flex-col justify-center h-full">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-medium mb-8 justify-center">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse" />
            New Feature
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8">
            ?? Invest in Crypto with 50% Lower Fees
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto">
            Access Bitcoin, Ethereum, and 500+ cryptocurrencies with real-time market data and advanced investing tools.
          </p>
          <AnimatedButton
            onClick={() => onNavigate('register')}
            variant="secondary"
            size="lg"
          >
            Start Crypto Trading
          </AnimatedButton>

          {/* Image carousel indicators */}
          <div className="flex gap-2 justify-center mt-16">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => setBackgroundIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === (backgroundIndex + 5) % 5 ? 'w-10 bg-blue-400' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Crypto Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Trading - Image Carousel Section 3 */}
      <section className="relative py-24 sm:py-48 overflow-hidden">
        {/* Background image carousel */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 10) % 5 === 0 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 10) % 5 === 1 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 10) % 5 === 2 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 10) % 5 === 3 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=600&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (backgroundIndex + 10) % 5 === 4 ? 1 : 0,
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 flex flex-col justify-center h-full">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-medium mb-8 justify-center">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            Available Everywhere
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8">
            ?? Invest On-the-Go, Anytime, Anywhere
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto">
            Our award-winning mobile app puts professional investing tools right in your pocket. Never miss an investing opportunity again.
          </p>
          <AnimatedButton
            onClick={() => onNavigate('register')}
            variant="primary"
            size="lg"
          >
            ?? Download Mobile App
          </AnimatedButton>

          {/* Image carousel indicators */}
          <div className="flex gap-2 justify-center mt-16">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => setBackgroundIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === (backgroundIndex + 10) % 5 ? 'w-10 bg-green-400' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Mobile Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Why Choose StockFx?</h2>
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

