import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Shield, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  portfolioUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  portfolioUrl = 'https://developersohelrana.pages.dev'
}) => {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 pt-14 pb-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-left focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 -ml-1"
            >
              <BrandLogo size="lg" showTagline />
            </button>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              CryptoPacket is an independent community platform for discovering and safely opening community-shared crypto red packets. Explore active drops and follow verified link preparation steps.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium pt-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Independent platform · Zero user credential tracking</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    onNavigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-slate-900 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('/');
                    setTimeout(() => {
                      document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-slate-900 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('/');
                    setTimeout(() => {
                      document.querySelector('#faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-slate-900 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Trust & Policies</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Legal Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  <span>Built by Sohel Rana</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Unobtrusive Binance Disclaimer */}
        <div className="py-4 px-4 my-6 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <p>
            <strong className="text-slate-800">Disclaimer:</strong> CryptoPacket is an independent community platform and is not affiliated with, associated with, authorized by, or endorsed by Binance. All product and company names are trademarks™ or registered® trademarks of their respective holders.
          </p>
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('/disclaimer')}
              className="text-xs text-amber-600 font-semibold hover:underline whitespace-nowrap"
            >
              Read full policy →
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <p>© {new Date().getFullYear()} CryptoPacket. All rights reserved.</p>

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>by Sohel Rana</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
