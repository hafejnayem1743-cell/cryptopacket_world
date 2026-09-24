import React from 'react';
import { HelpCircle, Home } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-18 h-18 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
        <HelpCircle className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono text-amber-600 uppercase tracking-wider font-semibold">404 Error</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Packet Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The red packet you’re looking for may have expired, been archived by the administrator, or the URL might be mistyped.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
