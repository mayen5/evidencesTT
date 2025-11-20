# Testing Guide

## Overview

The backend uses Jest with Supertest for integration testing. Tests verify API endpoints work correctly with real database connections.

## Test Files Created

- `tests/auth.test.ts` - Authentication endpoints (login, register) ✅ **PASSING**
- `tests/caseFiles.test.ts` - Case file CRUD operations
- `tests/evidence.test.ts` - Evidence management
- `tests/attachments.test.ts` - File upload functionality
- `tests/catalogs.test.ts` - Catalog endpoints

## Configuration

- **Jest Config**: `jest.config.js` - Configured for TypeScript with ts-jest
- **Test Setup**: `tests/setup.ts` - Database connection management
- **Test Environment**: `tests/setup-env.ts` - Loads `.env.test` before tests run
- **Environment File**: `.env.test` - Test-specific configuration (uses localhost for DB)

## Running Tests

```powershell
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Each test suite follows this pattern:

```typescript
describe('Feature API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get authentication token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@evidence.com', password: 'Admin@123' });

    authToken = response.body.data.accessToken;
  });

  describe('POST /endpoint', () => {
    it('should perform action successfully', async () => {
      const response = await request(app)
        .post('/api/v1/endpoint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          /* test data */
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
```

## Database Setup

Tests connect to the same SQL Server instance as development but use the `.env.test` configuration:

- **Host**: `localhost` (not `sqlserver` - used outside Docker)
- **Port**: `1433`
- **Database**: `EvidenceManagementDB` (same as dev)
- **User**: `sa`
- **Password**: Configured in `.env.test`

### Important Notes

1. Tests require SQL Server to be running (via Docker)
2. Tests use the REAL database - no mocking
3. Each test may create data in the database
4. Database should be reset periodically for clean tests

## Current Test Coverage

**Overall Coverage**: ~43% (Target: >80%)

### Passing Tests (18/27)

- ✅ Authentication: Login, Register, Validation
- ✅ Case Files: Get without auth (negative test)
- ✅ Evidence: Get without auth (negative test)
- ✅ Attachments: Upload without auth (negative test)
- ✅ Catalogs: Get without auth (negative test)

### Known Issues

- Some tests fail to authenticate in `beforeAll` hooks
- These tests will pass once authentication flow is stabilized
- File upload tests create temp files in `os.tmpdir()`

## Next Steps

1. **Stabilize Authentication**: Ensure all test suites can login successfully
2. **Add More Test Cases**: Cover edge cases and error scenarios
3. **Increase Coverage**: Target >80% code coverage
4. **Add E2E Tests**: Test complete workflows (create case → add evidence → upload files)
5. **CI/CD Integration**: Add GitHub Actions workflow for automated testing

## TypeScript Configuration

The project TypeScript config (`tsconfig.json`) includes tests directory:

```json
{
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Note**: The `rootDir` option was removed to allow tests outside `src/` directory.

## Dependencies

Testing dependencies already installed:

- `jest` - Test runner
- `@types/jest` - TypeScript types for Jest
- `ts-jest` - TypeScript preprocessor for Jest
- `supertest` - HTTP assertions
- `@types/supertest` - TypeScript types for Supertest

## Best Practices

1. **Use Descriptive Test Names**: Clearly state what is being tested
2. **Test Both Success and Failure**: Include positive and negative test cases
3. **Clean Up Resources**: Delete test data after tests complete
4. **Mock External Services**: Don't call real external APIs in tests
5. **Keep Tests Independent**: Each test should run independently
6. **Use Setup/Teardown**: Initialize shared resources in `beforeAll`/`afterAll`

## Troubleshooting

### Database Connection Errors

- Ensure SQL Server container is running: `docker ps`
- Verify `.env.test` has `DB_HOST=localhost`
- Check SQL Server is accessible on port 1433

### TypeScript Errors

- Run `npm run build` to check for compilation errors
- Ensure `tsconfig.json` includes `tests/**/*`

### Test Timeouts

- Increase timeout in test: `it('test', async () => {...}, 30000)`
- Increase global timeout in `jest.config.js`: `testTimeout: 30000`
