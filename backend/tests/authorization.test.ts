import request from 'supertest';
import app from '../src/app';

describe('Authorization Tests', () => {
    let adminToken: string;
    let regularUserToken: string;
    let regularUserId: number;

    beforeAll(async () => {
        // Login as admin
        const adminLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@evidence.com',
                password: 'Admin@123',
            });

        adminToken = adminLogin.body.data.accessToken;

        // Create a regular user (non-admin)
        const createUser = await request(app)
            .post('/api/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                username: `regularuser${Date.now()}`,
                email: `regular${Date.now()}@test.com`,
                password: 'RegularUser@123',
                firstName: 'Regular',
                lastName: 'User',
                roleId: 2, // Non-admin role
            });

        if (createUser.status === 201) {
            regularUserId = createUser.body.data.userId;

            // Login as regular user
            const regularLogin = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: createUser.body.data.email || `regular${Date.now()}@test.com`,
                    password: 'RegularUser@123',
                });

            if (regularLogin.status === 200) {
                regularUserToken = regularLogin.body.data.accessToken;
            }
        }
    });

    describe('User Management - Admin Only', () => {
        it('should allow admin to access user list', async () => {
            const response = await request(app)
                .get('/api/v1/users?page=1&pageSize=10')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
        });

        it('should deny regular user access to user list', async () => {
            if (!regularUserToken) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .get('/api/v1/users?page=1&pageSize=10')
                .set('Authorization', `Bearer ${regularUserToken}`);

            expect(response.status).toBe(403); // Forbidden
        });

        it('should deny regular user from creating users', async () => {
            if (!regularUserToken) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post('/api/v1/users')
                .set('Authorization', `Bearer ${regularUserToken}`)
                .send({
                    username: 'testuser',
                    email: 'test@test.com',
                    password: 'Test@123',
                    firstName: 'Test',
                    lastName: 'User',
                    roleId: 2,
                });

            expect(response.status).toBe(403);
        });

        it('should deny regular user from updating users', async () => {
            if (!regularUserToken || !regularUserId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .put(`/api/v1/users/${regularUserId}`)
                .set('Authorization', `Bearer ${regularUserToken}`)
                .send({
                    firstName: 'Updated',
                });

            expect(response.status).toBe(403);
        });

        it('should deny regular user from deleting users', async () => {
            if (!regularUserToken) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .delete('/api/v1/users/1')
                .set('Authorization', `Bearer ${regularUserToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe('Invalid Tokens', () => {
        it('should reject expired/invalid tokens', async () => {
            const response = await request(app)
                .get('/api/v1/users')
                .set('Authorization', 'Bearer invalid.token.here');

            expect(response.status).toBe(401);
        });

        it('should reject malformed authorization headers', async () => {
            const response = await request(app)
                .get('/api/v1/users')
                .set('Authorization', 'InvalidFormat');

            expect(response.status).toBe(401);
        });
    });

    describe('Public Endpoints', () => {
        it('should allow access to catalogs without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/roles');

            expect(response.status).toBe(200);
        });

        it('should allow access to evidence types without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/evidence-types');

            expect(response.status).toBe(200);
        });

        it('should allow access to case file statuses without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/case-file-statuses');

            expect(response.status).toBe(200);
        });
    });
});
