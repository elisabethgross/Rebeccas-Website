# Physical Therapy Practice Website

## Overview

This is a premium physical therapy practice website for Dr. Rebecca Kleiner, built as a full-stack application with a React frontend and Express backend. The application serves as a marketing website and contact form submission system for a direct-pay physical therapy practice.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Email Service**: Nodemailer for contact form submissions
- **Session Management**: In-memory storage (development)
- **API Structure**: RESTful endpoints under `/api`

### Key Components
1. **Single Page Application**: All content on one scrollable page
2. **Contact Form**: Collects client consultation requests
3. **Email Notifications**: Automated emails for new submissions
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Component Library**: shadcn/ui for consistent UI components
6. **Patient Testimonials**: HIPAA-conscious review-style section. Patients can submit via a consent-gated form (`POST /api/testimonials`); Dr. Kleiner curates submissions in the admin panel before they appear publicly. Real patient photos are never used — cards display initials and a first name + last initial.

### Testimonials feature — operating notes
- **Public API**: `GET /api/testimonials` returns approved testimonials only.
- **Submission API**: `POST /api/testimonials` always lands as `status='pending'` and requires `consentGiven=true`.
- **Unified admin dashboard**: `/admin` — single password-gated page with two top-level tabs: **Inquiries** (contact-form submissions log; sourced from `/api/contact-submissions`) and **Testimonials** (moderation panel; sourced from `/api/admin/testimonials`). Both tabs share the same `ADMIN_PASSWORD` sign-in stored in `localStorage`. The legacy URL `/admin/testimonials` still works and deep-links straight to the Testimonials tab — switching tabs updates the URL via wouter so back/forward and bookmarks behave correctly. The Testimonials tab itself has sub-tabs for Pending / Approved / Rejected+Hidden / Add Manually. Each testimonial row has approve/reject/hide/edit/delete actions; the Edit dialog only permits changes to **attribution** fields (first name, last initial, activity/role, rating). The patient's quote is intentionally **read-only** in the edit flow — to change wording, contact the patient and have them re-submit, or delete and re-add.
  - Implementation: `client/src/pages/admin.tsx` is the auth shell, and the two panels live in `client/src/pages/admin/inquiries-panel.tsx` and `client/src/pages/admin/testimonials-panel.tsx`. Each panel takes `authPassword` and `onUnauthorized` as props.
- **Admin password (REQUIRED secret)**: the server reads it from the `ADMIN_PASSWORD` environment variable. There is **no fallback** — if it isn't set, every admin endpoint returns HTTP 503 and the admin panel is unusable. Set `ADMIN_PASSWORD` as a Replit secret in both development and production.
- **Preview page (env-flag gated)**: `/preview/testimonials` renders the section with mock testimonials from `client/src/lib/mock-testimonials.ts`. The route is gated by the `VITE_ENABLE_TESTIMONIALS_PREVIEW` env var — if it isn't set to the string `"true"` at build/dev time, the page renders the 404 component. Set `VITE_ENABLE_TESTIMONIALS_PREVIEW=true` only in the **development** environment so the preview is unreachable in production. The mock data lives entirely in the frontend bundle and is never written to the database.
- **Live on home page**: the `<Testimonials />` section is mounted in `client/src/pages/home.tsx` and the desktop + mobile navbars link to `#testimonials`. Public visitors see approved testimonials from the API rendered as a marquee with a "Share Your Story" CTA.
- **Launch seed**: `server/seed-testimonials.ts` inserts 4 approved testimonials at server startup **only if there are zero approved entries in the DB** (idempotent — won't re-seed once any real testimonials exist). To regenerate the seed, delete/hide all approved testimonials in the admin panel and restart the server.
- **Submission notification**: `POST /api/testimonials` sends an HTML email to `kleinerDPT@gmail.com` for every new pending submission, with the quote, attribution, rating, and a one-click "Review in admin panel" button linking to `/admin/testimonials`. Email failures are logged but do not block the submission.
- **Disclosure**: every render of the section includes the line "Testimonials are shared with each patient's written permission. Individual results vary."

## Data Flow

1. **User Journey**: Landing page → About → Services → Testimonials → Contact
2. **Form Submission**: Client fills form → Validation → Database storage → Email notification
3. **Email Flow**: Form data → Server processing → SMTP email to practice owner
4. **Data Storage**: Contact submissions stored in PostgreSQL via Drizzle ORM

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured for Neon Database)
- **Drizzle ORM**: Type-safe database operations
- **Connection**: Uses DATABASE_URL environment variable

### Email Service
- **SMTP Configuration**: Gmail/custom SMTP server
- **Environment Variables**: SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL
- **Fallback**: EMAIL_USER and EMAIL_PASS for backward compatibility

### UI Components
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Underlying primitive components
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Animation library

### Development Tools
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push`

### Environment Configuration
- **Development**: Uses tsx for server, Vite dev server for client
- **Production**: Serves static files from Express, compiled bundles
- **Database**: PostgreSQL connection via environment variables

### File Structure
```
client/          # React frontend
├── src/
│   ├── components/  # UI components
│   ├── pages/       # Page components
│   ├── lib/         # Utilities
│   └── hooks/       # Custom hooks
server/          # Express backend
├── routes.ts    # API endpoints
├── storage.ts   # Data layer
└── vite.ts      # Dev server integration
shared/          # Shared types and schemas
└── schema.ts    # Database schema and validation
```

### Configuration Files
- **Vite**: Frontend build configuration
- **Drizzle**: Database schema and migrations
- **Tailwind**: Styling configuration
- **TypeScript**: Type checking across all packages

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Added PostgreSQL database integration and migrated from MemStorage to DatabaseStorage
- July 04, 2025. Implemented Google Reviews integration with database storage, API endpoints, and frontend display
- July 30, 2025. Removed philosophy section and replaced all Dr Mitchell references with Dr Kleiner throughout codebase
- July 30, 2025. Enhanced "Schedule Your Assessment" button prominence with larger size, gradient styling, and hover effects
- April 28, 2026. Built ethical patient testimonials feature: consent-gated submission form, password-protected /admin/testimonials curation panel, and /preview/testimonials design preview using local mock data. Section intentionally hidden on the live home page until real approved entries exist.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```