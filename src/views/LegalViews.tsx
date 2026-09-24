import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';

interface LegalViewProps {
  type: 'privacy' | 'terms' | 'disclaimer' | 'contact';
  onNavigate: (path: string) => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const LegalViews: React.FC<LegalViewProps> = ({ type, onNavigate, onToast }) => {
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getSeoData = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy — CryptoPacket',
          description:
            'Review how CryptoPacket protects visitor anonymity, monitors packet traffic hashes, and handles advertising partner integrations.',
          canonicalPath: '/privacy',
          breadcrumb: 'Privacy Policy'
        };
      case 'terms':
        return {
          title: 'Terms of Service — CryptoPacket',
          description:
            'Terms and guidelines governing the use of CryptoPacket, community-shared crypto red packets, and third-party redirection.',
          canonicalPath: '/terms',
          breadcrumb: 'Terms of Service'
        };
      case 'disclaimer':
        return {
          title: 'Disclaimer & Risk Notice — CryptoPacket',
          description:
            'Independent platform disclaimer: CryptoPacket is not affiliated with Binance. Please understand cryptocurrency volatility and risk.',
          canonicalPath: '/disclaimer',
          breadcrumb: 'Disclaimer'
        };
      case 'contact':
        return {
          title: 'Contact Support & Feedback — CryptoPacket',
          description:
            'Contact the CryptoPacket platform administration for red packet submission, broken link reporting, or partnership inquiries.',
          canonicalPath: '/contact',
          breadcrumb: 'Contact'
        };
    }
  };

  const seo = getSeoData();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onToast('Message received! We will respond shortly.', 'success');
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-slate-800">
      <SeoHead
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: seo.breadcrumb, path: seo.canonicalPath }
        ]}
      />

      {/* Back button */}
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to CryptoPacket Home</span>
      </button>

      {/* ================= PRIVACY POLICY ================= */}
      {type === 'privacy' && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-mono text-amber-600 font-semibold uppercase tracking-wider">
              Legal & Transparency
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-mono">Effective Date: January 1, 2026</p>
          </div>

          <div className="text-slate-600 text-xs sm:text-sm space-y-4 leading-relaxed">
            <p>
              At <strong>CryptoPacket</strong>, accessible from our official domain, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines what types of information are collected and recorded by CryptoPacket and how we use it.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">1. Information We Do NOT Collect</h3>
            <p>
              CryptoPacket operates as an open community directory. We do not require account registration, passphrases, wallet private keys, or personal identity documents. We never request or store sensitive cryptocurrency credentials.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">2. Log Files & View Counting</h3>
            <p>
              To maintain accurate red packet popularity metrics and prevent denial-of-service spam, we generate a one-way cryptographic SHA-256 hash of visitor IP addresses. This hash is temporarily held in memory to prevent rapid duplicate view inflation and is never linked to personal identity.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">3. Advertising Partners</h3>
            <p>
              To maintain free infrastructure and server operations, our Link Preparation Flow may display verified third-party partner advertisements. These third-party ad servers may use cookies or web beacons in accordance with their respective privacy policies. CryptoPacket does not sell personal user information to advertisers.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">4. External Websites</h3>
            <p>
              CryptoPacket lists links to third-party cryptocurrency websites, including Binance Red Packets. We do not have control over the privacy practices of external platforms. We encourage users to review the privacy notices of any website they visit.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">5. Contact Information</h3>
            <p>
              If you have any questions or require more information about our Privacy Policy, please contact us via our Contact Support page.
            </p>
          </div>
        </div>
      )}

      {/* ================= TERMS OF SERVICE ================= */}
      {type === 'terms' && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-mono text-amber-600 font-semibold uppercase tracking-wider">
              Platform Rules
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-mono">Last Updated: January 1, 2026</p>
          </div>

          <div className="text-slate-600 text-xs sm:text-sm space-y-4 leading-relaxed">
            <p>
              Welcome to <strong>CryptoPacket</strong>. By accessing or using this website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">1. Nature of the Platform</h3>
            <p>
              CryptoPacket provides a curated discovery platform for community-shared cryptocurrency red packets. We do not issue cryptocurrency tokens, execute blockchain smart contracts, or operate custody over any digital assets.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">2. Acceptable Use</h3>
            <p>
              You agree not to use automated bots, scrapers, or exploitation scripts that degrade the service for other community members. Any attempt to compromise server integrity or inject malicious URLs will result in immediate IP banning.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">3. Disclaimer of Warranties</h3>
            <p>
              CryptoPacket is provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind. We do not warrant that external red-packet links will remain active, contain token rewards, or remain available indefinitely.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">4. Limitation of Liability</h3>
            <p>
              Under no circumstances shall CryptoPacket, its operators, or developers be held liable for any direct, indirect, incidental, or consequential damages resulting from your interaction with external links or third-party platforms.
            </p>
          </div>
        </div>
      )}

      {/* ================= LEGAL DISCLAIMER ================= */}
      {type === 'disclaimer' && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-mono text-amber-600 font-semibold uppercase tracking-wider">
              Legal Disclosure & Non-Affiliation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Legal Disclaimer</h1>
            <p className="text-xs text-slate-400 font-mono">Mandatory Disclosure</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Independent Platform Notice</span>
            </div>
            <p>
              <strong>CryptoPacket is an independent community platform and is not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Binance, or any of its subsidiaries or affiliates.</strong>
            </p>
          </div>

          <div className="text-slate-600 text-xs sm:text-sm space-y-4 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900 font-display pt-2">1. Trademark Notices</h3>
            <p>
              The official Binance website can be found at <a href="https://binance.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline font-semibold">https://binance.com</a>. The name “Binance” as well as related names, marks, emblems, and images are registered trademarks of their respective owners. The use in this website of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">2. No Financial Advice</h3>
            <p>
              Information published on CryptoPacket is provided solely for informational and community discovery purposes. Nothing on this website constitutes financial, investment, or legal advice. Cryptocurrency assets are subject to market volatility. You are solely responsible for conducting your own research before participating in any crypto promotions.
            </p>

            <h3 className="text-base font-bold text-slate-900 font-display pt-2">3. Third-Party Advertising Transparency</h3>
            <p>
              Our Link Preparation Flow incorporates advertising links from our partner network. We explicitly disclose these links as advertisements and do not claim that ad interactions represent cryptographic verification or CAPTCHA validation.
            </p>
          </div>
        </div>
      )}

      {/* ================= CONTACT SUPPORT ================= */}
      {type === 'contact' && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-mono text-amber-600 font-semibold uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Contact Community Support</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Have questions, feedback, or need to report an expired or broken red packet link? Send us a message below.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Message Sent Successfully</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you for reaching out to the CryptoPacket team. We review community submissions promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl btn-secondary-light text-xs font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                  Inquiry Topic
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Report Broken Link">Report Broken / Expired Packet Link</option>
                  <option value="Submit Community Packet">Submit Community Red Packet</option>
                  <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                  <option value="Administrator Contact">Site Administrator Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or include packet details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[46px] py-3 px-6 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
