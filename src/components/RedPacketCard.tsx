import React from 'react';
import { ArrowRight, Star, Gift } from 'lucide-react';
import type { Post } from '../types/index';
import { DEFAULT_POST_IMAGE } from '../config/constants';

interface RedPacketCardProps {
  post: Post;
  onOpen: (post: Post) => void;
  onViewDetails?: (post: Post) => void;
}

export const RedPacketCard: React.FC<RedPacketCardProps> = ({ post, onOpen, onViewDetails }) => {
  const isLive = post.status === 'published';

  return (
    <div
      className={`group relative rounded-xl sm:rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-200 ${
        post.featured ? 'crypto-card-featured' : 'crypto-card'
      }`}
    >
      {/* 1. Consistent Post Image at Top */}
      <div
        onClick={() => (onViewDetails ? onViewDetails(post) : onOpen(post))}
        className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={DEFAULT_POST_IMAGE}
          alt={post.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            // Elegant light fallback
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />

        {/* Featured badge (subtle, clean, professional) */}
        {post.featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
            <span>Featured</span>
          </div>
        )}

        {/* Live Active Status indicator */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-slate-200 text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isLive ? 'ACTIVE' : 'DRAFT'}</span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Category / Drop Type */}
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {post.category || 'Crypto Red Packet'}
          </div>

          {/* Post Title with consistent allocated height to prevent uneven cards */}
          <div className="min-h-[2.4rem] sm:min-h-[2.75rem] flex items-start">
            <h3
              onClick={() => (onViewDetails ? onViewDetails(post) : onOpen(post))}
              className="text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug cursor-pointer font-display"
              title={post.title}
            >
              {post.title}
            </h3>
          </div>

          {/* Short Description with consistent allocated height */}
          <div className="min-h-[2rem] sm:min-h-[2.5rem] overflow-hidden">
            <p className="text-[11px] sm:text-xs md:text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </div>
        </div>

        {/* Metadata & Actions (pinned to bottom) */}
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-slate-100 space-y-2 sm:space-y-2.5">
          {/* Metadata: Unboxed clean typography */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Verified Active</span>
            </span>
            <span className="text-slate-400 font-medium shrink-0">100% Free</span>
          </div>

          {/* Open Packet Button (Premium Crypto Yellow/Gold with Gift icon) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onOpen(post)}
              className="flex-1 min-h-[40px] sm:min-h-[44px] py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl btn-gold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] font-bold group/btn"
              title={`Open ${post.title}`}
            >
              <Gift className="w-3.5 h-3.5 text-slate-950 shrink-0 group-hover/btn:rotate-12 transition-transform duration-200" />
              <span className="truncate">Open Packet</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </button>

            {onViewDetails && (
              <button
                onClick={() => onViewDetails(post)}
                className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3.5 rounded-lg sm:rounded-xl btn-secondary-light text-[11px] sm:text-xs font-semibold shrink-0"
                title="View details"
              >
                Info
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
