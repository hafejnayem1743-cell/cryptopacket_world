import React, { useState } from 'react';
import {
  Save,
  Globe,
  Sparkles,
  Clock
} from 'lucide-react';
import type { SiteSettings } from '../../types/index';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSave: (updated: Partial<SiteSettings>) => Promise<void>;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSave,
  onToast
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onToast('Settings successfully updated!', 'success');
    } catch (err: any) {
      onToast(err.message || 'Failed to update settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Platform & Advertising Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure partner ads, verification durations, site metadata, and portfolio links.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* ================= SECTION 1: ADVERTISING CONFIGURATION ================= */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Link Preparation & Advertising Flow
            </h2>
            <p className="text-xs text-slate-500">
              Configure the 2-step interstitial advertising experience before destination unlock.
            </p>
          </div>
        </div>

        {/* Master Ads Enabled Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs font-mono font-bold text-slate-900">Enable Sponsored Partner Ads</div>
            <div className="text-[11px] text-slate-500">
              When enabled, visitors view Step 1 and Step 2 ads before unlocking red packet URLs. If turned off, verification completes immediately.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.adsEnabled}
              onChange={(e) => setFormData({ ...formData, adsEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Ad URL */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>First Ad URL (Step 1)</span>
              <span className="text-[10px] text-slate-400 font-mono">Opened on Continue</span>
            </label>
            <input
              type="url"
              value={formData.firstAdUrl}
              onChange={(e) => setFormData({ ...formData, firstAdUrl: e.target.value })}
              placeholder="https://sponsor.cryptopacket.net/step-1"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
            />
          </div>

          {/* Second Ad URL */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Second Ad URL (Step 2)</span>
              <span className="text-[10px] text-slate-400 font-mono">Opened on Unlock</span>
            </label>
            <input
              type="url"
              value={formData.secondAdUrl}
              onChange={(e) => setFormData({ ...formData, secondAdUrl: e.target.value })}
              placeholder="https://sponsor.cryptopacket.net/step-2"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
            />
          </div>
        </div>

        {/* Verification Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Countdown Duration (Seconds)</span>
              <span className="text-[10px] text-slate-400 font-mono">Default: 10s</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={2}
                max={60}
                value={formData.verificationDuration}
                onChange={(e) =>
                  setFormData({ ...formData, verificationDuration: parseInt(e.target.value) || 10 })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: DEVELOPER PORTFOLIO & BRANDING ================= */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Portfolio Button & Site Identity
            </h2>
            <p className="text-xs text-slate-500">
              Control the top bar portfolio destination and website branding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Portfolio Destination URL */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Portfolio Destination URL</span>
              <span className="text-[10px] text-amber-600 font-mono font-bold">Sohel Rana</span>
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
            />
          </div>

          {/* Portfolio Button Text */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Top Portfolio Button Text
            </label>
            <input
              type="text"
              value={formData.portfolioButtonText}
              onChange={(e) => setFormData({ ...formData, portfolioButtonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Platform Name
            </label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
          </div>

          {/* SEO Title */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Default SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
            Meta Description / Tagline
          </label>
          <textarea
            rows={2}
            value={formData.siteDescription}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none leading-relaxed"
          />
        </div>

        {/* Mandatory Binance Disclaimer Copy */}
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
            Mandatory Disclaimer Text
          </label>
          <textarea
            rows={2}
            value={formData.disclaimerText}
            onChange={(e) => setFormData({ ...formData, disclaimerText: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none leading-relaxed"
          />
        </div>
      </div>
    </form>
  );
};
