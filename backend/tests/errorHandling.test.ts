import request from 'supertest';
import app from '../src/app';

describe('Error Handling Tests', () => {
    let authToken: string;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@evidence.com',
                password: 'Admin@123',
            });

        authToken = loginResponse.body.data.accessToken;
    });

    describe('Invalid Routes', () => {
        it('should return 404 for non-existent endpoint', async () => {
            const response = await request(app)
                .get('/api/v1/nonexistent')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });

        it('should return 404 for invalid API version', async () => {
            const response = await request(app)
                .get('/api/v2/case-files');

            expect(response.status).toBe(404);
        });
    });

    describe('Malformed Requests', () => {
        it('should handle malformed JSON in request body', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .set('Content-Type', 'application/json')
                .send('{"invalid json}');

            expect(response.status).toBe(400);
        });

        it('should reject requests with invalid content type', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .set('Content-Type', 'text/plain')
                .send('not json');

            expect([ 400, 415 ]).toContain(response.status);
        });
    });

    describe('Database Errors', () => {
        it('should handle non-existent resource gracefully', async () => {
            const response = await request(app)
                .get('/api/v1/case-files/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });

        it('should handle invalid ID formats', async () => {
            const response = await request(app)
                .get('/api/v1/case-files/invalid-id')
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 400, 404, 500 ]).toContain(response.status);
        });
    });

    describe('Validation Errors', () => {
        it('should reject case file with missing required fields', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test',
                    // Missing caseNumber, description, incidentDate
                });

            expect(response.status).toBe(400);
        });

        it('should reject evidence with invalid type', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: 1,
                    evidenceTypeId: -1,
                    description: 'Test',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            expect([ 400, 500 ]).toContain(response.status);
        });

        it('should reject user with invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'not-an-email',
                    password: 'Test@123',
                    firstName: 'Test',
                    lastName: 'User',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('HTTP Methods', () => {
        it('should reject unsupported HTTP methods', async () => {
            const response = await request(app)
                .put('/api/v1/auth/login')
                .send({
                    email: 'admin@evidence.com',
                    password: 'Admin@123',
                });

            expect(response.status).toBe(404);
        });
    });
});
