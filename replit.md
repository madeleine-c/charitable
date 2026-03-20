# Charitable - Modern Philanthropy Platform

## Overview

Charitable is a mobile-first social media-style philanthropy platform that connects donors with nonprofits through a scrollable feed. Nonprofits create profiles and post fundraising campaigns that appear in users' feeds. All donations flow directly to nonprofit bank accounts via Stripe Connect destination charges. The platform is designed to be simple enough for non-tech-savvy nonprofits to use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project is organized as a monorepo with:
- `client/` - React web app (runs in Replit)
- `server/` - Express backend (runs in Replit)
- `shared/` - Database schemas (Drizzle ORM)
- `apps/mobile/` - React Native mobile app (run locally with Expo)
- `packages/shared/` - Shared types and API client for mobile

### Web Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The web frontend follows a page-based structure with shared components. Key pages include:
- Home, Feed, Browse (Discover), How It Works, For Nonprofits (public pages)
- Nonprofit Profile, Dashboard, Onboarding (nonprofit-specific)
- Donation Success (post-payment confirmation)

Key components:
- BottomNav: Mobile bottom navigation for app-like experience
- Header: Desktop/tablet navigation with Feed/Discover links
- PostCard: Feed item showing nonprofit post with like/donate actions

### Mobile App Architecture (apps/mobile/)
- **Framework**: Expo (managed React Native)
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for React Native)
- **Data**: TanStack React Query + shared API client

Mobile screens:
- Feed tab: Scrollable posts with likes and donate buttons
- Discover tab: Grid of nonprofit cards
- Profile tab: Guest/user profile
- Nonprofit detail: Full profile with campaigns
- Donate modal: Amount selection, opens Stripe Checkout

To run the mobile app locally:
1. `cd apps/mobile && npm install`
2. Set `EXPO_PUBLIC_API_URL` to your deployed backend URL
3. `npx expo start` and scan QR with Expo Go app

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints under `/api/*`

The server handles:
- Nonprofit CRUD operations
- Donation processing via Stripe Checkout
- Webhook processing for payment confirmation

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)

Main entities:
- `users` - Basic user accounts
- `nonprofits` - Organization profiles with donation stats
- `donations` - Individual donation records with status tracking
- `posts` - Fundraising posts created by nonprofits (with goals, progress)
- `supporters` - Donor profiles with giving history
- `follows` - Relationships between supporters and nonprofits
- `reactions` - Likes on posts from supporters or guests

### Payment Processing
- **Provider**: Stripe (via Replit connector)
- **Integration**: `stripe-replit-sync` package for webhook management
- **Flow**: Stripe Checkout Sessions → Webhook confirmation → Database update

The Stripe integration automatically handles credential retrieval from Replit connectors and manages webhook endpoints for payment events.

## Recent Changes (December 2024)

**Admin Dashboard & Nonprofit Vetting**
- Added admin dashboard at /admin for managing nonprofits
- Three tabs: Pending (awaiting approval), Approved (active on platform), Removed (hidden from users)
- EIN verification using ProPublica Nonprofit Explorer API to check against IRS 990 filings
- Shows name match warnings when nonprofit name doesn't match IRS registered name
- Approve and reject buttons for nonprofit management
- Only verified (isVerified=true) and active (isActive=true) nonprofits appear in feed and browse pages
- New API endpoints: GET /api/admin/nonprofits, PATCH /api/admin/nonprofits/:id/approve, PATCH /api/admin/nonprofits/:id/reject, GET /api/admin/verify-ein/:ein

**Social Feed & Posts**
- Added `posts`, `supporters`, `follows`, and `reactions` tables for social features
- Created mobile-first scrollable feed page with post cards and like buttons
- Added post composer for nonprofits in dashboard with title, description, goal amount, and image URL fields
- Nonprofit profiles now display timeline of their fundraising posts
- Bottom navigation component for mobile app-like experience
- Feed API supports pagination with default limit of 20 posts
- UUID validation on guest reaction endpoints to prevent spoofing

**Stripe Connect Integration**
- Nonprofits connect their bank accounts through Stripe Express, ensuring funds go directly to their accounts
- Onboarding step 3 replaced manual bank detail collection with "Connect with Stripe" button
- Added destination charges so donations transfer directly to nonprofit Stripe accounts
- Added Stripe onboarding callback pages (complete, refresh)
- Fixed Stripe initialization to properly call `runMigrations()`, set up managed webhooks, and run `syncBackfill()`
- Added webhook route before express.json() middleware for proper payload handling
- Added `/api/donations/verify/:sessionId` endpoint to verify payment completion
- New API endpoints for Stripe Connect: create-stripe-account, stripe-onboarding-link, stripe-status

## External Dependencies

### Third-Party Services
- **Stripe**: Payment processing for donations (Checkout, Webhooks)
- **PostgreSQL**: Primary database (provisioned via Replit)
- **Google Fonts**: Inter font family for typography

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `stripe` / `stripe-replit-sync`: Payment integration
- `@tanstack/react-query`: Data fetching and caching
- `@radix-ui/*`: Accessible UI primitives (via shadcn/ui)
- `wouter`: Client-side routing
- `zod`: Schema validation shared across client/server

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- Stripe credentials via Replit Connectors (automatic)
- `REPLIT_DOMAINS`: For webhook URL construction