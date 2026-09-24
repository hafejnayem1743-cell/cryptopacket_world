import React from 'react';
import {
  Eye,
  FileCheck,
  FileEdit,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Copy,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import type { AnalyticsSummary, Post } from '../../types/index';
import { DEFAULT_POST_IMAGE } from '../../config/constants';

interface AdminDashboardProps {
  analytics: AnalyticsSummary | null;
  onEditPost: (id: string) => void;
  onNewPost: () => void;
  onPreviewPost: (slug: string) => void;
  onDuplicatePost: (id: string) => void;
  onDeletePost: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  onEditPost,
  onNewPost,
  onPreviewPost,
  onDuplicatePost,
  onDeletePost
}) => {
  if (!analytics) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading workspace analytics...</span>
      </div>
    );
  }

  // Calculate highest view count for chart scaling
  const maxDayViews = Math.max(...analytics.viewsByDay.map((d) => d.views), 10);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Welcome to CryptoPacket Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time packet discovery metrics, destination link health, and sponsorship tracking.
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Red Packet</span>
        </button>
      </div>

      {/* Metric Cards Grid (Light Mode) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Views */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
            <span>TOTAL CLAIMS / VIEWS</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% from last week</span>
          </div>
        </div>

        {/* Card 2: Published Packets */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
            <span>PUBLISHED DROPS</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics.publishedPosts}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Active and public for visitors
          </div>
        </div>

        {/* Card 3: Draft Packets */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
            <span>DRAFT / REVIEW</span>
            <FileEdit className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics.draftPosts}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Unpublished drops
          </div>
        </div>

        {/* Card 4: Today's Views */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
            <span>TODAY’S ACTIVITY</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics.todayViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Unique verified visits
          </div>
        </div>
      </div>

      {/* 14-Day View History Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              14-Day Traffic & Engagement Trend
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated daily views across all community red packet links.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
            Real-time
          </span>
        </div>

        {/* SVG / CSS Bar Graph */}
        <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto bg-slate-50 rounded-xl border border-slate-100">
          {analytics.viewsByDay.map((day, idx) => {
            const heightPercent = Math.max(12, (day.views / maxDayViews) * 100);
            const isLatest = idx === analytics.viewsByDay.length - 1;

            return (
              <div
                key={day.date}
                className="flex-1 min-w-[28px] flex flex-col items-center gap-1.5 group h-full justify-end"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap">
                  {day.views} views
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all ${
                    isLatest
                      ? 'bg-amber-400 group-hover:bg-amber-500'
                      : 'bg-slate-300 hover:bg-amber-300'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-400">
                  {day.date.split('-').slice(1).join('/')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 font-display">Recent Red Packets</h3>
            <p className="text-xs text-slate-500">Recently created and updated distributions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Packet Title</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Views</th>
                <th className="py-3 px-4 font-bold">Created</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={DEFAULT_POST_IMAGE}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                      <div>
                        <div className="font-bold text-slate-900">{post.title}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-xs">
                          /post/{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{post.category}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-900 font-medium">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => onPreviewPost(post.slug)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Preview on Public Site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditPost(post.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-colors"
                      title="Edit Packet"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicatePost(post.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Duplicate Post"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
