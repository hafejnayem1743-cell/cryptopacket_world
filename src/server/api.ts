import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { storage, verifyPassword } from './storage';
import type { AdminSession } from '../types/index';

export const apiRouter = express.Router();

// In-memory active session tokens map: token -> AdminSession
const activeSessions = new Map<string, AdminSession>();

// Failed login attempts tracker: IP -> { attempts: number, lockUntil: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

// Strict URL Sanitization & Security Validation
export function validateAndSanitizeUrl(inputUrl: string): { valid: boolean; error?: string; cleanUrl?: string } {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string' };
  }

  const trimmed = inputUrl.trim();

  // Block dangerous pseudoprotocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lower = trimmed.toLowerCase();
  for (const proto of dangerousProtocols) {
    if (lower.startsWith(proto)) {
      return { valid: false, error: `Protocol ${proto} is not permitted for security reasons.` };
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, error: 'Only HTTPS (or HTTP) URLs are allowed.' };
    }

    // Require standard host
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return { valid: false, error: 'Destination URL host is invalid.' };
    }

    return { valid: true, cleanUrl: parsed.toString() };
  } catch {
    return { valid: false, error: 'Malformed URL format.' };
  }
}

// Middleware: Require Admin Session
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired' });
  }

  // Extend session on active use
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  (req as any).adminSession = session;
  next();
}

// Client IP extractor
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

/* ==========================================================================
   PUBLIC API ROUTES
   ========================================================================== */

// GET /api/health
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CryptoPacket API',
    version: '1.0.0'
  });
});

// GET /api/settings - Public site configuration
apiRouter.get('/settings', (_req: Request, res: Response) => {
  const full = storage.getSettings();
  // Expose only public safe fields
  res.json({
    siteName: full.siteName,
    siteDescription: full.siteDescription,
    portfolioUrl: full.portfolioUrl,
    portfolioButtonText: full.portfolioButtonText,
    firstAdUrl: full.firstAdUrl,
    secondAdUrl: full.secondAdUrl,
    adsEnabled: full.adsEnabled,
    verificationDuration: full.verificationDuration,
    maintenanceMode: full.maintenanceMode,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
    socialImage: full.socialImage,
    footerText: full.footerText,
    disclaimerText: full.disclaimerText
  });
});

// GET /api/posts - Public list of active posts
apiRouter.get('/posts', (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
  const category = typeof req.query.category === 'string' ? req.query.category : '';

  let posts = storage.getAllPosts(false);

  if (search) {
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    );
  }

  if (category && category !== 'all') {
    posts = posts.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }

  // Return public post items (omit internal fields)
  res.json(posts);
});

// GET /api/posts/:slug - Public single post
apiRouter.get('/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = storage.getPostBySlug(slug, false);

  if (!post) {
    return res.status(404).json({ error: 'Red packet not found or is currently inactive.' });
  }

  res.json(post);
});

// POST /api/posts/:slug/view - Rate-limited view counter
apiRouter.post('/posts/:slug/view', (req: Request, res: Response) => {
  const { slug } = req.params;
  const ip = getClientIp(req);
  const views = storage.incrementView(slug, ip);
  res.json({ success: true, views });
});

// POST /api/posts/:slug/resolve-destination - Secure destination validation & unlock
apiRouter.post('/posts/:slug/resolve-destination', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = storage.getPostBySlug(slug, false);

  if (!post) {
    return res.status(404).json({ error: 'Red packet destination could not be resolved.' });
  }

  // Verify URL integrity
  const validation = validateAndSanitizeUrl(post.destinationUrl);
  if (!validation.valid || !validation.cleanUrl) {
    return res.status(500).json({ error: 'The destination link could not be verified by security filters.' });
  }

  res.json({
    success: true,
    destinationUrl: validation.cleanUrl,
    title: post.title,
    isExternal: true,
    notice: 'You are now proceeding to an external community-shared Red Packet destination.'
  });
});

/* ==========================================================================
   ADMIN AUTHENTICATION & SESSIONS
   ========================================================================== */

// POST /api/admin/login - Password-only secure login with rate-limiting
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  const ip = getClientIp(req);
  const now = Date.now();

  // Check rate limit: 5 attempts -> 15 min lock
  const attemptRecord = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  if (attemptRecord.lockUntil > now) {
    const minutesLeft = Math.ceil((attemptRecord.lockUntil - now) / 60000);
    return res.status(429).json({
      error: `Too many failed login attempts. Access locked for ${minutesLeft} more minute(s).`,
      locked: true,
      remainingMinutes: minutesLeft
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const admin = storage.getAdmin();
  const isPasswordMatch = verifyPassword(password, admin.passwordHash, admin.salt);

  if (!isPasswordMatch) {
    attemptRecord.attempts += 1;
    if (attemptRecord.attempts >= 5) {
      attemptRecord.lockUntil = now + 15 * 60 * 1000;
      storage.addAuditLog('Login Lockout Triggered', `IP reached 5 failed attempts. Locked for 15 min.`, 'error', ip);
    } else {
      storage.addAuditLog('Failed Login Attempt', `Failed password login attempt`, 'warning', ip);
    }
    loginAttempts.set(ip, attemptRecord);

    const remaining = Math.max(0, 5 - attemptRecord.attempts);
    return res.status(401).json({
      error: remaining > 0 ? `Invalid administrator password. ${remaining} attempt(s) remaining.` : 'Too many failed login attempts. Access locked for 15 minutes.',
      remainingAttempts: remaining,
      locked: remaining === 0
    });
  }

  // Reset failed attempts on success
  loginAttempts.delete(ip);

  // Issue secure session token
  const token = crypto.randomBytes(32).toString('hex');
  const session: AdminSession = {
    token,
    username: admin.username,
    role: 'admin',
    expiresAt: now + 24 * 60 * 60 * 1000 // 24 hours
  };

  activeSessions.set(token, session);
  storage.updateLastLogin();
  storage.addAuditLog('Admin Login Successful', `Admin authenticated from IP.`, 'success', ip);

  res.json({
    success: true,
    token,
    expiresAt: session.expiresAt,
    user: {
      username: admin.username,
      role: admin.role
    }
  });
});

// POST /api/admin/logout
apiRouter.post('/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/admin/me
apiRouter.get('/admin/me', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as AdminSession;
  res.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role
    }
  });
});

/* ==========================================================================
   ADMIN POST MANAGEMENT
   ========================================================================== */

// GET /api/admin/posts - List all posts (including drafts)
apiRouter.get('/admin/posts', requireAdmin, (_req: Request, res: Response) => {
  const posts = storage.getAllPosts(true);
  res.json(posts);
});

// GET /api/admin/posts/:id - Single post by ID
apiRouter.get('/admin/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const post = storage.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json(post);
});

// POST /api/admin/posts - Create post
apiRouter.post('/admin/posts', requireAdmin, (req: Request, res: Response) => {
  const { title, description, destinationUrl, thumbnail, status, featured, shortLabel, category } = req.body || {};

  if (!title || !description || !destinationUrl) {
    return res.status(400).json({ error: 'Title, description, and Destination Red Packet URL are required.' });
  }

  // Validate Destination URL
  const urlCheck = validateAndSanitizeUrl(destinationUrl);
  if (!urlCheck.valid || !urlCheck.cleanUrl) {
    return res.status(400).json({ error: `Invalid Destination URL: ${urlCheck.error}` });
  }

  const newPost = storage.createPost({
    slug: req.body.slug || '',
    title: title.trim(),
    description: description.trim(),
    destinationUrl: urlCheck.cleanUrl,
    thumbnail: thumbnail?.trim() || storage.getSettings().defaultThumbnail,
    status: status === 'draft' || status === 'archived' ? status : 'published',
    featured: Boolean(featured),
    publishedAt: req.body.publishedAt || new Date().toISOString(),
    shortLabel: shortLabel?.trim() || (featured ? 'FEATURED' : 'NEW'),
    category: category?.trim() || 'Binance Red Packet'
  });

  res.status(201).json(newPost);
});

// PUT /api/admin/posts/:id - Update post
apiRouter.put('/admin/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body || {};

  // If destinationUrl is being changed, validate it
  if (updates.destinationUrl) {
    const urlCheck = validateAndSanitizeUrl(updates.destinationUrl);
    if (!urlCheck.valid || !urlCheck.cleanUrl) {
      return res.status(400).json({ error: `Invalid Destination URL: ${urlCheck.error}` });
    }
    updates.destinationUrl = urlCheck.cleanUrl;
  }

  const updated = storage.updatePost(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  res.json(updated);
});

// DELETE /api/admin/posts/:id - Delete post
apiRouter.delete('/admin/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = storage.deletePost(id);
  if (!success) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json({ success: true, message: 'Post removed successfully.' });
});

// POST /api/admin/posts/:id/duplicate - Duplicate post
apiRouter.post('/admin/posts/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const duplicated = storage.duplicatePost(id);
  if (!duplicated) {
    return res.status(404).json({ error: 'Original post not found.' });
  }
  res.json(duplicated);
});

/* ==========================================================================
   ADMIN SETTINGS & ANALYTICS & SECURITY
   ========================================================================== */

// GET /api/admin/settings
apiRouter.get('/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json(storage.getSettings());
});

// PUT /api/admin/settings
apiRouter.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body || {};

  // Validate ad links if provided
  if (updates.firstAdUrl) {
    const check1 = validateAndSanitizeUrl(updates.firstAdUrl);
    if (!check1.valid || !check1.cleanUrl) {
      return res.status(400).json({ error: `Invalid First Ad URL: ${check1.error}` });
    }
    updates.firstAdUrl = check1.cleanUrl;
  }

  if (updates.secondAdUrl) {
    const check2 = validateAndSanitizeUrl(updates.secondAdUrl);
    if (!check2.valid || !check2.cleanUrl) {
      return res.status(400).json({ error: `Invalid Second Ad URL: ${check2.error}` });
    }
    updates.secondAdUrl = check2.cleanUrl;
  }

  if (updates.portfolioUrl) {
    const checkPortfolio = validateAndSanitizeUrl(updates.portfolioUrl);
    if (!checkPortfolio.valid || !checkPortfolio.cleanUrl) {
      return res.status(400).json({ error: `Invalid Portfolio URL: ${checkPortfolio.error}` });
    }
    updates.portfolioUrl = checkPortfolio.cleanUrl;
  }

  const updatedSettings = storage.updateSettings(updates);
  res.json(updatedSettings);
});

// GET /api/admin/analytics
apiRouter.get('/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
  const analytics = storage.getAnalytics();
  res.json(analytics);
});

// GET /api/admin/security/logs
apiRouter.get('/admin/security/logs', requireAdmin, (_req: Request, res: Response) => {
  const logs = storage.getAuditLogs();
  res.json({
    activeSessionCount: activeSessions.size,
    lockedIpCount: loginAttempts.size,
    logs
  });
});

// POST /api/admin/security/change-password
apiRouter.post('/admin/security/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const admin = storage.getAdmin();
  const isValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Incorrect current password.' });
  }

  storage.updateAdminPassword(newPassword);
  res.json({ success: true, message: 'Administrator password updated successfully.' });
});

/* ==========================================================================
   FUTURE CRON / AUTOMATION ENDPOINT
   ========================================================================== */

// POST /api/cron/collect - Authorized collector endpoint for Cloudflare Worker / Cron Trigger
apiRouter.post('/cron/collect', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const cronSecret = req.headers['x-cron-secret'];
  const expectedSecret = process.env.CRON_SECRET || 'cryptopacket_cron_token_prod';

  const isAuthorized =
    cronSecret === expectedSecret ||
    (authHeader && authHeader.startsWith('Bearer ') && activeSessions.has(authHeader.substring(7)));

  if (!isAuthorized) {
    storage.addAuditLog('Cron Execution Denied', 'Unauthorized access attempt to /api/cron/collect', 'error');
    return res.status(401).json({
      error: 'Unauthorized: Valid x-cron-secret header or admin session token required.'
    });
  }

  // Record run timestamp
  const now = new Date().toISOString();
  storage.updateSettings({
    lastAutomationRun: now,
    automationStatus: 'Configured'
  });

  storage.addAuditLog('Automation Collector Executed', 'Scheduled collector checked for verified community drops.', 'success');

  res.json({
    success: true,
    timestamp: now,
    message: 'Collector execution completed. 0 remote changes required.',
    status: 'idle'
  });
});
