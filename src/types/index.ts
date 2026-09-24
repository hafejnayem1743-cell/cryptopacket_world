export type PostStatus = 'published' | 'draft' | 'archived';

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  destinationUrl: string;
  thumbnail: string;
  status: PostStatus;
  featured: boolean;
  views: number;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
  publishedAt: string; // ISO 8601 UTC
  shortLabel?: string; // e.g. "HOT", "DAILY", "COMMUNITY", "EXCLUSIVE"
  category?: string; // e.g. "Binance Red Packet"
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  portfolioUrl: string;
  portfolioButtonText: string;
  firstAdUrl: string;
  secondAdUrl: string;
  adsEnabled: boolean;
  verificationDuration: number; // in seconds, default 10
  maintenanceMode: boolean;
  seoTitle: string;
  seoDescription: string;
  socialImage: string;
  footerText: string;
  defaultThumbnail: string;
  automationCron: string;
  automationStatus: 'Not Configured' | 'Configured' | 'Running' | 'Paused';
  lastAutomationRun: string | null;
  nextAutomationRun: string | null;
  disclaimerText: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  todayViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  topPosts: Post[];
  recentPosts: Post[];
  viewsByDay: { date: string; views: number }[];
  devices: { device: string; percentage: number }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ipAddress?: string;
  status: 'success' | 'warning' | 'error';
}

export interface AdminSession {
  token: string;
  username: string;
  role: 'admin';
  expiresAt: number;
}
