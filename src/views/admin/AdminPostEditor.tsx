import React, { useState } from 'react';
import {
  Save,
  ArrowLeft,
  Link2,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import type { Post } from '../../types/index';
import { RedPacketCard } from '../../components/RedPacketCard';
import { DEFAULT_POST_IMAGE } from '../../config/constants';

interface AdminPostEditorProps {
  post: Post | null;
  onSave: (data: Partial<Post>) => Promise<void>;
  onCancel: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

const PRESET_THUMBNAILS = [
  { label: 'Default CryptoPacket Image', url: DEFAULT_POST_IMAGE },
  { label: 'Cyber Red Packet', url: '/images/crypto_packet_card_2_1790158657449.jpg' },
  { label: 'Hero Banner Visual', url: '/images/hero_redpacket_crypto_1790158620199.jpg' },
  { label: 'Security Verification Glow', url: '/images/security_shield_verification_1790158670861.jpg' }
];

export const AdminPostEditor: React.FC<AdminPostEditorProps> = ({
  post,
  onSave,
  onCancel,
  onToast
}) => {
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    description: post?.description || '',
    destinationUrl: post?.destinationUrl || 'https://s.binance.com/',
    thumbnail: post?.thumbnail || DEFAULT_POST_IMAGE,
    status: (post?.status || 'published') as 'published' | 'draft',
    featured: post?.featured || false,
    shortLabel: post?.shortLabel || 'LIVE',
    category: post?.category || 'Binance Red Packet'
  });

  const [customThumbnail, setCustomThumbnail] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto generate slug if creating new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const next = { ...prev, title: val };
      if (!isEditing && !prev.slug) {
        next.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  // Live URL validation check
  const validateUrl = (url: string) => {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return 'URL must begin with https:// (or http://)';
    }
    try {
      new URL(url);
      return null;
    } catch {
      return 'Malformed URL syntax.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.destinationUrl) {
      onToast('Please fill in all required fields.', 'error');
      return;
    }

    const check = validateUrl(formData.destinationUrl);
    if (check) {
      setUrlError(check);
      onToast(check, 'error');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (err: any) {
      onToast(err.message || 'Failed to save post.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Mock post object for live preview
  const previewPost: Post = {
    id: post?.id || 'preview_id',
    slug: formData.slug || 'preview-slug',
    title: formData.title || 'Untitled Red Packet',
    description: formData.description || 'Description of the community red packet...',
    destinationUrl: formData.destinationUrl,
    thumbnail: DEFAULT_POST_IMAGE,
    status: formData.status,
    featured: formData.featured,
    views: post?.views || 1024,
    createdAt: post?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    shortLabel: formData.shortLabel,
    category: formData.category
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {isEditing ? `Edit: ${post.title}` : 'Create New Red Packet'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Update packet details, destination link, or distribution status.'
                : 'Publish a new community-shared crypto red packet.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
              Packet Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                Packet Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Exclusive Crypto Red Packet"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                URL Slug (Permanent Path)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">/post/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
                    })
                  }
                  placeholder="exclusive-crypto-red-packet"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                Description / Claim Instructions *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the packet drop and instructions..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none leading-relaxed"
              />
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Destination Red Packet URL *</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">External Target</span>
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  required
                  value={formData.destinationUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, destinationUrl: e.target.value });
                    setUrlError(validateUrl(e.target.value));
                  }}
                  placeholder="https://s.binance.com/9xK4m2Pq"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>
              {urlError ? (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urlError}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Server strictly sanitizes this link before any visitor redirection.
                </p>
              )}
            </div>

            {/* Category & Short Label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="Binance Red Packet">Binance Red Packet</option>
                  <option value="Community Drop">Community Drop</option>
                  <option value="Exclusive VIP Drop">Exclusive VIP Drop</option>
                  <option value="Weekend Special">Weekend Special</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
                  Short Label Badge
                </label>
                <input
                  type="text"
                  value={formData.shortLabel}
                  onChange={(e) => setFormData({ ...formData, shortLabel: e.target.value.toUpperCase() })}
                  placeholder="LIVE, DAILY, HOT"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Visibility & Publication Controls */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
              Publication Controls
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700">
                  Publication Status
                </label>
                <p className="text-[11px] text-slate-400">
                  Drafts are only visible in admin panel. Published drops appear immediately on public site.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    formData.status === 'published'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    formData.status === 'draft'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-xs font-mono font-semibold text-slate-700">
                  Featured Drop
                </label>
                <p className="text-[11px] text-slate-400">
                  Highlight this packet in the curated hero showcase at the top of the homepage.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 bg-slate-100 border-slate-300 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl btn-secondary-light text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isEditing ? 'Update Red Packet' : 'Publish Red Packet'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-3 sticky top-24">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>Live Card Preview</span>
          </div>

          <div className="max-w-xs mx-auto lg:max-w-none">
            <RedPacketCard
              post={previewPost}
              onOpen={() => {}}
              onViewDetails={() => {}}
            />
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-400 text-center shadow-xs">
            All posts automatically use the configured CryptoPacket default card image.
          </div>
        </div>
      </div>
    </div>
  );
};
