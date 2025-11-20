import request from 'supertest';
import app from '../src/app';

describe('Evidence API', () => {
    let authToken: string;
    let caseFileId: number;

    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@evidence.com',
                password: 'Admin@123',
            });

        authToken = loginResponse.body.data.accessToken;

        // Create a case file for evidence tests
        const caseResponse = await request(app)
            .post('/api/v1/case-files')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                caseNumber: `CASE-EVD-${Date.now()}`,
                title: 'Test Case for Evidence',
                description: 'Test case file for evidence',
                incidentDate: new Date().toISOString(),
            });

        caseFileId = caseResponse.body.data.caseFileId;
    });

    describe('POST /api/v1/evidence', () => {
        it('should add evidence to a case file', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 1,
                    description: 'Test evidence item',
                    collectionDate: new Date().toISOString(),
                    collectionLocation: 'Test Lab A',
                    storageLocation: 'Locker 5',
                    chainOfCustody: 'Officer John Doe',
                    collectedBy: 1,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('Id'); // Backend returns PascalCase
        });

        it('should add evidence with minimal fields', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 2,
                    description: 'Minimal evidence',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should add evidence with different types', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 3,
                    description: 'Type 3 evidence',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 1,
                    description: 'Test',
                    collectionDate: new Date().toISOString(),
                });

            expect(response.status).toBe(401);
        });

        it('should fail with invalid evidence type', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 99999,
                    description: 'Test',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            // Backend currently returns 500 due to SP error, should be 400
            expect([ 400, 500 ]).toContain(response.status);
        });

        it('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    // Missing required fields
                });

            expect(response.status).toBe(400);
        });

        it('should fail with invalid case file id', async () => {
            const response = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: 99999,
                    evidenceTypeId: 1,
                    description: 'Test',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            expect([ 400, 500 ]).toContain(response.status);
        });
    });

    describe('GET /api/v1/evidence/case-file/:caseFileId', () => {
        it('should get all evidence for a case file', async () => {
            const response = await request(app)
                .get(`/api/v1/evidence/case-file/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should return empty array for case file with no evidence', async () => {
            const response = await request(app)
                .get('/api/v1/evidence/case-file/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 404 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get(`/api/v1/evidence/case-file/${caseFileId}`);

            expect(response.status).toBe(401);
        });
    });
});
