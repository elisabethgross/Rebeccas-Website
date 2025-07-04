# Physical Therapy Practice Website

## Overview

This is a premium physical therapy practice website for Dr. Sarah Mitchell, built as a full-stack application with a React frontend and Express backend. The application serves as a marketing website and contact form submission system for a direct-pay physical therapy practice.

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```