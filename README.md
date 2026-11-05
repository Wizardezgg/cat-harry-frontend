# Aperture — Peer-to-Peer Creative Workspace & Production Studio Platform

> **Aperture** (formerly StudioSpace) is a high-performance peer-to-peer marketplace designed for filmmakers, photographers, audio engineers, and artists to list, discover, and reserve specialized creative production workspaces (Film Soundstages, Daylight Photo Lofts, Dolby Atmos Mixing Suites, Dance Halls, and Ceramic Ateliers).

---

## 🌐 Live Deployments & Repository Links

- **Frontend Client (Vercel)**: [https://aperture-studio-git-main-wi-z1.vercel.app](https://aperture-studio-git-main-wi-z1.vercel.app)
- **Backend API (Vercel)**: [https://aperture-eight-eosin.vercel.app](https://aperture-eight-eosin.vercel.app)
- **API Health Endpoint**: [https://aperture-eight-eosin.vercel.app/health](https://aperture-eight-eosin.vercel.app/health)
- **Frontend Repository**: [https://github.com/Wizardezgg/cat-harry-frontend](https://github.com/Wizardezgg/cat-harry-frontend)
- **Backend Repository**: [https://github.com/Wizardezgg/cat-harry-backend](https://github.com/Wizardezgg/cat-harry-backend)

---

## 🔑 Test Examiner Credentials (1-Click Auth Ready)

Pre-seeded credentials with instant one-click test fill buttons located directly on `/login`, `/register`, and `/add-studio`:

| Role | Account Email | Password | Display Name | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Studio Host** | `host@studiospace.com` | `Host@1234` | Elena Rostova | List spaces, edit stages, manage roster, delete stages |
| **Creator** | `creator@studiospace.com` | `Creator@1234` | Marcus Vance | Scout studios, book hours, cancel reservations, export PDF invoices |

---

## ✨ Key Platform Features

### 1. Architectural Brand Identity & Design System
- Custom **Aperture Kinetic Vortex** mark with clean geometric typography (Space Grotesk + Inter).
- Dark minimalist palette inspired by industrial production soundstages (`#121318` background, `#ffcd8b` warm gold accents, and `#1a1b20`/`#1e1f25` surfaces).
- **Theme Customization**: Full Light/Dark mode switcher with instantaneous class toggling and `localStorage` state persistence.
- Modern **Sonner Toasts** and custom modal dialogs throughout (Zero default `window.alert()`).
- New **X (Twitter)** logo integrated across navigation and footer.

### 2. Discover & Home Experience (`/`)
- **Split Hero Showcase**: Interactive rotating carousel highlighting curated production soundstages alongside a multi-parameter search bar (keyword, discipline, and metro city).
- **Discipline Taxonomy**: Instant category filters for Film Stages, Photo Studios, Audio Suites, Movement Halls, and Art Ateliers.
- **Dynamic Featured Studios**: Fetches the top 6 highest-rated soundstages dynamically from MongoDB using `.limit(6)`.
- **4-Step Workflow**: Visual guide explaining Discovery $\rightarrow$ Time Slot Selection $\rightarrow$ Instant Escrow Hold $\rightarrow$ Shoot Wrap.
- **Production Assurances**: Comprehensive overview of $1,000,000 property protection, electrical load auditing, and 24/7 concierge.

### 3. Explore Studios (`/studios`)
- High-density workspace grid with live filtering by category, city, and hourly rate slider ($0 - $300+/hr).
- Real-time sort options: Newest First, Highest Rated, and Price Ascending/Descending.
- Branded skeleton loaders during query transitions.

### 4. Technical Studio Details (`/studios/[id]`)
- Multi-image photo mosaic gallery with fullscreen modal preview.
- Rigorous technical spec readouts: clear truss ceiling height, 3-phase 200A-400A Cam-Lok power drops, STC-68 acoustic isolation decibels, and elephant roll-up door clearances.
- Verified host bio card with response time telemetry and verified reviews.
- Sticky Booking Calculator with live duration calculation, damage deposit hold, and interactive escrow protection note.

### 5. Private Host Management (`/add-studio`, `/my-listings`, `/studios/edit/[id]`)
- **Hydration-Safe Route Guard**: Protected by `ProtectedRoute` ensuring logged-in users are **NEVER** redirected to `/login` upon browser refresh.
- **Add Studio**: Multi-section form with image presets, checklist of technical amenities, and read-only host identity.
- **My Studio Listings**:
  - 4 Structural production metric panels (Active Listings, Bookings This Month, Gross Studio Earnings, Average Rating).
  - Editorial card matrix with live telemetry, 30-day SVG sparklines, and status badges.
  - **Architectural Delete Confirmation Modal**: Warning badge, impact ledger summary, and required slug-typing confirmation (e.g. `sonder-stage-a`) before permanent deletion.
- **Update Studio**: Pre-populated stage specifications with live canonical permalink preview and locked host ownership context.

### 6. Creative Dashboard & My Bookings (`/my-bookings`)
- Filterable reservation roster with status tabs (`All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`).
- Detailed schedule breakdown: Call time window, hourly rate, and refundable deposit hold.
- **Interactive Cancellation Modal**: 48-hour free cancellation policy with 100% escrow refund confirmation.
- **Branded PDF Invoice Generator**: One-click client-side export using `jspdf` and `jspdf-autotable` delivering high-resolution, branded invoice receipts (`Aperture_Invoice_[ID].pdf`).

### 7. Custom 404 & Supporting Pages
- **Custom 404 Page** (`/not-found.tsx`): Kinetic aperture shutter animation, "Scene Missing from Reel" narrative, and direct navigation CTAs.
- **How It Works** (`/how-it-works`): Comprehensive guide detailing technical auditing, double-booking prevention, escrow lifecycle, and host monetization.
- **About Us** (`/about-us`): Aperture's founding mission, core principles, and collective impact metrics.

---

## 🛠️ Technologies Used

### Frontend Client
- **Framework**: Next.js 15 (App Router with Server & Client Component separation)
- **Language**: TypeScript 5 (Strict type safety)
- **Styling**: Tailwind CSS with CSS Variables for Theme Customization
- **Icons**: Lucide React
- **Notifications**: Sonner (Custom dark/light toast notifications)
- **PDF Generation**: jsPDF & jsPDF-AutoTable
- **State & Context**: React Context API (`AuthContext`, `ThemeContext`)

### Backend Server
- **Runtime**: Node.js & Express.js
- **Language**: TypeScript with `ts-node-dev`
- **Database**: MongoDB Atlas with Mongoose ODM
- **Security & Auth**: JSON Web Tokens (JWT) stored in HTTPOnly secure cookies, bcryptjs password hashing
- **Middleware**: cookie-parser, cors with credentials, custom authentication middleware

---

## 🚀 Step-by-Step Local Setup Guide

### 1. Clone the Repositories
```bash
# Clone Frontend
git clone https://github.com/Wizardezgg/cat-harry-frontend.git
cd cat-harry-frontend

# Clone Backend (in parallel directory)
git clone https://github.com/Wizardezgg/cat-harry-backend.git
```

### 2. Run Frontend Client
```bash
cd client
npm install
npm run dev
```
Access the application on port 3000.

### 3. Run Backend Server
```bash
cd server
npm install
npm run dev
```
The server will automatically connect to MongoDB Atlas, run the auto-seeding engine, and listen on port 5000.

---

## 📋 Zero-Tolerance Quality Compliance

- [x] **No Lorem Ipsum**: 100% authentic production terminology (Arri SkyPanels, Cam-Lok 3-Phase, STC acoustic ratings, cyclorama coves).
- [x] **No Default Window Alert**: All feedback is presented via Sonner toasts or accessible custom modal dialogs.
- [x] **No Refresh Redirects**: Private routes (`/my-listings`, `/add-studio`, `/my-bookings`) maintain persistent session state across reloads.
- [x] **New X Social Logo**: Exclusively uses the updated X mark across all navigation and footer components.
- [x] **No Example Env Files**: Strict adherence to assignment file standards without committing sample envs.
- [x] **Commit Quotas**: $\ge$ 15 notable commits on Client, $\ge$ 8 notable commits on Server.
