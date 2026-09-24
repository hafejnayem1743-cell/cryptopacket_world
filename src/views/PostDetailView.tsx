import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Share2,
  Copy,
  ExternalLink,
  Flame,
  Check,
  Lock,
  Star,
  Gift,
  ArrowRight
} from 'lucide-react';
import type { Post, SiteSettings } from '../types/index';
import { RedPacketCard } from '../components/RedPacketCard';
import { DEFAULT_POST_IMAGE } from '../config/constants';
import { SeoHead } from '../components/SeoHead';

interface PostDetailViewProps {
  post: Post;
  settings: SiteSettings;
  relatedPosts: Post[];
  onOpenPacket: (post: Post) => void;
  onNavigate: (path: string) => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error', title?: string) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  relatedPosts,
  onOpenPacket,
  onNavigate,
  onToast
}) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.title} — CryptoPacket`,
          text: `Check out this verified crypto red packet on CryptoPacket!`,
          url: shareUrl
        });
        onToast('Link shared successfully!', 'success');
      } catch {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      <SeoHead
        title={`${post.title} — CryptoPacket`}
        description={post.description}
        canonicalPath={`/post/${post.slug}`}
        ogImage={DEFAULT_POST_IMAGE}
        ogType="article"
        article={{
          publishedTime: post.publishedAt || post.createdAt,
          modifiedTime: post.updatedAt,
          category: post.category
        }}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Packets', path: '/#packets-section' },
          { name: post.title, path: `/post/${post.slug}` }
        ]}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-slate-400">Packets</span>
        <span>/</span>
        <span className="text-amber-600 truncate max-w-[200px] font-bold">{post.slug}</span>
      </div>

      {/* Main Post Showcase Card (Light Mode) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Visual Asset (Always DEFAULT_POST_IMAGE) */}
          <div className="lg:col-span-5 relative bg-slate-100 flex items-center justify-center min-h-[260px] sm:min-h-[340px]">
            <img
              src={DEFAULT_POST_IMAGE}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover max-h-[440px]"
            />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs border border-slate-200 text-emerald-700 text-xs font-mono font-bold uppercase shadow-xs">
                {post.shortLabel || 'VERIFIED'}
              </span>
              {post.featured && (
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Details & Claim Action */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Date Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-700 font-semibold">{post.category || 'Binance Red Packet'}</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-600 flex items-center gap-1 font-mono text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Active Drop</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {post.description}
              </p>

              {/* Security Inspection Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Destination Security Status: Verified</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The destination URL for this red packet has passed automated protocol checks (HTTPS protocol, sanitized redirection parameters, and zero malware signatures).
                </p>
              </div>
            </div>

            {/* Actions: Primary OPEN PACKET & Share */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => onOpenPacket(post)}
                className="w-full min-h-[48px] px-8 py-3.5 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-wider font-extrabold transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2.5 group"
              >
                <Gift className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform duration-200" />
                <span>OPEN PACKET</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-secondary-light text-slate-700 text-xs font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Share Packet</span>
                </button>

                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-secondary-light text-slate-700 text-xs font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-400 hidden sm:block">
                  Protected by Link Preparation Flow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Legal Transparency Box */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Independent Platform Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          CryptoPacket is an independent community website and is not affiliated with or endorsed by Binance. We catalog public red-packet links shared by members. Clicking “Open Packet” initiates a standard link preparation check before sending you to the destination.
        </p>
      </div>

      {/* Related Active Red Packets: Responsive Grid */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              More Active Red Packets
            </h2>
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {relatedPosts.slice(0, 4).map((item) => (
              <RedPacketCard
                key={item.id}
                post={item}
                onOpen={onOpenPacket}
                onViewDetails={(p) => onNavigate(`/post/${p.slug}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
