import React from 'react';
import {
  Flame
} from 'lucide-react';
import type { AnalyticsSummary } from '../../types/index';

interface AdminAnalyticsProps {
  analytics: AnalyticsSummary | null;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
          Analytics & Audience Insights
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics for user discovery, device distribution, and red packet engagement.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="text-slate-500 text-xs font-mono font-medium">TODAY’S ENGAGEMENT</div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {analytics.todayViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-mono font-medium">Verified distinct clicks</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="text-slate-500 text-xs font-mono font-medium">LAST 7 DAYS</div>
          <div className="text-3xl font-bold font-mono text-amber-600 tabular-nums">
            {analytics.viewsLast7Days.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Weekly active run rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="text-slate-500 text-xs font-mono font-medium">LAST 30 DAYS</div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {analytics.viewsLast30Days.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Trailing monthly total</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="text-slate-500 text-xs font-mono font-medium">ALL-TIME TOTAL</div>
          <div className="text-3xl font-bold font-mono text-amber-600 tabular-nums">
            {analytics.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Cumulative packet claims</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing Packets */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Top Performing Red Packets</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 font-medium">Ranked by Views</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-bold">#</th>
                  <th className="py-2.5 px-3 font-bold">Packet Title</th>
                  <th className="py-2.5 px-3 font-bold">Category</th>
                  <th className="py-2.5 px-3 text-right font-bold">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {analytics.topPosts.map((post, idx) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{post.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">/post/{post.slug}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{post.category}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-600 font-bold">
                      {post.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device & Client Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 font-display">Client Device Split</h3>

          <div className="space-y-4 text-xs">
            {analytics.devices.map((d) => (
              <div key={d.device} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">{d.device}</span>
                  <span className="font-mono text-slate-900 font-bold">{d.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${d.percentage}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            Over 75% of CryptoPacket traffic arrives on mobile devices. All cards and interactive buttons are designed for touch screens and 2-column mobile layouts.
          </div>
        </div>
      </div>
    </div>
  );
};
