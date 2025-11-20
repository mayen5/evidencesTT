import { connectDatabase, closeDatabase } from '../src/config/database';

// Global test setup
beforeAll(async () => {
    // Connect to database
    await connectDatabase();
}, 30000);

afterAll(async () => {
    // Cleanup after all tests
    await closeDatabase();
}, 30000);

// Suppress console logs during tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
