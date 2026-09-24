# CryptoPacket 🧧

**CryptoPacket** is an independent, production-ready, mobile-first web application designed for discovering and safely opening community-shared crypto red packets. The website is crafted for an international audience outside Bangladesh with high visual fidelity, rigorous security protections, and an ergonomic interstitial link preparation flow.

> **Legal Disclaimer:** CryptoPacket is an independent community platform and is not affiliated with or endorsed by Binance. Binance Red Packets are an external service provided by Binance.

---

## ⚡ Key Highlights & Architecture

- **Mobile-First Experience**: Built for single-hand mobile touch ergonomics with touch targets $\ge 44\text{px}$, responsive drawers, and zero layout shift.
- **Progressive Web App (PWA)**: Installable on iOS Safari and Android Chrome with offline fallback caching, standalone manifest, and custom branded icons.
- **Interstitial Link Preparation**:
  - **Step 1 ("Security Check")**: Cybernetic animated shield with link integrity verification and transparent partner ad disclosure.
  - **Step 2 ("Your Red Packet Is Almost Ready")**: Circular countdown timer (10s configurable duration) unlocking the verified destination.
  - **Safety First**: Server-side URL sanitization preventing pseudoprotocol injections (`javascript:`, `data:`, `file:`).
  - **Ad Management**: Full admin control to toggle ads ON/OFF, customize partner URLs, or adjust timer intervals.
- **Admin Workspace (`/admin`)**:
  - Protected with PBKDF2-SHA512 password hashing (10,000 salt iterations) and 5-attempt rate-limiting locks.
  - Red packet management: create, edit, duplicate, publish/draft toggle, delete.
  - Live public card preview in the editor.
  - 14-day interactive traffic trend analytics and client device breakdowns.
  - Live system audit logs with masked IP addresses.
  - Cron trigger automation control center.
- **Top Portfolio Button**:
  - Sticky, accessible banner linking to **[Built by Sohel Rana](https://developersohelrana.pages.dev)**.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend / API**: Express 4 server (`server.ts`) with development Vite middleware integration
- **Storage**: Structured JSON store with PBKDF2 hashing and automatic in-memory fallback
- **Edge Deployment Target**: Cloudflare Pages + Cloudflare Workers (`wrangler.toml`)
- **PWA**: Custom Service Worker (`sw.js`) and Web App Manifest (`manifest.json`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js $\ge 20.0.0$
- npm $\ge 10.0.0$

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration values in `.env`:
```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
CRON_SECRET=cryptopacket_cron_token_prod
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Administrator Access

- **Admin Login Route**: `/admin` or `/admin/login` (accessible via footer lock icon or direct URL)
- **Authentication Method**: Password-Only Master Key Access (No username required)
- **Security Protections**: Cryptographic PBKDF2/SHA-256 verification, automatic rate-limiting lockout after 5 failed attempts, and zero plaintext exposure in client bundles.

---

## ☁️ Cloudflare Deployment Guide

CryptoPacket is architected to deploy easily to Cloudflare:

1. **Static Frontend (Cloudflare Pages)**:
   - Build output directory: `dist`
   - Build command: `npm run build`
2. **API & Edge Functions (Cloudflare Workers)**:
   - Configuration in `wrangler.toml`
   - Scheduled Cron Triggers run every 6 hours (`0 */6 * * *`) via `/api/cron/collect` with the `x-cron-secret` authorization header.

---

## 👤 Developer & Maintainer

Designed and engineered with care by **Sohel Rana**.
- Portfolio: [https://developersohelrana.pages.dev](https://developersohelrana.pages.dev)
