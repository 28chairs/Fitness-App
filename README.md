# Fitness Community Marketplace Platform

A comprehensive B2C2B SaaS platform for fitness community organizers to create, manage, and monetize their communities.

## Architecture

This is a monorepo containing:

- `apps/web` - Next.js frontend application
- `apps/api` - NestJS backend API
- `packages/shared` - Shared TypeScript types and utilities
- `packages/ui` - Shared UI components

## Tech Stack

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, React Query
- **Backend:** NestJS, TypeScript, PostgreSQL, Redis
- **Infrastructure:** AWS, Docker, Kubernetes
- **Payments:** Stripe Connect

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Start local development environment
docker-compose up -d

# Run database migrations
cd apps/api
npm run migration:run

# Start development servers
npm run dev
```

### Environment Variables

Copy `.env.example` files in each app directory and configure:

- Database connection strings
- Redis connection
- Stripe API keys
- JWT secrets
- AWS credentials
- Third-party service API keys

## Development

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── ui/           # Shared UI components
├── infrastructure/   # Infrastructure as code
└── docs/            # Documentation
```

## License

Proprietary


