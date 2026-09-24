import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  BarChart3,
  Shield,
  Cpu,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { BrandLogo } from '../../components/BrandLogo';
import { clearAdminToken } from '../../lib/api';

export type AdminTab =
  | 'dashboard'
  | 'posts'
  | 'new-post'
  | 'edit-post'
  | 'settings'
  | 'analytics'
  | 'security'
  | 'automation';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigatePublic: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigatePublic,
  onLogout,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'posts', label: 'Red Packets', icon: FileText },
    { id: 'new-post', label: 'Create Packet', icon: PlusCircle },
    { id: 'settings', label: 'Settings & Ads', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Logs', icon: Shield },
    { id: 'automation', label: 'Cron / Automation', icon: Cpu }
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigatePublic('/')}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation (Light Mode) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-50 transition-transform duration-200 shadow-xs ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Platform Identifier */}
          <div className="space-y-0.5">
            <BrandLogo size="md" />
            <div className="text-[10px] font-mono font-semibold tracking-wider text-amber-600 uppercase pt-1">
              Admin Workspace
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentTab === item.id || (item.id === 'posts' && currentTab === 'edit-post');
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => onNavigatePublic('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono transition-colors border border-slate-200"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              <span>Public Site</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono">Live</span>
          </button>

          <button
            onClick={() => {
              clearAdminToken();
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#F8FAFC] overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 border-b border-slate-200 px-8 items-center justify-between bg-white sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="text-amber-600 font-semibold capitalize">{currentTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </span>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
