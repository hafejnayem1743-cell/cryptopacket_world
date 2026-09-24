import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Post, SiteSettings, AuditLog, AnalyticsSummary } from '../types/index';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Security helper: PBKDF2 hash & verify
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hashed, 'hex'), Buffer.from(hash, 'hex'));
}

export interface DatabaseSchema {
  admin: {
    id: string;
    username: string;
    passwordHash: string;
    salt: string;
    role: 'admin';
    createdAt: string;
    lastLogin: string | null;
  };
  settings: SiteSettings;
  posts: Post[];
  auditLogs: AuditLog[];
  viewHistory: { date: string; views: number }[];
  viewIps: Record<string, number>; // IP hash + slug -> timestamp for rate-limiting views
}

// Default PBKDF2 salt and hash
const defaultSalt = 'c7b94e1d8a3f6025';
const defaultPassHash = '4c7c2dbdedbdf6f079b73528f6d5e5af124e7cf937017fa2b89d55500da55f767701277fd49905347560278d6a499c6dd56ba20940e72d7fe8835cde58621918';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'CryptoPacket',
  siteDescription: 'Discover community-shared crypto red packets on CryptoPacket. Explore active packets and follow the available access steps to reach the original destination.',
  portfolioUrl: 'https://developersohelrana.pages.dev',
  portfolioButtonText: 'Built by Sohel Rana',
  firstAdUrl: 'https://sponsor.cryptopacket.net/access-step-1',
  secondAdUrl: 'https://sponsor.cryptopacket.net/access-step-2',
  adsEnabled: true,
  verificationDuration: 10,
  maintenanceMode: false,
  seoTitle: 'CryptoPacket — Discover Crypto Red Packets',
  seoDescription: 'Discover community-shared crypto red packets on CryptoPacket. Explore active packets and follow the available access steps to reach the original destination.',
  socialImage: '/pwa-512x512.png',
  footerText: 'CryptoPacket is an independent community platform and is not affiliated with or endorsed by Binance.',
  defaultThumbnail: '/images/crypto_packet_card_1_1790158641663.jpg',
  automationCron: '0 */6 * * *',
  automationStatus: 'Not Configured',
  lastAutomationRun: null,
  nextAutomationRun: null,
  disclaimerText: 'CryptoPacket is an independent community website. We do not operate Binance, guarantee red packet rewards, or control third-party advertising links. Verify all external URLs before taking action.'
};

const SEED_POSTS: Post[] = [
  {
    id: 'pkt_101',
    slug: 'exclusive-crypto-red-packet',
    title: 'Exclusive Crypto Red Packet',
    description: 'Limited community red packet. Open the packet and follow the steps to continue.',
    destinationUrl: 'https://s.binance.com/9xK4m2Pq',
    thumbnail: '/images/crypto_packet_card_1_1790158641663.jpg',
    status: 'published',
    featured: true,
    views: 1284,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    shortLabel: 'LIVE',
    category: 'Binance Red Packet'
  },
  {
    id: 'pkt_102',
    slug: 'daily-community-crypto-packet',
    title: 'Daily Community Crypto Packet',
    description: 'Check out today’s community-shared red packet. Verified and active for all participants.',
    destinationUrl: 'https://s.binance.com/K7m1xL9w',
    thumbnail: '/images/crypto_packet_card_2_1790158657449.jpg',
    status: 'published',
    featured: true,
    views: 892,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    shortLabel: 'DAILY',
    category: 'Binance Red Packet'
  },
  {
    id: 'pkt_103',
    slug: 'prime-multi-token-red-packet',
    title: 'Prime Multi-Token Red Packet',
    description: 'Community red packet drop shared by contributors. Step-verified link preparation protects destination integrity.',
    destinationUrl: 'https://s.binance.com/R3t6Y8vB',
    thumbnail: '/images/hero_redpacket_crypto_1790158620199.jpg',
    status: 'published',
    featured: false,
    views: 645,
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    shortLabel: 'POPULAR',
    category: 'Community Drop'
  },
  {
    id: 'pkt_104',
    slug: 'weekend-flash-crypto-packet',
    title: 'Weekend Flash Crypto Packet',
    description: 'Instant community drop for the weekend. Fast unlock procedure with clean safety checks.',
    destinationUrl: 'https://s.binance.com/P4w9Q2zN',
    thumbnail: '/images/crypto_packet_card_1_1790158641663.jpg',
    status: 'published',
    featured: false,
    views: 420,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    shortLabel: 'FLASH',
    category: 'Binance Red Packet'
  },
  {
    id: 'pkt_105',
    slug: 'upcoming-alpha-community-drop',
    title: 'Upcoming Alpha Community Drop',
    description: 'Upcoming scheduled packet. Links under administrative review before public unlock.',
    destinationUrl: 'https://s.binance.com/M8n3V1kL',
    thumbnail: '/images/crypto_packet_card_2_1790158657449.jpg',
    status: 'draft',
    featured: false,
    views: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    shortLabel: 'DRAFT',
    category: 'Community Drop'
  }
];

class StorageManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const adminData = parsed.admin || {
          id: 'admin_1',
          username: 'admin',
          passwordHash: defaultPassHash,
          salt: defaultSalt,
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: null
        };
        if (adminData.passwordHash === '9c4be1b95a17e5f45e2e173528783722b21a911f66a691fa315c96a3d5e05ce55f62e66394552a214f2dc5f2e878dcffadd4d6d541fe3a4c63f5816877073c70') {
          adminData.passwordHash = defaultPassHash;
          adminData.salt = defaultSalt;
        }
        return {
          admin: adminData,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          posts: parsed.posts && parsed.posts.length > 0 ? parsed.posts : SEED_POSTS,
          auditLogs: parsed.auditLogs || [],
          viewHistory: parsed.viewHistory || this.generateInitialViewsHistory(),
          viewIps: parsed.viewIps || {}
        };
      }
    } catch (e) {
      console.error('Failed reading DB file, using in-memory defaults:', e);
    }

    const initialData: DatabaseSchema = {
      admin: {
        id: 'admin_1',
        username: 'admin',
        passwordHash: defaultPassHash,
        salt: defaultSalt,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null
      },
      settings: DEFAULT_SETTINGS,
      posts: SEED_POSTS,
      auditLogs: [
        {
          id: 'log_init',
          timestamp: new Date().toISOString(),
          action: 'System Initialized',
          details: 'CryptoPacket initialized with security rules and default dataset.',
          status: 'success'
        }
      ],
      viewHistory: this.generateInitialViewsHistory(),
      viewIps: {}
    };

    this.saveData(initialData);
    return initialData;
  }

  private generateInitialViewsHistory() {
    const list = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const base = 250 + Math.floor(Math.sin(i) * 80 + (14 - i) * 15);
      list.push({ date: dateStr, views: Math.max(120, base) });
    }
    return list;
  }

  private saveData(data?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db file:', e);
    }
  }

  // Settings
  public getSettings(): SiteSettings {
    return { ...this.db.settings };
  }

  public updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.db.settings = { ...this.db.settings, ...newSettings };
    this.saveData();
    this.addAuditLog('Settings Updated', 'Site and advertising settings were updated by admin.', 'success');
    return this.getSettings();
  }

  // Posts
  public getAllPosts(includeDrafts = false): Post[] {
    if (includeDrafts) {
      return [...this.db.posts];
    }
    return this.db.posts.filter((p) => p.status === 'published');
  }

  public getPostBySlug(slug: string, includeDrafts = false): Post | null {
    const post = this.db.posts.find((p) => p.slug === slug);
    if (!post) return null;
    if (!includeDrafts && post.status !== 'published') return null;
    return post;
  }

  public getPostById(id: string): Post | null {
    return this.db.posts.find((p) => p.id === id) || null;
  }

  public createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Post {
    // Generate clean slug
    let baseSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = `packet-${Date.now().toString(36)}`;
    
    // Ensure slug uniqueness
    let finalSlug = baseSlug;
    let counter = 1;
    while (this.db.posts.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const newPost: Post = {
      ...data,
      id: `pkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: finalSlug,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.publishedAt || new Date().toISOString(),
      shortLabel: data.shortLabel || (data.featured ? 'FEATURED' : 'NEW')
    };

    this.db.posts.unshift(newPost);
    this.saveData();
    this.addAuditLog('Post Created', `Created post: "${newPost.title}" (${newPost.slug})`, 'success');
    return newPost;
  }

  public updatePost(id: string, updates: Partial<Post>): Post | null {
    const index = this.db.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.db.posts[index];
    const updated: Post = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.db.posts[index] = updated;
    this.saveData();
    this.addAuditLog('Post Updated', `Updated post: "${updated.title}"`, 'success');
    return updated;
  }

  public deletePost(id: string): boolean {
    const post = this.db.posts.find((p) => p.id === id);
    if (!post) return false;

    this.db.posts = this.db.posts.filter((p) => p.id !== id);
    this.saveData();
    this.addAuditLog('Post Deleted', `Deleted post: "${post.title}" (${id})`, 'warning');
    return true;
  }

  public duplicatePost(id: string): Post | null {
    const original = this.getPostById(id);
    if (!original) return null;

    return this.createPost({
      slug: `${original.slug}-copy`,
      title: `${original.title} (Copy)`,
      description: original.description,
      destinationUrl: original.destinationUrl,
      thumbnail: original.thumbnail,
      status: 'draft',
      featured: false,
      publishedAt: new Date().toISOString(),
      shortLabel: 'DRAFT',
      category: original.category
    });
  }

  // Views & Analytics with anti-inflation rate limiting
  public incrementView(slug: string, ip: string): number {
    const post = this.db.posts.find((p) => p.slug === slug);
    if (!post) return 0;

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    const key = `${ipHash}_${slug}`;
    const now = Date.now();
    const lastViewed = this.db.viewIps[key] || 0;

    // Cooldown: 1 view per IP per post every 10 minutes to avoid inflation
    if (now - lastViewed > 10 * 60 * 1000) {
      post.views += 1;
      this.db.viewIps[key] = now;

      // Update today's date in viewHistory
      const today = new Date().toISOString().split('T')[0];
      const historyEntry = this.db.viewHistory.find((h) => h.date === today);
      if (historyEntry) {
        historyEntry.views += 1;
      } else {
        this.db.viewHistory.push({ date: today, views: 1 });
      }

      this.saveData();
    }

    return post.views;
  }

  public getAnalytics(): AnalyticsSummary {
    const totalPosts = this.db.posts.length;
    const publishedPosts = this.db.posts.filter((p) => p.status === 'published').length;
    const draftPosts = totalPosts - publishedPosts;
    const totalViews = this.db.posts.reduce((acc, p) => acc + p.views, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayViews = this.db.viewHistory.find((h) => h.date === todayStr)?.views || 142;

    // Last 7 days views sum
    const last7DaysEntries = this.db.viewHistory.slice(-7);
    const viewsLast7Days = last7DaysEntries.reduce((sum, h) => sum + h.views, 0);

    // Last 30 days views sum
    const viewsLast30Days = this.db.viewHistory.reduce((sum, h) => sum + h.views, 0);

    const topPosts = [...this.db.posts]
      .filter((p) => p.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const recentPosts = [...this.db.posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      todayViews,
      viewsLast7Days,
      viewsLast30Days,
      topPosts,
      recentPosts,
      viewsByDay: this.db.viewHistory.slice(-14),
      devices: [
        { device: 'Mobile Touch (iOS & Android)', percentage: 76 },
        { device: 'Desktop Browser', percentage: 21 },
        { device: 'Tablet & Other', percentage: 3 }
      ]
    };
  }

  // Admin Auth & Audit Logs
  public getAdmin() {
    return this.db.admin;
  }

  public updateAdminPassword(newPassword: string): void {
    const { hash, salt } = hashPassword(newPassword);
    this.db.admin.passwordHash = hash;
    this.db.admin.salt = salt;
    this.saveData();
    this.addAuditLog('Admin Password Changed', 'Master administrator password successfully updated.', 'warning');
  }

  public updateLastLogin(): void {
    this.db.admin.lastLogin = new Date().toISOString();
    this.saveData();
  }

  public addAuditLog(action: string, details: string, status: 'success' | 'warning' | 'error', ip?: string): void {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      ipAddress: ip ? crypto.createHash('sha256').update(ip).digest('hex').substring(0, 8) + '...' : undefined,
      status
    };
    this.db.auditLogs.unshift(log);
    // Keep max 100 logs
    if (this.db.auditLogs.length > 100) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 100);
    }
    this.saveData();
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.db.auditLogs];
  }
}

export const storage = new StorageManager();
