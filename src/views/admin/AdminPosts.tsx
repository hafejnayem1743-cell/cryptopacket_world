import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  FileEdit,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import type { Post } from '../../types/index';
import { DEFAULT_POST_IMAGE } from '../../config/constants';

interface AdminPostsProps {
  posts: Post[];
  onNewPost: () => void;
  onEditPost: (id: string) => void;
  onPreviewPost: (slug: string) => void;
  onDuplicatePost: (id: string) => void;
  onDeletePost: (id: string) => void;
  onToggleStatus: (id: string, newStatus: 'published' | 'draft') => void;
}

export const AdminPosts: React.FC<AdminPostsProps> = ({
  posts,
  onNewPost,
  onEditPost,
  onPreviewPost,
  onDuplicatePost,
  onDeletePost,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Red Packet Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all active and draft red packet posts ({posts.length} total)
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Red Packet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['all', 'published', 'draft'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === filter
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Packet Title & Slug</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Views</th>
                <th className="py-3 px-4 font-bold">Destination Preview</th>
                <th className="py-3 px-4 font-bold">Created</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={DEFAULT_POST_IMAGE}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate max-w-xs">
                          {post.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-xs">
                          /post/{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        onToggleStatus(
                          post.id,
                          post.status === 'published' ? 'draft' : 'published'
                        )
                      }
                      title="Click to toggle status"
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-transform active:scale-95 ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </button>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500">{post.category}</td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-900 font-semibold">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 max-w-[160px] truncate">
                    {post.destinationUrl}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
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
                      title="Edit Post"
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
                      onClick={() => setDeleteConfirmId(post.id)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Delete Red Packet?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this red packet post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl btn-secondary-light text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePost(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
