/**
 * Administrator Cryptographic Authentication Gate
 * 
 * Provides unified authentication with:
 * 1. Primary path: Server-side PBKDF2/SHA-512 verification via /api/admin/login
 * 2. Static deployment fallback: Web Crypto API SHA-256 digest comparison
 *    (Allows instant deployment to Cloudflare Pages Git without requiring Cloudflare Workers,
 *    D1, KV, Access, or dashboard configuration).
 * 
 * Security Notice:
 * In static-only hosting mode (Cloudflare Pages without active server backend),
 * client-side hashing provides access gating. A full server or edge worker
 * should be connected for enterprise-grade server-side security.
 */

const AUTH_DIGEST = '751fd3e87272d6e5084765a6d74a0178f6fffeb757b6f556f134ebb4b88f7149';
const RATE_LIMIT_KEY = 'cp_admin_auth_attempts';
const RATE_LIMIT_LOCK_KEY = 'cp_admin_auth_lock_until';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface RateLimitStatus {
  locked: boolean;
  remainingAttempts: number;
  remainingMinutes: number;
}

export function getRateLimitStatus(): RateLimitStatus {
  const now = Date.now();
  const lockUntilStr = sessionStorage.getItem(RATE_LIMIT_LOCK_KEY);
  const lockUntil = lockUntilStr ? parseInt(lockUntilStr, 10) : 0;

  if (lockUntil > now) {
    const remainingMinutes = Math.ceil((lockUntil - now) / 60000);
    return {
      locked: true,
      remainingAttempts: 0,
      remainingMinutes
    };
  }

  const attemptsStr = sessionStorage.getItem(RATE_LIMIT_KEY);
  const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - attempts);

  return {
    locked: false,
    remainingAttempts,
    remainingMinutes: 0
  };
}

function recordFailedAttempt(): RateLimitStatus {
  const now = Date.now();
  const attemptsStr = sessionStorage.getItem(RATE_LIMIT_KEY);
  const attempts = (attemptsStr ? parseInt(attemptsStr, 10) : 0) + 1;
  sessionStorage.setItem(RATE_LIMIT_KEY, attempts.toString());

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = now + LOCK_DURATION_MS;
    sessionStorage.setItem(RATE_LIMIT_LOCK_KEY, lockUntil.toString());
    return {
      locked: true,
      remainingAttempts: 0,
      remainingMinutes: 15
    };
  }

  return {
    locked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - attempts,
    remainingMinutes: 0
  };
}

function resetFailedAttempts(): void {
  sessionStorage.removeItem(RATE_LIMIT_KEY);
  sessionStorage.removeItem(RATE_LIMIT_LOCK_KEY);
}

async function computeSha256(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface AuthResult {
  success: boolean;
  token: string;
  expiresAt: number;
  isStaticFallback?: boolean;
}

export async function verifyAndAuthenticate(password: string): Promise<AuthResult> {
  const rateLimit = getRateLimitStatus();
  if (rateLimit.locked) {
    throw new Error(
      `Too many failed login attempts. Access is locked for ${rateLimit.remainingMinutes} more minute(s).`
    );
  }

  if (!password) {
    throw new Error('Please enter the administrator password.');
  }

  // 1. Attempt Server-Side Login First
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    if (isJson) {
      const data = await response.json();
      if (response.ok && data.token) {
        resetFailedAttempts();
        return {
          success: true,
          token: data.token,
          expiresAt: data.expiresAt || Date.now() + 24 * 60 * 60 * 1000
        };
      }

      if (response.status === 429) {
        throw new Error(data.error || 'Too many login attempts. Access locked for 15 minutes.');
      }

      if (response.status === 401 || response.status === 400) {
        const localStatus = recordFailedAttempt();
        if (localStatus.locked) {
          throw new Error('Too many failed login attempts. Access locked for 15 minutes.');
        }
        throw new Error(
          data.error || `Invalid administrator password. ${localStatus.remainingAttempts} attempt(s) remaining.`
        );
      }
    }
  } catch (err: any) {
    // If the error was a legitimate 401/429 response from our backend, re-throw it
    if (err.message && (err.message.includes('Invalid') || err.message.includes('locked'))) {
      throw err;
    }
    // Otherwise, backend is unavailable (e.g. static Cloudflare Pages SPA deployment)
    // Fall through to client-side cryptographic gate
  }

  // 2. Static Deployment Client-Side Fallback (Web Crypto API)
  const computedHash = await computeSha256(password);

  if (computedHash === AUTH_DIGEST) {
    resetFailedAttempts();

    // Generate random session token
    const randomBytes = new Uint8Array(24);
    crypto.getRandomValues(randomBytes);
    const token = 'static_sess_' + Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    // Store in localStorage for persistent session
    localStorage.setItem('cryptopacket_admin_token', token);
    localStorage.setItem('cryptopacket_admin_session_expiry', expiresAt.toString());

    return {
      success: true,
      token,
      expiresAt,
      isStaticFallback: true
    };
  }

  // Verification failed
  const localStatus = recordFailedAttempt();
  if (localStatus.locked) {
    throw new Error('Too many failed login attempts. Access locked for 15 minutes.');
  }

  throw new Error(
    `Invalid administrator password. ${localStatus.remainingAttempts} attempt(s) remaining.`
  );
}
