import request from 'supertest';
import app from '../src/app';

describe('Catalogs API', () => {
    describe('GET /api/v1/catalogs/roles', () => {
        it('should get all roles', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/roles');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/catalogs/case-file-statuses', () => {
        it('should get all case file statuses', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/case-file-statuses');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/catalogs/evidence-types', () => {
        it('should get all evidence types', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/evidence-types');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});
