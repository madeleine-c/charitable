# Design Guidelines: Modern Philanthropy Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from trusted financial platforms (Stripe, GoFundMe, Cash App) to establish credibility and familiarity. This approach balances the utility needs of nonprofits with the engaging experience donors expect.

**Core Principle**: Build trust through clarity, transparency, and simplicity. Every design decision should reinforce security and legitimacy.

## Typography

**Font System**: 
- Primary: Inter (Google Fonts) - clean, modern, highly readable
- Headings: 600-700 weight
- Body: 400-500 weight
- Financial amounts: 600 weight, tabular numbers

**Hierarchy**:
- Hero headlines: text-5xl to text-6xl
- Section titles: text-3xl to text-4xl
- Card titles: text-xl to text-2xl
- Body text: text-base (16px)
- Captions/metadata: text-sm
- Button text: text-base, 500 weight

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 (e.g., p-4, gap-6, mb-8, py-20)

**Container Strategy**:
- Page containers: max-w-7xl mx-auto
- Content sections: max-w-5xl for readability
- Forms: max-w-2xl for focus
- Cards: Full width within grid constraints

**Grid Patterns**:
- Nonprofit directory: 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Feature sections: 2-column split layouts
- Dashboard metrics: 4-column stats grid on desktop

## Component Library

### Navigation
- Fixed header with logo left, main nav center, CTA button right
- Simple links (Home, Browse Nonprofits, How It Works, For Nonprofits)
- Prominent "Start Donating" or "Sign Up" CTA
- Minimal mobile hamburger menu

### Nonprofit Cards
- Vertical card layout with generous padding (p-6)
- Nonprofit logo/image at top (aspect-ratio-video or square)
- Organization name (text-xl font-semibold)
- One-line mission statement (text-sm)
- Impact metrics row (donors count, total raised)
- Primary "Donate" button at bottom
- Subtle hover elevation (shadow-md to shadow-lg)

### Donation Flow Components
- Large, clear donation amount selector (pre-set amounts as pill buttons)
- Custom amount input with $ prefix, large text
- Stripe Checkout button - primary, full-width
- Trust indicators (secure payment badge, tax-deductible notice)
- Impact preview: "Your $50 provides..."

### Nonprofit Dashboard
- Clean stat cards showing: Total Raised, Number of Donors, Pending Payouts, Last Payout Date
- Simple table for transaction history
- Payout status indicator with clear copy ("Funds arrive in 2-3 business days")
- Minimal onboarding checklist if incomplete

### Forms (Onboarding)
- Single-column, generous spacing (space-y-6)
- Clear field labels above inputs
- Helper text below fields for bank details, tax ID
- Progress indicator at top for multi-step flows
- Large, obvious "Next" and "Complete Setup" buttons

### Profile Pages (Nonprofit)
- Hero section with organization cover image and logo overlay
- Mission statement prominently displayed
- Impact section with key metrics and stories
- Prominent, sticky donation CTA
- Recent supporter section (optional opt-in)
- About section with full details

## Images

**Hero Image**: Yes - use on homepage only
- Full-width hero section (h-96 to h-[32rem])
- Image of diverse community, hands joining, or people helping others
- Semi-transparent overlay for text readability
- Centered headline and CTA with blurred background button treatment

**Nonprofit Profiles**: 
- Cover photo (16:9 aspect ratio, h-64)
- Square logo (overlapping bottom of cover, w-24 h-24 with border)

**Homepage Sections**:
- "How It Works" section: 3 illustrative icons (use Heroicons)
- Trust section: Logos of recognizable nonprofits using platform (if available)

**Directory**: Nonprofit card thumbnails (4:3 aspect ratio)

## Layout Patterns

### Homepage
1. Hero with image, headline "Direct Giving Made Simple", subhead, "Browse Nonprofits" CTA
2. Stats bar (nonprofits served, total donated, average donation time)
3. How It Works (3-column: Sign Up → Browse → Donate, with icons)
4. Featured Nonprofits (3-column card grid)
5. For Nonprofits section (2-column: benefits list + signup CTA)
6. Trust section (security badges, testimonials)
7. Footer (links, social, contact)

### Browse/Directory Page
- Search bar and filter chips at top
- 3-column nonprofit card grid
- Load more or pagination

### Nonprofit Profile
- Cover + logo hero
- Donation CTA sidebar (sticky on desktop)
- Main content: Mission, Impact, About sections stacked

### Nonprofit Dashboard
- Welcome message
- 4-column metrics grid
- Transaction table
- Payout instructions card

## Animation

**Minimal, purposeful only**:
- Card hover: gentle elevation change (transition-shadow duration-200)
- Button states: subtle scale on click (active:scale-95)
- Page transitions: None
- Loading states: Simple spinner for payment processing

## Trust & Security Elements

- Lock icon + "Secured by Stripe" badge near payment buttons
- "100% goes to nonprofit" messaging
- Tax receipt confirmation messaging
- Clear payout timeline communication for nonprofits
- Email verification indicators
- SSL/secure connection indicators in footer

---

**Design Philosophy**: Stripe-level polish with GoFundMe-level warmth. Make donating feel as easy as online shopping, while making nonprofit management feel as simple as checking email. Every element should build trust and reduce friction.