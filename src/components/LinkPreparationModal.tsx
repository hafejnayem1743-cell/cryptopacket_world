import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import type { Post, SiteSettings } from '../types/index';
import { api } from '../lib/api';

interface LinkPreparationModalProps {
  post: Post;
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
  onSuccessDestination?: (url: string) => void;
}

export const LinkPreparationModal: React.FC<LinkPreparationModalProps> = ({
  post,
  settings,
  isOpen,
  onClose,
  onSuccessDestination
}) => {
  // Step 1: Initial Security Inspection & Ad 1
  // Step 2: Second Access Confirmation & 10s Circular Countdown
  // Step 3: Destination Ready -> Redirect to Red Packet
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState<number>(settings.verificationDuration || 10);
  const [timerActive, setTimerActive] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [resolvingError, setResolvingError] = useState<string | null>(null);
  const [firstAdOpened, setFirstAdOpened] = useState(false);
  const [secondAdOpened, setSecondAdOpened] = useState(false);

  const durationTotal = settings.verificationDuration || 10;
  const adsEnabled = settings.adsEnabled !== false;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsVerifying(false);
      setCountdown(durationTotal);
      setTimerActive(false);
      setResolvedUrl(null);
      setResolvingError(null);
      setFirstAdOpened(false);
      setSecondAdOpened(false);

      // Pre-resolve destination via secure server API
      api
        .resolveDestination(post.slug)
        .then((res) => {
          if (res.success && res.destinationUrl) {
            setResolvedUrl(res.destinationUrl);
          }
        })
        .catch((err) => {
          setResolvingError(err.message || 'Failed to resolve packet destination');
        });

      // Increment view count on open
      api.incrementView(post.slug).catch(() => {});
    }
  }, [isOpen, post.slug, durationTotal]);

  // Countdown timer logic for Step 2
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setStep(3);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, countdown]);

  if (!isOpen) return null;

  // Action 1: First Step "Continue"
  const handleContinueStep1 = () => {
    setIsVerifying(true);

    if (adsEnabled && settings.firstAdUrl) {
      try {
        window.open(settings.firstAdUrl, '_blank', 'noopener,noreferrer');
        setFirstAdOpened(true);
      } catch (e) {
        console.warn('Popup blocked by browser policy:', e);
      }
    }

    // Brief smooth security animation transition
    setTimeout(() => {
      setIsVerifying(false);
      if (!adsEnabled) {
        setStep(3);
      } else {
        setStep(2);
      }
    }, 1200);
  };

  // Action 2: Second Step "Unlock Red Packet"
  const handleUnlockStep2 = () => {
    if (adsEnabled && settings.secondAdUrl) {
      try {
        window.open(settings.secondAdUrl, '_blank', 'noopener,noreferrer');
        setSecondAdOpened(true);
      } catch (e) {
        console.warn('Popup blocked by browser policy:', e);
      }
    }

    // Start 10-second countdown
    setTimerActive(true);
  };

  // Action 3: Final Step "Open Red Packet"
  const handleFinalOpen = () => {
    const targetUrl = resolvedUrl || post.destinationUrl;
    if (onSuccessDestination) {
      onSuccessDestination(targetUrl);
    }
    // Safe redirect to external destination
    window.location.href = targetUrl;
  };

  // Circular progress calculation
  const progressPercent = ((durationTotal - countdown) / durationTotal) * 100;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900">
        {/* Soft light decorative ambient accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-56 h-56 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-56 h-56 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges & Stepper */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono tracking-wider uppercase">Link Preparation Flow</span>
          </div>

          <div className="text-xs font-mono text-slate-500 font-medium">
            Step {step} of 3
          </div>
        </div>

        {/* ================= STEP 1: INITIAL SECURITY INSPECTION ================= */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            {/* Animated Shield Visual */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
              <div className="relative w-18 h-18 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-9 h-9 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Preparing Your Destination
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                CryptoPacket verifies destination link integrity and filters unauthorized redirects. Complete the step below to access your red packet.
              </p>
            </div>

            {/* Packet Info snippet */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-medium">Target Red Packet</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{post.title}</div>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Sanitized</span>
              </div>
            </div>

            {/* Advertisement Disclosure */}
            {adsEnabled && settings.firstAdUrl && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="font-semibold">Sponsored Partner Link:</strong> Clicking continue may open a verified sponsor in a new tab to keep our directory free.
                </div>
              </div>
            )}

            {resolvingError && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {resolvingError}
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinueStep1}
              disabled={isVerifying}
              className="w-full min-h-[46px] py-3 px-6 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Inspecting Link...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ================= STEP 2: SECOND AD & 10s COUNTDOWN ================= */}
        {step === 2 && (
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            {/* Circular Progress & Countdown Indicator */}
            <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#F0B90B"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {countdown}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                  {timerActive ? 'Sec Left' : 'Ready'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Your Red Packet Is Almost Ready
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                {timerActive
                  ? 'Final verification in progress. Destination link unlocking automatically...'
                  : 'Click below to initiate the final access step and begin the countdown.'}
              </p>
            </div>

            {/* Advertisement notice */}
            {adsEnabled && settings.secondAdUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Community Sponsor Step:</strong> Red packets are provided free of charge through verified community sponsors.
                </div>
              </div>
            )}

            {/* Button */}
            {!timerActive ? (
              <button
                onClick={handleUnlockStep2}
                className="w-full min-h-[46px] py-3 px-6 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Unlock Red Packet</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <div className="py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span>Unlocking destination in {countdown}s...</span>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: DESTINATION READY ================= */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
            {/* Success Checkmark Visual */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse" />
              <div className="relative w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Destination Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Verification complete. You can now proceed to open the community-shared Red Packet.
              </p>
            </div>

            {/* External Trust Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between text-slate-800 font-semibold">
                <span>External Link Verified</span>
                <span className="font-mono text-[11px] text-emerald-600">HTTPS Safe</span>
              </div>
              <p className="text-[11px] text-slate-500">
                You will be forwarded to the original Binance Red Packet service.
              </p>
            </div>

            {/* Open Red Packet Button */}
            <button
              onClick={handleFinalOpen}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <span>Open Red Packet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Platform footer inside modal */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          CryptoPacket is an independent community directory and is not affiliated with Binance.
        </div>
      </div>
    </div>
  );
};
