import React, { useState, useEffect, useCallback } from 'react';
import type { Post, SiteSettings, AnalyticsSummary } from './types/index';
import { api, getAdminToken, clearAdminToken } from './lib/api';
import { useRouter } from './hooks/useRouter';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { LinkPreparationModal } from './components/LinkPreparationModal';
import { DEFAULT_POST_IMAGE } from './config/constants';

// Views
import { HomeView } from './views/HomeView';
import { PostDetailView } from './views/PostDetailView';
import { LegalViews } from './views/LegalViews';
import { NotFoundView } from './views/NotFoundView';

// Admin Views
import { AdminLogin } from './views/admin/AdminLogin';
import { AdminLayout, AdminTab } from './views/admin/AdminLayout';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminPosts } from './views/admin/AdminPosts';
import { AdminPostEditor } from './views/admin/AdminPostEditor';
import { AdminSettings } from './views/admin/AdminSettings';
import { AdminAnalytics } from './views/admin/AdminAnalytics';
import { AdminSecurity } from './views/admin/AdminSecurity';
import { AdminAutomation } from './views/admin/AdminAutomation';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'CryptoPacket',
  siteDescription: 'Discover community-shared crypto red packets on CryptoPacket. Explore active packets and follow the available access steps.',
  portfolioUrl: 'https://developersohelrana.pages.dev',
  portfolioButtonText: 'Built by Sohel Rana',
  firstAdUrl: 'https://sponsor.cryptopacket.net/access-step-1',
  secondAdUrl: 'https://sponsor.cryptopacket.net/access-step-2',
  adsEnabled: true,
  verificationDuration: 10,
  maintenanceMode: false,
  seoTitle: 'CryptoPacket — Discover Crypto Red Packets',
  seoDescription: 'Discover community-shared crypto red packets on CryptoPacket. Explore active packets and follow the available access steps.',
  socialImage: '/pwa-512x512.png',
  footerText: 'CryptoPacket is an independent community platform and is not affiliated with or endorsed by Binance.',
  defaultThumbnail: DEFAULT_POST_IMAGE,
  automationCron: '0 */6 * * *',
  automationStatus: 'Not Configured',
  lastAutomationRun: null,
  nextAutomationRun: null,
  disclaimerText: 'CryptoPacket is an independent community website and is not affiliated with or endorsed by Binance.'
};

export function App() {
  const { pathname, navigate, isPostDetail, postSlug, isAdmin, editPostId } = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Link Preparation Modal
  const [activePreparationPacket, setActivePreparationPacket] = useState<Post | null>(null);

  // Admin Workspace State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Initial Data Fetch
  const loadPublicData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedPosts] = await Promise.all([
        api.getSettings().catch(() => DEFAULT_SETTINGS),
        api.getPosts().catch(() => [])
      ]);
      setSettings(fetchedSettings);
      setPosts(fetchedPosts);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // Check Admin Authentication
  const checkAdminAuth = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setIsAdminAuthenticated(false);
      return;
    }

    try {
      const me = await api.adminMe();
      if (me.authenticated) {
        setIsAdminAuthenticated(true);
        // Load admin data
        const [postsList, analyticsData, fullSettings] = await Promise.all([
          api.getAdminPosts(),
          api.getAnalytics(),
          api.getAdminSettings()
        ]);
        setAdminPosts(postsList);
        setAnalytics(analyticsData);
        setSettings(fullSettings);
      }
    } catch {
      clearAdminToken();
      setIsAdminAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      checkAdminAuth();
    }
  }, [isAdmin, checkAdminAuth]);

  // Refresh admin posts
  const refreshAdminData = async () => {
    try {
      const [postsList, analyticsData, fullSettings] = await Promise.all([
        api.getAdminPosts(),
        api.getAnalytics(),
        api.getAdminSettings()
      ]);
      setAdminPosts(postsList);
      setAnalytics(analyticsData);
      setSettings(fullSettings);
      // Also update public list
      const publicPosts = await api.getPosts();
      setPosts(publicPosts);
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers
  const handleOpenPacket = (post: Post) => {
    setActivePreparationPacket(post);
  };

  const handleViewPostDetails = (post: Post) => {
    navigate(`/post/${post.slug}`);
  };

  // Admin Post actions
  const handleSavePost = async (postData: Partial<Post>) => {
    if (editingPost) {
      await api.updatePost(editingPost.id, postData);
      addToast('Red packet post updated successfully!', 'success');
    } else {
      await api.createPost(postData);
      addToast('New red packet created and published!', 'success');
    }
    await refreshAdminData();
    setAdminTab('posts');
    setEditingPost(null);
  };

  const handleDeletePost = async (id: string) => {
    try {
      await api.deletePost(id);
      addToast('Post removed successfully.', 'info');
      await refreshAdminData();
    } catch (err: any) {
      addToast(err.message || 'Failed to delete post.', 'error');
    }
  };

  const handleDuplicatePost = async (id: string) => {
    try {
      await api.duplicatePost(id);
      addToast('Draft copy created successfully.', 'success');
      await refreshAdminData();
    } catch (err: any) {
      addToast(err.message || 'Failed to duplicate post.', 'error');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'published' | 'draft') => {
    try {
      await api.updatePost(id, { status: newStatus });
      addToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
      await refreshAdminData();
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveSettings = async (updatedSettings: Partial<SiteSettings>) => {
    const res = await api.updateAdminSettings(updatedSettings);
    setSettings(res);
  };

  // Maintenance mode handling
  if (settings.maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center text-slate-900">
        <div className="max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="text-3xl font-extrabold font-display">System Maintenance</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            CryptoPacket is temporarily undergoing infrastructure optimization. Please return shortly.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs text-slate-400 hover:text-slate-700 font-mono"
            >
              Administrator Access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= ADMIN ROUTING =================
  if (isAdmin) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#FAFAFA]">
          <AdminLogin
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              refreshAdminData();
              navigate('/admin/dashboard');
            }}
            onNavigate={navigate}
            onToast={addToast}
          />
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => {
            if (tab === 'new-post') {
              setEditingPost(null);
            }
            setAdminTab(tab);
          }}
          onNavigatePublic={navigate}
          onLogout={() => {
            api.adminLogout();
            setIsAdminAuthenticated(false);
            navigate('/');
          }}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              analytics={analytics}
              onEditPost={(id) => {
                const target = adminPosts.find((p) => p.id === id) || null;
                setEditingPost(target);
                setAdminTab('edit-post');
              }}
              onNewPost={() => {
                setEditingPost(null);
                setAdminTab('new-post');
              }}
              onPreviewPost={(slug) => navigate(`/post/${slug}`)}
              onDuplicatePost={handleDuplicatePost}
              onDeletePost={handleDeletePost}
            />
          )}

          {adminTab === 'posts' && (
            <AdminPosts
              posts={adminPosts}
              onNewPost={() => {
                setEditingPost(null);
                setAdminTab('new-post');
              }}
              onEditPost={(id) => {
                const target = adminPosts.find((p) => p.id === id) || null;
                setEditingPost(target);
                setAdminTab('edit-post');
              }}
              onPreviewPost={(slug) => navigate(`/post/${slug}`)}
              onDuplicatePost={handleDuplicatePost}
              onDeletePost={handleDeletePost}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {(adminTab === 'new-post' || adminTab === 'edit-post') && (
            <AdminPostEditor
              post={editingPost}
              onSave={handleSavePost}
              onCancel={() => {
                setEditingPost(null);
                setAdminTab('posts');
              }}
              onToast={addToast}
            />
          )}

          {adminTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onSave={handleSaveSettings}
              onToast={addToast}
            />
          )}

          {adminTab === 'analytics' && <AdminAnalytics analytics={analytics} />}

          {adminTab === 'security' && <AdminSecurity onToast={addToast} />}

          {adminTab === 'automation' && (
            <AdminAutomation
              settings={settings}
              onRefreshSettings={refreshAdminData}
              onToast={addToast}
            />
          )}
        </AdminLayout>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // ================= PUBLIC ROUTING =================
  let content: React.ReactNode = null;

  if (isPostDetail && postSlug) {
    const post = posts.find((p) => p.slug === postSlug);
    if (post) {
      const related = posts.filter((p) => p.id !== post.id);
      content = (
        <PostDetailView
          post={post}
          settings={settings}
          relatedPosts={related}
          onOpenPacket={handleOpenPacket}
          onNavigate={navigate}
          onToast={addToast}
        />
      );
    } else {
      content = <NotFoundView onNavigate={navigate} />;
    }
  } else if (pathname === '/privacy') {
    content = <LegalViews type="privacy" onNavigate={navigate} onToast={addToast} />;
  } else if (pathname === '/terms') {
    content = <LegalViews type="terms" onNavigate={navigate} onToast={addToast} />;
  } else if (pathname === '/disclaimer') {
    content = <LegalViews type="disclaimer" onNavigate={navigate} onToast={addToast} />;
  } else if (pathname === '/contact') {
    content = <LegalViews type="contact" onNavigate={navigate} onToast={addToast} />;
  } else if (pathname === '/') {
    content = (
      <HomeView
        posts={posts}
        settings={settings}
        onOpenPacket={handleOpenPacket}
        onViewDetails={handleViewPostDetails}
        onNavigate={navigate}
      />
    );
  } else {
    content = <NotFoundView onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Platform Navigation Header with Contact Developer Button */}
      <Header
        onNavigate={navigate}
        currentPath={pathname}
        portfolioUrl={settings.portfolioUrl}
      />

      {/* 3. Main Dynamic Content */}
      <main className="flex-1 w-full">{content}</main>

      {/* 4. Comprehensive Public Footer */}
      <Footer onNavigate={navigate} portfolioUrl={settings.portfolioUrl} />

      {/* 5. Link Preparation & Advertising Interstitial Modal */}
      {activePreparationPacket && (
        <LinkPreparationModal
          post={activePreparationPacket}
          settings={settings}
          isOpen={!!activePreparationPacket}
          onClose={() => setActivePreparationPacket(null)}
          onSuccessDestination={() => {
            addToast('Redirecting to verified external destination...', 'info');
          }}
        />
      )}

      {/* 6. Notifications Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
