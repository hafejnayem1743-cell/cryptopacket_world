import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Terminal } from 'lucide-react';
import { api } from '../../lib/api';
import type { SiteSettings } from '../../types/index';

interface AdminAutomationProps {
  settings: SiteSettings;
  onRefreshSettings: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdminAutomation: React.FC<AdminAutomationProps> = ({
  settings,
  onRefreshSettings,
  onToast
}) => {
  const [running, setRunning] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleTestTrigger = async () => {
    setRunning(true);
    setResultMessage(null);
    try {
      const res = await api.triggerCronCollector();
      setResultMessage(`Success at ${new Date(res.timestamp).toLocaleTimeString()}: ${res.message}`);
      onToast('Collector executed successfully!', 'success');
      onRefreshSettings();
    } catch (err: any) {
      setResultMessage(`Error: ${err.message || 'Execution failed'}`);
      onToast(err.message || 'Cron trigger failed', 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
          Cron Automation & Remote Collector
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated collection pipeline for scheduled drops and external distribution synchronization.
        </p>
      </div>

      {/* Status Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 font-semibold">AUTOMATION STATUS</div>
              <div className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <span>{settings.automationStatus || 'Ready'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <button
            onClick={handleTestTrigger}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{running ? 'Executing Collector...' : 'Test Trigger Collector'}</span>
          </button>
        </div>

        {resultMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{resultMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-mono">SCHEDULE EXPRESSION</span>
            <div className="font-mono text-slate-900 font-bold text-sm">{settings.automationCron || '0 */6 * * *'}</div>
            <span className="text-[10px] text-slate-400">Every 6 hours</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-mono">LAST RUN TIMESTAMP</span>
            <div className="font-mono text-slate-900 font-bold text-sm">
              {settings.lastAutomationRun
                ? new Date(settings.lastAutomationRun).toLocaleString()
                : 'No runs recorded yet'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-mono">SECURITY HEADER</span>
            <div className="font-mono text-amber-600 font-bold text-sm">x-cron-secret</div>
            <span className="text-[10px] text-slate-400">Protected endpoint</span>
          </div>
        </div>
      </div>

      {/* Cloudflare Worker Deployment Guide */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
          <Terminal className="w-4 h-4 text-amber-500" />
          <span>Cloudflare Cron Trigger Setup Instructions</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          To run automated scheduled collection without keeping a server awake, deploy a lightweight Cloudflare Worker with a Cron Trigger that pings the collector endpoint:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1.5 overflow-x-auto">
          <div className="text-slate-400">// wrangler.toml snippet:</div>
          <div>[triggers]</div>
          <div>crons = ["0 */6 * * *"]</div>
          <div className="pt-2 text-slate-400">// In your Cloudflare Worker:</div>
          <div>export default &#123;</div>
          <div className="pl-4">async scheduled(event, env, ctx) &#123;</div>
          <div className="pl-8">await fetch("https://cryptopacket.com/api/cron/collect", &#123;</div>
          <div className="pl-12">method: "POST",</div>
          <div className="pl-12">headers: &#123; "x-cron-secret": env.CRON_SECRET &#125;</div>
          <div className="pl-8">&#125;);</div>
          <div className="pl-4">&#125;</div>
          <div>&#125;;</div>
        </div>
      </div>
    </div>
  );
};
