// Global test setup
beforeAll(() => {
    // Setup before all tests
    process.env.NODE_ENV = 'test';
});

afterAll(() => {
    // Cleanup after all tests
});

// Suppress console logs during tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
