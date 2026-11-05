# CancerCompanion

A private, supportive workspace for people navigating cancer care. Organize appointments, medications, symptoms, treatment notes, documents, caregivers, and questions for the care team.

> **Important:** CancerCompanion is an organizational and educational support tool. It does not diagnose conditions, recommend treatment, or replace a clinician or emergency services.

## Stack

- React 19, TypeScript, and TanStack Start/Router
- Vite 8, Tailwind CSS 4, and Nitro (Vercel preset)
- PostgreSQL (Neon when `DATABASE_URL` is configured) with an embedded PGlite development fallback
- Better Auth for account sessions

## Requirements

- Node.js 22 or newer
- npm
- A PostgreSQL database for persistent deployments

## Getting started

```bash
npm install
npm run dev
```

The development server is configured for port `8080` and binds to `0.0.0.0`.

## Useful commands

```bash
npm run typecheck   # TypeScript checks
npm test            # Unit and script tests
npm run lint        # ESLint
npm run build       # Production build, then database migrations when configured
npm run db:migrate  # Apply pending migrations when DATABASE_URL is set
```

Without `DATABASE_URL`, the app uses an embedded PGlite database for local development. Configure `DATABASE_URL` with a PostgreSQL connection string for persistent hosted data. Review the migrations in `migrations/` before applying them to a production database.

## Deployment

The repository includes `vercel.json` and uses the Nitro Vercel preset. Configure the required environment variables in the hosting provider before enabling production authentication or persistent storage. In particular, use a strong private `BETTER_AUTH_SECRET`, a valid `BETTER_AUTH_URL`, the appropriate authentication broker credentials (`GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, and `GROK_AUTH_CLIENT_SECRET` where applicable), and `DATABASE_URL`.

Never commit `.env` files, API keys, database credentials, OAuth secrets, or production user data.

## Privacy and safety

CancerCompanion handles potentially sensitive health-related information. Use HTTPS, restrict database access, maintain backups, and review access controls and applicable privacy requirements before inviting real users. The application is not an emergency-response service; contact local emergency services for urgent symptoms or immediate danger.
