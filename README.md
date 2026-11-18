# ANTI-MATTER v2.0
> **Academic Resource Library, NEBULA Smart Search & Verified Leaderboard Platform**  
> *Designed and Architected by Fahad (XS1_Reaper) • Independent University, Bangladesh (IUB)*

---

## 🌌 Overview

**ANTI-MATTER** is a production-grade academic platform built for university students to share, search, and preview academic resources (lecture notes, midterm and final examination past papers, course slides, and lab guides), combined with an opt-in verified CGPA leaderboard and **NEBULA v1** conversational smart search.

This implementation faithfully delivers every specification from the **ANTI-MATTER Design, Architecture and Security Blueprint v2 (November 2026)**.

---

## 🚀 Key Features

1. **Academic Resource Repository**:
   - 100+ seeded resources across core university courses (`CSE 213`, `CSE 115`, `CSE 215`, `CSE 303`, `CSE 317`, `EEE 101`, `ACT 201`, `MAT 120`).
   - Category filters: *Notes* (purple), *Past Papers* (amber), *Slides* (sky blue), and *Guides* (gray).
   - Fast full-text search with course code suggestions and 300 ms debounced input.

2. **In-Browser PDF Viewer & Expiring Signed Links**:
   - 848 px PDF viewer with white page surface on dark backdrop frame.
   - 320 px sticky metadata panel with download counter, page count, and uploader info.
   - **Signed download URLs expiring in 15 minutes** generated via Supabase Storage private buckets.
   - Instant 1-click copyright/accuracy report modal.

3. **NEBULA v1 Smart Search Assistant**:
   - Floating 56 px circle button with purple glow at bottom-right.
   - 400 px sliding right-side drawer (fullscreen on mobile).
   - Conversational assistant returning top 3 matching PDFs with direct preview links and course code chips.
   - Rate limited to 10 queries per minute.

4. **Opt-In Verified Leaderboard**:
   - Clean, embarrassment-free ranking system: Opt-in only with alias support.
   - Ranked by CGPA with completed credits as the official tie-breaker.
   - Top three ranks receive Gold (`#FACC15`), Silver (`#CBD5E1`), and Bronze (`#D97706`) badges.
   - Admin verification workflow for grade sheet screenshots.
   - Automated privacy compliance: proof screenshots stored in private buckets and deleted upon verification.

5. **Admin Moderation & Security Portal**:
   - 240 px admin sidebar with 32 px content area.
   - File upload dropzone with `%PDF-` magic byte verification, 25 MB limit, and randomized UUID paths.
   - Manage repository table with 56 px rows and status badges.
   - CGPA review queue and DMCA/copyright takedown routine.

---

## 🛡️ Launch Security Blueprint (All 19 Checklist Points Implemented)

| # | Security Item | Implementation |
|---|---------------|----------------|
| **1** | **Enable RLS** | RLS enabled across all 8 Postgres tables in `supabase/migrations/20261102_security_rls.sql` |
| **2** | **Server-side Permissions** | Roles stored in `profiles.role`; verified on server actions and route handlers |
| **3** | **Protect Admin Routes** | `middleware.ts` guards `/admin/*`; actions double-check role with `auth.getUser()` |
| **4** | **Verify University Email** | Strict database trigger and UI checks enforce `@iub.edu.bd` Google SSO |
| **5** | **Parameterized SQL** | Supabase-js parameterized methods; `.textSearch` prevents SQL injection |
| **6** | **Tokens Out of LocalStorage** | `@supabase/ssr` cookies handler; no JWT tokens stored in browser localStorage |
| **7** | **Hide .env from Git** | `.gitignore` hides `.env` and `.env.local`; clean `.env.example` committed |
| **8** | **Server-side Secrets** | `SUPABASE_SERVICE_ROLE_KEY` isolated to server actions/routes; never prefixed with `NEXT_PUBLIC_` |
| **9** | **Tighten CORS** | Same-origin API routes; cookies configured with `SameSite=Lax` and `Secure` |
| **10** | **Disable Debugging in Prod** | `poweredByHeader: false`, `productionBrowserSourceMaps: false`, generic `app/error.tsx` |
| **11** | **No Sensitive Data in Logs** | No CGPA, email, or request bodies logged to stdout/telemetry |
| **12** | **Validate Form Inputs** | Centralized Zod schemas in `lib/validation/schemas.ts` on both client and server |
| **13** | **Validate File Uploads** | Server checks 25 MB limit, `%PDF-` magic byte, and stores under random UUIDs |
| **14** | **Block XSS** | React default escaping, plain text NEBULA outputs, strict CSP headers in `next.config.ts` |
| **15** | **Rate Limiting** | `@upstash/ratelimit` sliding windows (Search: 30/min, Report: 5/hr, Upload: 20/hr, NEBULA: 10/min) |
| **16** | **Update Dependencies** | Weekly `.github/dependabot.yml` configuration and lockfile tracking |
| **17** | **Security Review Workflow** | `.github/workflows/security.yml` configured for pull request scanning |
| **+** | **Private CGPA Proofs** | Stored in private `cgpa-proofs` bucket; admin-only read; deleted upon check |
| **+** | **Terms & Takedown Flow** | Live terms page at `/terms` with one-click report modal on all resources |

---

## 🎨 Design Tokens

- **Page Background (`bg`)**: `#0B0820`
- **Surface (`surface`)**: `#14102E`
- **Surface-2 (`surface-2`)**: `#1C1740`
- **Border (`border`)**: `#2B2457`
- **Primary Purple (`primary`)**: `#7C3AED`
- **Primary Hover (`primary-hover`)**: `#6D28D9`
- **Primary Soft (`primary-soft`)**: `#A78BFA`
- **Main Text (`text`)**: `#F5F3FF`
- **Muted Text (`text-muted`)**: `#A09BC4`
- **Success (`success`)**: `#22C55E`
- **Warning (`warning`)**: `#F59E0B`
- **Danger (`danger`)**: `#EF4444`
- **Typography**: Space Grotesk (Headings), Inter (Body & UI), JetBrains Mono (Course Codes & Numbers)

---

## 📦 Project Structure

```
Anti-matter-v2/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # Landing, Hero, Stats, How It Works, Departments, Leaderboard Preview
│   │   ├── library/
│   │   │   ├── page.tsx                  # Browse & Filter 100+ Resources, Pagination
│   │   │   └── [institution]/[dept]/[course]/page.tsx  # Course Page: Notes, Past Papers, Slides, Other
│   │   ├── resource/[id]/page.tsx        # 848 px PDF Viewer, 15-min signed links, Report modal
│   │   └── leaderboard/page.tsx          # University Leaderboard (Overall, Dept, Semester)
│   ├── (auth)/login/page.tsx             # 420 px Login Card with @iub.edu.bd SSO check & demo selector
│   ├── (account)/profile/page.tsx        # 2-column Account details & CGPA submission proof upload
│   ├── admin/
│   │   ├── layout.tsx                    # 240 px Sidebar, 32 px content layout
│   │   ├── page.tsx                      # Metrics overview & security health
│   │   ├── upload/page.tsx & actions.ts  # Upload dropzone with %PDF- validation
│   │   ├── resources/page.tsx            # 56 px row management table
│   │   ├── verifications/page.tsx        # Grade sheet proof inspection & privacy deletion
│   │   └── reports/page.tsx              # Copyright & DMCA takedown actions
│   ├── api/
│   │   ├── search/route.ts               # Rate-limited full-text search API
│   │   ├── resources/route.ts            # Resource fetch API
│   │   ├── leaderboard/route.ts          # Leaderboard sorting API
│   │   ├── reports/route.ts              # Rate-limited takedown reporting API
│   │   └── auth/demo/route.ts            # Fast session switching for student & admin
│   ├── terms/page.tsx                    # Copyright, DMCA & Leaderboard privacy policy
│   ├── error.tsx                         # Generic production error screen
│   ├── not-found.tsx                     # 404 handler
│   ├── layout.tsx                        # Root layout with fonts, navbar, footer & NEBULA
│   └── globals.css                       # Design token CSS variables
├── components/
│   ├── ui/                               # Button, Input, Badge, Card, Modal, Tabs, Toast
│   ├── layout/                           # Navbar, Footer
│   ├── library/                          # ResourceCard, FilterPanel, SearchBar
│   ├── nebula/                           # NebulaButton, NebulaPanel, MessageBubble, NebulaWidget
│   ├── leaderboard/                      # RankRow, RankTable
│   └── admin/                            # UploadDropzone
├── lib/
│   ├── supabase/                         # client.ts, server.ts (@supabase/ssr cookies)
│   ├── security/rate-limit.ts            # Upstash & fallback rate limiting
│   ├── validation/schemas.ts             # Zod validation schemas
│   ├── constants.ts                      # Departments, Courses, Institution metadata
│   └── data/mock-db.ts                   # 100+ resource seed database & test records
├── supabase/migrations/                  # SQL migrations: schema, RLS, storage buckets, seed
├── next.config.ts                        # CSP and security headers
├── tailwind.config.ts                    # Design tokens configuration
├── middleware.ts                         # Route protection and session verification
├── .env.example                          # Environment variable template
└── .github/                              # Dependabot & Security review workflows
```

---

## 🛠️ Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2. Quick Demo Roles
You can instantly toggle between **Student** and **Admin** personas directly using the role switcher in the Navbar or on the `/login` page:
- **Student**: `tanvir.h@iub.edu.bd` (Browse library, view PDFs, submit CGPA, use NEBULA)
- **Admin**: `fahad@iub.edu.bd` (Access `/admin`, upload PDFs, approve CGPA proofs, handle reports)

### 3. Connect Live Supabase (Optional)
When you're ready to deploy to production:
1. Create a project on [Supabase](https://supabase.com).
2. Run the SQL migrations from `supabase/migrations/` in your Supabase SQL Editor.
3. Configure your keys in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Configure your [Upstash Redis](https://upstash.com) credentials for production rate limiting:
   ```bash
   UPSTASH_REDIS_REST_URL=https://your-upstash.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token
   ```

---

## 📜 License
Created by Fahad (XS1_Reaper) for the Independent University, Bangladesh student community.
All rights reserved.
