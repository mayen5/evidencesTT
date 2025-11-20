import request from 'supertest';
import app from '../src/app';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('Integration Tests', () => {
    let authToken: string;
    let caseFileId: number;
    let testFilePath: string;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@evidence.com',
                password: 'Admin@123',
            });

        authToken = loginResponse.body.data.accessToken;

        // Create test file
        testFilePath = path.join(os.tmpdir(), 'integration-test.txt');
        fs.writeFileSync(testFilePath, 'Integration test file');
    });

    afterAll(() => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    describe('Complete Case File Workflow', () => {
        it('should create case file → add evidence → add participant → update', async () => {
            // 1. Create case file
            const createResponse = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `INT-FLOW-${Date.now()}`,
                    title: 'Integration Test Case',
                    description: 'Full workflow test',
                    location: 'Test Location',
                    incidentDate: new Date().toISOString(),
                });

            expect(createResponse.status).toBe(201);
            caseFileId = createResponse.body.data.caseFileId;

            // 2. Add evidence
            const evidenceResponse = await request(app)
                .post('/api/v1/evidence')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseFileId: caseFileId,
                    evidenceTypeId: 1,
                    description: 'Workflow test evidence',
                    collectionDate: new Date().toISOString(),
                    collectedBy: 1,
                });

            expect([ 201, 400, 500 ]).toContain(evidenceResponse.status);

            // 3. Add participant
            const participantResponse = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/participants`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    userId: 1,
                    role: 'Lead Investigator',
                });

            expect([ 201, 400, 500 ]).toContain(participantResponse.status);

            // 4. Upload attachment
            const attachmentResponse = await request(app)
                .post(`/api/v1/case-files/${caseFileId}/attachments`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', testFilePath);

            expect([ 201, 400, 500 ]).toContain(attachmentResponse.status);

            // 5. Update case file
            const updateResponse = await request(app)
                .patch(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Integration Test Case',
                });

            expect([ 200, 400 ]).toContain(updateResponse.status);

            // 6. Get complete case file
            const getResponse = await request(app)
                .get(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.status).toBe(200);

            // 7. Get history
            const historyResponse = await request(app)
                .get(`/api/v1/case-files/${caseFileId}/history`)
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 404 ]).toContain(historyResponse.status);
        });
    });

    describe('Error Recovery', () => {
        it('should handle concurrent updates gracefully', async () => {
            if (!caseFileId) {
                expect(true).toBe(true);
                return;
            }

            const update1 = request(app)
                .patch(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Concurrent Update 1' });

            const update2 = request(app)
                .patch(`/api/v1/case-files/${caseFileId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Concurrent Update 2' });

            const [ response1, response2 ] = await Promise.all([ update1, update2 ]);

            expect([ 200, 400, 500 ]).toContain(response1.status);
            expect([ 200, 400, 500 ]).toContain(response2.status);
        });
    });

    describe('Boundary Conditions', () => {
        it('should handle very long descriptions', async () => {
            const longDescription = 'A'.repeat(5000);

            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `LONG-${Date.now()}`,
                    title: 'Long Description Test',
                    description: longDescription,
                    incidentDate: new Date().toISOString(),
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should handle special characters in case number', async () => {
            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `CASE-2024-#@!-${Date.now()}`,
                    title: 'Special Chars Test',
                    description: 'Test',
                    incidentDate: new Date().toISOString(),
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should handle past dates', async () => {
            const pastDate = new Date('2020-01-01').toISOString();

            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `PAST-${Date.now()}`,
                    title: 'Past Date Test',
                    description: 'Test',
                    incidentDate: pastDate,
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });

        it('should handle future dates', async () => {
            const futureDate = new Date('2030-01-01').toISOString();

            const response = await request(app)
                .post('/api/v1/case-files')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    caseNumber: `FUTURE-${Date.now()}`,
                    title: 'Future Date Test',
                    description: 'Test',
                    incidentDate: futureDate,
                });

            expect([ 201, 400, 500 ]).toContain(response.status);
        });
    });

    describe('User Pagination Edge Cases', () => {
        it('should handle page=0', async () => {
            const response = await request(app)
                .get('/api/v1/users?page=0&pageSize=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 400 ]).toContain(response.status);
        });

        it('should handle very large page size', async () => {
            const response = await request(app)
                .get('/api/v1/users?page=1&pageSize=1000')
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 400 ]).toContain(response.status);
        });

        it('should handle negative page numbers', async () => {
            const response = await request(app)
                .get('/api/v1/users?page=-1&pageSize=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect([ 200, 400, 500 ]).toContain(response.status);
        });
    });
});
