import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Menu, X, Download, ShieldCheck, HelpCircle, Layers, Sparkles, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
  portfolioUrl?: string;
  portfolioButtonText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentPath,
  portfolioUrl = 'https://developersohelrana.pages.dev',
  portfolioButtonText = 'Built by Sohel Rana'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(href);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center text-left focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-95"
        >
          <BrandLogo size="md" showTagline />
        </button>

        {/* Zone 2: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavClick('#packets-section')}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1 hover:underline underline-offset-8"
          >
            <span>Active Packets</span>
          </button>
          <button
            onClick={() => handleNavClick('#how-it-works')}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1 hover:underline underline-offset-8"
          >
            <span>How It Works</span>
          </button>
          <button
            onClick={() => handleNavClick('#safety-notice')}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1 hover:underline underline-offset-8"
          >
            <span>Safety & Disclaimer</span>
          </button>
          <button
            onClick={() => handleNavClick('#faq-section')}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 py-1 hover:underline underline-offset-8"
          >
            <span>FAQ</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* PWA In-App Install Trigger */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold tracking-wide transition-all shadow-xs"
              title="Install CryptoPacket to your desktop or mobile home screen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold tracking-wide transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Add to iOS</span>
            </button>
          )}

          {/* Portfolio Button: "Built by Sohel Rana" */}
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-300 text-xs font-semibold tracking-wide transition-all duration-150 shadow-xs active:scale-95 group whitespace-nowrap"
            title="Portfolio of Sohel Rana"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
            <span className="hidden sm:inline">{portfolioButtonText}</span>
            <span className="sm:hidden">Sohel Rana</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
          </a>

          {/* Fast CTA */}
          <button
            onClick={() => handleNavClick('#packets-section')}
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-lg btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            Explore
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('#packets-section')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Active Red Packets</span>
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => handleNavClick('#safety-notice')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Safety & Disclaimer</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{portfolioButtonText}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {isInstallable && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  install();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install CryptoPacket App</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Install on iOS</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              To install CryptoPacket on your iPhone or iPad, tap the <strong>Share</strong> button in Safari and choose <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl btn-gold text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
