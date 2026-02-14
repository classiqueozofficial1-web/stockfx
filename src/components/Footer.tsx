
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Live Market Analysis',
    'Portfolio Management',
    'Risk Analytics',
    'Education & Webinars',
  ];

  const socialLinks = [
    { icon: GithubIcon, href: '#', label: 'GitHub' },
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-dark-950 text-white pt-20 pb-8 border-t border-dark-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">FX</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">StockFx</h2>
                <p className="text-xs text-primary-400">Trading Platform</p>
              </div>
            </div>
            <p className="text-dark-300 text-sm mb-6 leading-relaxed">
              Empowering traders with advanced tools, real-time analytics, and 
              professional-grade insights for smarter trading decisions.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white transition-all duration-200 flex items-center justify-center group"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b-2 border-primary-600/30">
              Quick Links
            </h3>
            <nav>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-200 flex items-center group text-sm"
                    >
                      <span className="inline-block w-1 h-1 bg-primary-600 rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b-2 border-accent-600/30">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-dark-300 flex items-start group cursor-pointer text-sm">
                  <span className="inline-block w-1 h-1 bg-accent-600 rounded-full mr-3 mt-1.5 group-hover:scale-150 transition-transform duration-200"></span>
                  <span className="group-hover:text-accent-400 transition-colors duration-200">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b-2 border-primary-600/30">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPinIcon size={18} className="mt-0.5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-dark-300">San Francisco, CA</p>
                  <p className="text-xs text-dark-500">United States</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <PhoneIcon size={18} className="mt-0.5 text-accent-600 flex-shrink-0" />
                <div>
                  <p className="text-dark-300">+1 (555) 123-4567</p>
                  <p className="text-xs text-dark-500">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MailIcon size={18} className="mt-0.5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-dark-300">support@stockfx.com</p>
                  <p className="text-xs text-dark-500">Quick response</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-900/20 to-accent-900/20 border border-primary-600/30 rounded-2xl p-8 mb-12">
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-dark-300 text-sm mb-6">
              Get market insights and trading tips delivered to your inbox weekly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 px-4 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-600 transition-colors duration-200 text-sm"
              />
              <button className="h-10 px-6 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-800 pt-8">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-400">
            <p>© {currentYear} StockFx. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};