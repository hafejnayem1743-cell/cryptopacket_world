import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Crisp Modern Crypto Red-Packet SVG Icon */}
        <svg
          viewBox="0 0 40 40"
          className="relative w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Envelope background */}
          <rect x="5" y="6" width="30" height="28" rx="6" fill="url(#brandGradRedLight)" />
          {/* Envelope flap cut */}
          <path d="M5 10L20 21L35 10" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9" />
          {/* Curved packet gold seam */}
          <path d="M5 14C5 14 20 25 35 14" stroke="#F59E0B" strokeWidth="1.2" />
          {/* Crypto node coin */}
          <circle cx="20" cy="23" r="5.5" fill="#181A20" stroke="#F0B90B" strokeWidth="1.5" />
          <path d="M20 19.5V26.5M16.5 23H23.5" stroke="#F0B90B" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="20" cy="23" r="1.5" fill="#10B981" />

          <defs>
            <linearGradient id="brandGradRedLight" x1="5" y1="6" x2="35" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E11D48" />
              <stop offset="1" stopColor="#BE123C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-0.5">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-slate-900 font-display`}>
            Crypto<span className="text-amber-500">Packet</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 font-mono">
            Discover · Claim · Enjoy
          </span>
        )}
      </div>
    </div>
  );
};
