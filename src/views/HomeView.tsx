import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Shield,
  Zap,
  Globe2,
  Gift
} from 'lucide-react';
import type { Post, SiteSettings } from '../types/index';
import { RedPacketCard } from '../components/RedPacketCard';
import { SeoHead } from '../components/SeoHead';

interface HomeViewProps {
  posts: Post[];
  settings: SiteSettings;
  onOpenPacket: (post: Post) => void;
  onViewDetails: (post: Post) => void;
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  posts,
  settings,
  onOpenPacket,
  onViewDetails,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'featured'
          ? !!p.featured
          : (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [posts, searchTerm, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Packets' },
    { id: 'featured', label: '★ Featured Drops' },
    { id: 'binance red packet', label: 'Binance Red Packets' },
    { id: 'community drop', label: 'Community Drops' }
  ];

  const faqs = [
    {
      q: 'What is CryptoPacket?',
      a: 'CryptoPacket is an independent community platform where crypto enthusiasts can discover and open verified crypto red-packet links shared by the site administrator and community contributors.'
    },
    {
      q: 'Is CryptoPacket affiliated with Binance?',
      a: 'No. CryptoPacket is completely independent and is not affiliated with, associated with, or endorsed by Binance. We simply share community-provided Red Packet links and perform destination link preparation.'
    },
    {
      q: 'Do I need an account to open Red Packets?',
      a: 'No user registration or account creation is required on CryptoPacket. You can browse active packets freely and complete the link preparation steps to reach the destination.'
    },
    {
      q: 'What are the Link Preparation steps?',
      a: 'When you click Open Packet, our system runs a security check to sanitize the external link, verify SSL certificates, and display our verified community sponsor links before forwarding you to the original destination.'
    },
    {
      q: 'Are the Red Packet rewards guaranteed?',
      a: 'CryptoPacket does not operate the blockchain tokens or Binance infrastructure, so rewards depend entirely on the creator of the red packet and remaining pool capacity.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SeoHead
        title={settings.seoTitle || 'CryptoPacket — Discover Crypto Red Packets'}
        description={
          settings.seoDescription ||
          'Discover community-shared crypto red packets on CryptoPacket. Explore active packets and follow the available access steps to reach the original destination.'
        }
        canonicalPath="/"
        ogImage={settings.socialImage || '/pwa-512x512.png'}
      />

      {/* ================= HERO SECTION (LIGHT & AIRY) ================= */}
      <section className="relative pt-8 sm:pt-16 lg:pt-20 overflow-hidden">
        {/* Soft light ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-amber-200/30 via-yellow-100/40 to-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
          <div className="space-y-6 flex flex-col items-center">
            {/* Trust Badge - Clean unboxed style */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified Community Red Packet Directory</span>
              <span className="text-amber-300">·</span>
              <span className="text-amber-700">Updated Daily</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15] text-balance max-w-3xl">
              Discover Crypto <span className="text-amber-500">Red Packets</span>
            </h1>

            {/* Tagline & Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover. Claim. Enjoy. Explore community-shared crypto red packets on CryptoPacket and follow the verified access steps to claim your share.
            </p>

            {/* CTAs: 2 side-by-side buttons on top (50% each), Contact Developer button underneath */}
            <div className="pt-2 flex flex-col items-center justify-center gap-2.5 w-full max-w-md mx-auto">
              {/* Top row: 2 side-by-side buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                <button
                  onClick={() => {
                    const el = document.getElementById('packets-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full min-h-[44px] sm:min-h-[48px] px-3 sm:px-5 py-2.5 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="truncate">Explore Packets</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full min-h-[44px] sm:min-h-[48px] px-3 sm:px-5 py-2.5 rounded-xl btn-secondary-light text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <span className="truncate">How It Works</span>
                </button>
              </div>

              {/* Bottom row: Contact Developer button */}
              <a
                href={settings.portfolioUrl || 'https://developersohelrana.pages.dev'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[42px] sm:min-h-[46px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all border border-slate-200 hover:border-slate-300 shadow-xs active:scale-95 flex items-center justify-center gap-2 group"
                title="Contact Developer — Sohel Rana"
              >
                <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                <span>Contact Developer — Sohel Rana</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </a>
            </div>

            {/* Live Metric Stats Bar (Crisp Light Mode) */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 sm:gap-12 text-center max-w-lg mx-auto w-full">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {posts.length}+
                </div>
                <div className="text-xs text-slate-500 font-medium">Active Drops</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600">
                  100%
                </div>
                <div className="text-xs text-slate-500 font-medium">Sanitized Links</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-600">
                  Zero
                </div>
                <div className="text-xs text-slate-500 font-medium">Sign-up Needed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACTIVE PACKETS (RESPONSIVE GRID: 2 COL ON MOBILE, 3 ON TABLET, 4 ON DESKTOP) ================= */}
      <section id="packets-section" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-600 mb-1 font-semibold">
                Explore All
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Active Red Packets
              </h2>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search packets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-xs"
                />
              </div>

              {/* Category Segmented Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80 -translate-y-0.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 
            Responsive Grid:
            - Mobile (<768px): Strictly 2 equal columns (optimized for 320px-430px phones)
            - Tablet (768px-1024px): 3 columns
            - Desktop (>=1024px): 4 columns in max-w-7xl
          */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredPosts.map((post) => (
                <RedPacketCard
                  key={post.id}
                  post={post}
                  onOpen={onOpenPacket}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">No Active Red Packets</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                New community packets will appear here when published. Check back soon or try clearing your search filter.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-xl btn-secondary-light text-xs font-semibold"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 3: HOW IT WORKS ================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-600 font-semibold">
            Simple & Transparent
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            How CryptoPacket Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Three straightforward steps to discover and open community crypto red packets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-display font-extrabold text-base">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Discover Active Drops
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Explore our live directory of community-submitted crypto red packets. Each packet displays verified active status and claim engagement.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-display font-extrabold text-base">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Safe Link Preparation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Click “Open Packet” to start our security check. Our engine verifies destination URL integrity and presents verified community partner links.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-display font-extrabold text-base">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Unlock & Open
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Once the 10-second timer elapses, your destination is fully unlocked. Proceed to the official Binance Red Packet link to claim your tokens.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: WHY CRYPTOPACKET ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-600 font-semibold">
                Independent Community Hub
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Built For Global Crypto Users
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CryptoPacket eliminates misleading redirect schemes and provides an honest, clean, and transparent directory for digital crypto red envelopes.
              </p>

              <div className="space-y-3.5 pt-1">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Fake Security Promises</h4>
                    <p className="text-xs text-slate-500">
                      We do not pretend ads are CAPTCHAs. Advertising steps are transparently disclosed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Server-Side Sanitization</h4>
                    <p className="text-xs text-slate-500">
                      Every destination URL is strictly validated against malicious protocols before user redirection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">2-Column Mobile Touch Ergonomics</h4>
                    <p className="text-xs text-slate-500">
                      Engineered for seamless single-hand thumb browsing across all iOS and Android screen sizes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Trust Box */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-slate-50 p-5 space-y-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                      <Zap className="w-4 h-4 fill-slate-950" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">CryptoPacket Trust</div>
                      <div className="text-[10px] text-slate-500">Independent Protocol</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Verified
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target Platform</span>
                    <span className="font-mono text-slate-900 font-medium">International</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Redirection Policy</span>
                    <span className="font-mono text-emerald-600 font-medium">Sanitized HTTPS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">User Data Retention</span>
                    <span className="font-mono text-slate-900 font-medium">Zero Tracking</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Hosting</span>
                    <span className="font-mono text-amber-600 font-medium">Cloudflare Ready</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/disclaimer')}
                    className="w-full py-2 rounded-xl btn-secondary-light text-xs font-semibold text-center"
                  >
                    View Legal & Compliance Terms →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: SAFETY NOTICE & BINANCE DISCLAIMER ================= */}
      <section id="safety-notice" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-slate-700 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm sm:text-base font-display">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Community Safety Notice & Mandatory Legal Disclaimer</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-800">CryptoPacket is an independent community platform and is not affiliated with or endorsed by Binance.</strong> Binance Red Packets are an external service provided by Binance. CryptoPacket acts exclusively as a community aggregation directory where shared links are cataloged for informational discovery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-white border border-amber-200/60">
              <strong className="text-slate-800 block mb-1">Verify Destination URLs</strong>
              Always confirm the browser address bar shows the legitimate domain before entering credentials or connecting wallets.
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200/60">
              <strong className="text-slate-800 block mb-1">No Guaranteed Returns</strong>
              Red packets are community pool rewards and may expire or run out of tokens at any time without advance warning.
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200/60">
              <strong className="text-slate-800 block mb-1">Transparent Sponsorship</strong>
              Our link preparation steps feature verified advertising sponsors that support hosting and maintenance of CryptoPacket.
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: FAQ ACCORDION ================= */}
      <section id="faq-section" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="text-center space-y-2 mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-600 font-semibold">
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
