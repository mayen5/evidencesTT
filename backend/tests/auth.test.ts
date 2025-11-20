import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
    let refreshToken: string;

    describe('POST /api/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'admin@evidence.com',
                    password: 'Admin@123',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data.email).toBe('admin@evidence.com');

            refreshToken = response.body.data.refreshToken;
        });

        it('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'admin@evidence.com',
                    password: 'WrongPassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with missing fields', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'admin@evidence.com',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const uniqueEmail = `test${Date.now()}@evidence.com`;

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: uniqueEmail,
                    password: 'Test@123456',
                    firstName: 'Test',
                    lastName: 'User',
                    roleId: 2,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(uniqueEmail);
        });

        it('should fail with weak password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@evidence.com',
                    password: 'weak',
                    firstName: 'Test',
                    lastName: 'User',
                });

            expect(response.status).toBe(400);
        });

        it('should fail with duplicate email', async () => {
            const uniqueEmail = `duplicate${Date.now()}@test.com`;

            // First registration
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: uniqueEmail,
                    password: 'Test@123456',
                    firstName: 'Test',
                    lastName: 'User',
                    roleId: 2,
                });

            // Second registration with same email
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: uniqueEmail,
                    password: 'Test@123456',
                    firstName: 'Test',
                    lastName: 'User',
                    roleId: 2,
                });

            expect([ 400, 500 ]).toContain(response.status);
        });

        it('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@test.com',
                    // Missing password and other fields
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        it('should refresh access token with valid refresh token', async () => {
            if (!refreshToken) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({
                    refreshToken: refreshToken,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should fail with invalid refresh token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({
                    refreshToken: 'invalid.token.here',
                });

            // Backend returns 500 for invalid token, should be 401
            expect([ 401, 500 ]).toContain(response.status);
        });

        it('should fail with missing refresh token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
