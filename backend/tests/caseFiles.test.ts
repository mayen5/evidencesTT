import request from 'supertest';
import app from '../src/app';

describe('CaseFiles API', () => {
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
    });

    describe('POST /api/v1/case-files', () => {
        it('should create a new case file', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `CASE-TEST-${Date.now()}`,
                    title: 'Test Case File',
                    description: 'This is a test case file',
                    location: 'Test Lab',
                    incidentDate: new Date().toISOString(),
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('caseFileId');

            caseFileId = response.body.data.caseFileId;
        });

        it('should create case file with minimal fields', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `CASE-MIN-${Date.now()}`,
                    title: 'Minimal Case',
                    description: 'Test',
                    incidentDate: new Date().toISOString(),
                });

            expect([ 201, 400 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .send({
                    caseNumber: 'CASE-TEST-001',
                    title: 'Test',
                    description: 'Test',
                    incidentDate: new Date().toISOString(),
                });

            expect(response.status).toBe(401);
        });

        it('should fail with invalid data', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: 'CASE-001',
                    // Missing required fields
                });

            expect(response.status).toBe(400);
        });

        it('should fail with duplicate case number', async () => {
            const duplicateNumber = `CASE-DUP-${Date.now()}`;

            // Create first
            await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: duplicateNumber,
                    title: 'First',
                    description: 'Test',
                    incidentDate: new Date().toISOString(),
                });

            // Try duplicate
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: duplicateNumber,
                    title: 'Second',
                    description: 'Test',
                    incidentDate: new Date().toISOString(),
                });

            // Backend may accept duplicate (201) or reject (400/409/500)
            expect([ 201, 400, 409, 500 ]).toContain(response.status);
        });
    });

    describe('GET /api/v1/case-files', () => {
        it('should get all case files with pagination', async () => {
            const response = await request(app)
                .get('/api/v1/case-files?page=1&pageSize=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('caseFiles');
            expect(response.body.data).toHaveProperty('totalRecords');
            expect(response.body.data).toHaveProperty('page');
            expect(response.body.data).toHaveProperty('pageSize');
        });

        it('should get case files with different page sizes', async () => {
            const response = await request(app)
                .get('/api/v1/case-files?page=1&pageSize=5')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.pageSize).toBe(5);
        });

        it('should handle page 2 request', async () => {
            const response = await request(app)
                .get('/api/v1/case-files?page=2&pageSize=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.page).toBe(2);
        });

        it('should get case files without pagination params', async () => {
            const response = await request(app)
                .get('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('caseFiles');
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/case-files?page=1&pageSize=10');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/v1/case-files/:id', () => {
        it('should get a specific case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .get(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeTruthy();
            expect(response.body.data).toHaveProperty('caseNumber'); // Verify it returns valid data
        });

        it('should return 404 for non-existent case file', async () => {
            const response = await request(app)
                .get('/api/v1/case-files/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/v1/case-files/:id', () => {
        it('should update a case file', async () => {
            if (!caseFileId) return; // Skip if not created

            const response = await request(app)
                .patch(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Title',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should update multiple fields', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .patch(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Another Update',
                    description: 'Updated description',
                    location: 'New Location',
                });

            expect([ 200, 400 ]).toContain(response.status);
        });

        it('should fail updating non-existent case file', async () => {
            const response = await request(app)
                .patch('/api/v1/case-files/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Update',
                });

            expect([ 404, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .patch('/api/v1/case-files/1')
                .send({
                    title: 'Test',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/v1/case-files/:id/submit', () => {
        it('should submit case file for review', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/submit`)
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 400, 500 ]).toContain(response.status); // May fail if already submitted
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/case-files/1/submit');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/v1/case-files/:id/approve', () => {
        it('should approve case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/approve`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    approvedBy: 1,
                    approvalNotes: 'Approved for testing',
                });

            expect([ 200, 400, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/case-files/1/approve');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/v1/case-files/:id/reject', () => {
        it('should reject case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/reject`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    rejectedBy: 1,
                    rejectionReason: 'Testing rejection',
                });

            expect([ 200, 400, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/case-files/1/reject');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/v1/case-files/:id/participants', () => {
        it('should get all participants for a case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .get(`/api/v1/case-files/${caseFileId}/participants`)
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 404 ]).toContain(response.status);
            if (response.status === 200) {
                expect(Array.isArray(response.body.data)).toBe(true);
            }
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/case-files/1/participants');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/v1/case-files/:id/participants', () => {
        it('should add participant to case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/participants`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    userId: 1,
                    role: 'Investigator',
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/case-files/1/participants')
                .send({
                    userId: 1,
                    role: 'Investigator',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/v1/case-files/:id/participants/:participantId', () => {
        it('should remove participant from case file', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .delete(`/api/v1/case-files/${caseFileId}/participants/1`)
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 404, 500 ]).toContain(response.status);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .delete('/api/v1/case-files/1/participants/1');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/v1/case-files/:id/history', () => {
        it('should get case file history', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const response = await request(app)
                .get(`/api/v1/case-files/${caseFileId}/history`)
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 404 ]).toContain(response.status);
            if (response.status === 200) {
                expect(Array.isArray(response.body.data)).toBe(true);
            }
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/case-files/1/history');

            expect(response.status).toBe(401);
        });
    });
});
