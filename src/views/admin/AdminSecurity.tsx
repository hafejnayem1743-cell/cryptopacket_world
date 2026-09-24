import React, { useState, useEffect } from 'react';
import { Shield, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import type { AuditLog } from '../../types/index';

interface AdminSecurityProps {
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({ onToast }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeSessions, setActiveSessions] = useState(1);
  const [lockedIps, setLockedIps] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      const res = await api.getSecurityLogs();
      setLogs(res.logs || []);
      setActiveSessions(res.activeSessionCount || 1);
      setLockedIps(res.lockedIpCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onToast('New password and confirmation do not match.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      onToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    setUpdatingPass(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      onToast('Admin password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadSecurityData();
    } catch (err: any) {
      onToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Security & Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographic access controls, session management, and system event logging.
        </p>
      </div>

      {/* Security Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-mono text-slate-500 font-medium">ACTIVE ADMIN SESSIONS</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{activeSessions}</div>
          <div className="text-[11px] text-slate-400 font-mono">24h token expiration</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-mono text-slate-500 font-medium">IP RATE-LIMIT STATUS</div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {lockedIps === 0 ? 'Normal' : `${lockedIps} Locked`}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">5 attempts / 15 min lock</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-mono text-slate-500 font-medium">PASS HASH ALGORITHM</div>
          <div className="text-2xl font-bold font-mono text-amber-600">PBKDF2-SHA512</div>
          <div className="text-[11px] text-slate-400 font-mono">10,000 salt iterations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Change Password Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 font-display">Update Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPass}
              className="w-full py-2.5 rounded-xl btn-gold font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {updatingPass ? 'Updating...' : 'Update Admin Password'}
            </button>
          </form>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 font-display">System Audit Logs</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Last 100 entries</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
            {logs.map((log) => {
              const badgeColor =
                log.status === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : log.status === 'warning'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200';

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badgeColor}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
