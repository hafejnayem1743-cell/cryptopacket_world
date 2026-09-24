import React from 'react';
import { ShieldCheck, Zap, Bell } from 'lucide-react';

export const TopPortfolioBar: React.FC = () => {
  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-emerald-500/20 text-xs py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Live Drops Alert Message */}
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-mono flex items-center gap-1">
            <Bell className="w-3 h-3 text-emerald-400" />
            <span>Community Drops:</span>
          </span>
          <span className="hidden sm:inline text-slate-300 text-xs">
            Verified crypto red packets added daily · Free claim links
          </span>
          <span className="sm:hidden text-slate-300 text-xs truncate max-w-[200px]">
            Verified crypto red packets active today
          </span>
        </div>

        {/* Security / Free Status Indicators */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free & Verified</span>
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>No Account Needed</span>
          </span>
        </div>
      </div>
    </div>
  );
};
