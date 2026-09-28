import React, { useState } from 'react';
import { MessageSquare, Menu, X } from 'lucide-react';
import { DZLogo } from './DZLogo';
import { ThemeToggle } from './ThemeToggle';
import { BusinessSettings, Language } from '../../types';
import { generateWhatsAppLink } from '../../utils/whatsapp';

interface HeaderProps {
  settings: BusinessSettings;
  currentRoute: string;
  onNavigate: (route: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentRoute,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Véhicules', route: '/vehicles' },
    { label: 'Services', route: '/services' },
    { label: 'À propos', route: '/about' },
    { label: 'Avis', route: '/reviews' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Contact', route: '/contact' },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0d0e14]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm dark:shadow-black/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <DZLogo
              theme="auto"
              onClick={() => handleNavClick('/')}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#ff6600]'
                        : 'text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Cluster: Theme Toggle + Réserver + WhatsApp CTA */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Theme Toggler Button */}
              <ThemeToggle size="md" />

              {/* Réserver Button */}
              <button
                onClick={() => handleNavClick('/booking')}
                className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                Réserver
              </button>

              {/* WhatsApp Button */}
              <a
                href={generateWhatsAppLink(settings.whatsapp, 'general')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Actions: Theme Toggle + Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle size="sm" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-zinc-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#0d0e14] pt-24 px-6 pb-8 md:hidden flex flex-col justify-between shadow-2xl animate-fadeIn border-b border-gray-200 dark:border-white/10">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`text-lg font-bold py-3 text-left border-b border-gray-100 dark:border-white/10 cursor-pointer ${
                  currentRoute === link.route ? 'text-[#ff6600]' : 'text-gray-800 dark:text-zinc-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
              <span>Mode d'affichage</span>
              <ThemeToggle showMenu={true} />
            </div>

            <a
              href={generateWhatsAppLink(settings.whatsapp, 'general')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 rounded-xl font-bold text-sm shadow-md"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};


