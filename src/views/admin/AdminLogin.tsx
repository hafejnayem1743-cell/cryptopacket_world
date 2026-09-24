import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft, Shield, Eye, EyeOff, Loader2, ArrowRight, Clock } from 'lucide-react';
import { api, setAdminToken } from '../../lib/api';
import { getRateLimitStatus, type RateLimitStatus } from '../../lib/authGate';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigate,
  onToast
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitStatus>({
    locked: false,
    remainingAttempts: 5,
    remainingMinutes: 0
  });

  // Check rate limit status on mount and interval
  useEffect(() => {
    const status = getRateLimitStatus();
    setRateLimit(status);

    const timer = setInterval(() => {
      setRateLimit(getRateLimitStatus());
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || rateLimit.locked || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.adminLogin({ password });
      if (res.token) {
        setAdminToken(res.token);
        onToast('Master authentication successful. Welcome!', 'success');
        onLoginSuccess();
      }
    } catch (err: any) {
      const message = err.message || 'Authentication failed. Please verify credentials.';
      setErrorMsg(message);
      setRateLimit(getRateLimitStatus());
      onToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-9 space-y-7 shadow-xl relative overflow-hidden text-slate-900">
        {/* Subtle Ambient Light Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-100/60 blur-3xl pointer-events-none rounded-full" />

        {/* Top Action & Status Row */}
        <div className="flex items-center justify-between relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Public Site</span>
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Shield className="w-3 h-3 text-amber-600" />
            <span>Security Zone</span>
          </div>
        </div>

        {/* Header Branding */}
        <div className="text-center space-y-2.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Enter master password to manage crypto red packets and platform configurations.
          </p>
        </div>

        {/* Rate-Limit Warning Banner */}
        {rateLimit.locked && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold">Too Many Attempts</div>
              <p className="text-[11px] text-amber-800">
                Access is temporarily locked for {rateLimit.remainingMinutes} more minute(s).
              </p>
            </div>
          </div>
        )}

        {/* Error Alert Message */}
        {errorMsg && !rateLimit.locked && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold">{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Password-Only Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-slate-700 tracking-wide"
            >
              Master Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <KeyRound className="w-4 h-4 text-amber-600" />
              </div>

              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="current-password"
                disabled={loading || rateLimit.locked}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white text-sm tracking-wide transition-all disabled:opacity-50 font-mono shadow-xs"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || rateLimit.locked}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || rateLimit.locked || !password.trim()}
            className="w-full min-h-[46px] py-3 px-6 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Verifying Password...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Rate-Limit Footer */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-1 relative z-10">
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
            <span>Rate-limit guarded</span>
            <span>·</span>
            <span>Cryptographic Gate</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Protected against brute-force attacks with automatic cooldown locks.
          </p>
        </div>
      </div>
    </div>
  );
};
