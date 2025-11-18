# Developer Documentation

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/fitness-platform.git
cd fitness-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files with your configuration
```

4. Start development services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
cd apps/api
npm run migration:run
```

6. Start development servers:
```bash
# From root
npm run dev
```

This will start:
- API server on http://localhost:3001
- Web app on http://localhost:3000

## Project Structure

```
fitness-platform/
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── entities/ # TypeORM entities
│   │   │   └── config/   # Configuration
│   │   └── test/         # E2E tests
│   ├── web/              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/      # Next.js app router
│   │   │   ├── components/
│   │   │   └── lib/      # Utilities and API client
│   │   └── e2e/          # E2E tests
│   └── mobile/           # React Native (Phase 2)
├── infrastructure/       # Infrastructure as Code
│   ├── terraform/        # Terraform configs
│   ├── docker/           # Dockerfiles
│   └── kubernetes/       # K8s manifests
└── docs/                 # Documentation
```

## Development Workflow

### Running Tests

```bash
# Backend tests
cd apps/api
npm test

# Frontend tests
cd apps/web
npm test

# E2E tests
cd apps/web
npm run test:e2e
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint
npm run lint

# Format
npm run format
```

### Git Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: your feature description"
```

3. Push and create a pull request:
```bash
git push origin feature/your-feature-name
```

## API Development

### Adding a New Endpoint

1. Create a controller in the appropriate module:
```typescript
@Controller('your-resource')
export class YourController {
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

2. Create a service:
```typescript
@Injectable()
export class YourService {
  findAll() {
    // Implementation
  }
}
```

3. Register in module:
```typescript
@Module({
  controllers: [YourController],
  providers: [YourService],
})
export class YourModule {}
```

### Database Migrations

Create a migration:
```bash
cd apps/api
npm run migration:generate -- -n YourMigrationName
```

Run migrations:
```bash
npm run migration:run
```

Revert migration:
```bash
npm run migration:revert
```

## Frontend Development

### Adding a New Page

1. Create a file in `apps/web/src/app/your-page/page.tsx`:
```typescript
export default function YourPage() {
  return <div>Your Page</div>;
}
```

### Adding a Component

1. Create component in `apps/web/src/components/`:
```typescript
export function YourComponent() {
  return <div>Your Component</div>;
}
```

### API Integration

Use the API client:
```typescript
import { apiClient } from '@/lib/api';

const data = await apiClient.get('/your-endpoint');
```

## Testing

### Unit Tests

Backend:
```typescript
describe('YourService', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

Frontend:
```typescript
describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    // Assertions
  });
});
```

### Integration Tests

Use Supertest for API:
```typescript
request(app.getHttpServer())
  .get('/api/v1/your-endpoint')
  .expect(200);
```

### E2E Tests

Use Playwright:
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  // Test steps
});
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

## Troubleshooting

### Common Issues

**Database connection errors:**
- Check database is running: `docker-compose ps`
- Verify connection string in `.env`

**Port already in use:**
- Change port in `.env` or kill the process using the port

**Migration errors:**
- Check database schema matches entities
- Run migrations in order

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [React Query Documentation](https://tanstack.com/query)

