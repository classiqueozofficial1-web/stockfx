
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ExternalLinkIcon } from
'lucide-react';
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
  {
    name: 'Home',
    jp: 'ホーム',
    href: '#home'
  },
  {
    name: 'About',
    jp: '私について',
    href: '#about'
  },
  {
    name: 'Skills',
    jp: 'スキル',
    href: '#skills'
  },
  {
    name: 'Projects',
    jp: 'プロジェクト',
    href: '#projects'
  },
  {
    name: 'Contact',
    jp: 'お問い合わせ',
    href: '#contact'
  }];

  const services = [
  {
    name: 'Web Development',
    jp: 'ウェブ開発'
  },
  {
    name: 'UI/UX Design',
    jp: 'UIデザイン'
  },
  {
    name: 'Mobile Apps',
    jp: 'モバイルアプリ'
  },
  {
    name: 'Consulting',
    jp: 'コンサルティング'
  }];

  return (
    <footer className="bg-stone-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Column */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-700 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">和</span>
              </div>
              <h2 className="text-xl">Taro Yamada</h2>
            </div>
            <p className="text-stone-400 mb-4">
              Crafting digital experiences with Japanese aesthetics. Bringing
              harmony between tradition and modern technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="GitHub">

                <GithubIcon size={20} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Twitter">

                <TwitterIcon size={20} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="LinkedIn">

                <LinkedinIcon size={20} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Instagram">

                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg mb-4 border-b border-stone-700 pb-2">
              Quick Links
              <span className="block text-sm text-stone-400 mt-1">
                クイックリンク
              </span>
            </h3>
            <nav>
              <ul className="space-y-2">
                {quickLinks.map((link) =>
                <li key={link.name}>
                    <a
                    href={link.href}
                    className="text-stone-400 hover:text-white transition-colors flex items-center group">

                      {link.name}
                      <ExternalLinkIcon
                      size={14}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <span className="text-xs text-stone-500 ml-2">
                        {link.jp}
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          {/* Services Column */}
          <div>
            <h3 className="text-lg mb-4 border-b border-stone-700 pb-2">
              Services
              <span className="block text-sm text-stone-400 mt-1">
                サービス
              </span>
            </h3>
            <ul className="space-y-2">
              {services.map((service) =>
              <li key={service.name} className="text-stone-400">
                  {service.name}
                  <span className="text-xs text-stone-500 ml-2">
                    {service.jp}
                  </span>
                </li>
              )}
            </ul>
          </div>
          {/* Contact Column */}
          <div>
            <h3 className="text-lg mb-4 border-b border-stone-700 pb-2">
              Contact
              <span className="block text-sm text-stone-400 mt-1">連絡先</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-stone-400">
                <MapPinIcon size={20} className="mr-2 mt-1 text-red-700" />
                <div>
                  San Francisco, CA
                  <span className="block text-xs text-stone-500">
                    サンフランシスコ
                  </span>
                </div>
              </li>
              <li className="flex items-start text-stone-400">
                <PhoneIcon size={20} className="mr-2 mt-1 text-red-700" />
                <div>
                  +1 (555) 123-4567
                  <span className="block text-xs text-stone-500">電話番号</span>
                </div>
              </li>
              <li className="flex items-start text-stone-400">
                <MailIcon size={20} className="mr-2 mt-1 text-red-700" />
                <div>
                  hello@taroyamada.com
                  <span className="block text-xs text-stone-500">メール</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-stone-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-stone-400 text-sm">
            <p>© {currentYear} Taro Yamada. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              <span className="text-red-700">和</span> Crafted with harmony in
              San Francisco
            </p>
          </div>
        </div>
      </div>
    </footer>);

};