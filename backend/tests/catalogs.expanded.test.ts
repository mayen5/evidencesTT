import request from 'supertest';
import app from '../src/app';

describe('Catalog Tests', () => {
    describe('GET /api/v1/catalogs/roles', () => {
        it('should return all roles', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/roles');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should include admin role', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/roles');

            expect(response.status).toBe(200);
            const adminRole = response.body.data.find((r: { RoleId: number }) => r.RoleId === 1);
            expect(adminRole).toBeDefined();
        });
    });

    describe('GET /api/v1/catalogs/case-file-statuses', () => {
        it('should return all case file statuses', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/case-file-statuses');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should include status properties', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/case-file-statuses');

            expect(response.status).toBe(200);
            if (response.body.data.length > 0) {
                expect(response.body.data[ 0 ]).toHaveProperty('StatusId');
            }
        });
    });

    describe('GET /api/v1/catalogs/evidence-types', () => {
        it('should return all evidence types', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/evidence-types');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should include evidence type properties', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/evidence-types');

            expect(response.status).toBe(200);
            if (response.body.data.length > 0) {
                expect(response.body.data[ 0 ]).toHaveProperty('EvidenceTypeId');
            }
        });
    });

    describe('Public Access', () => {
        it('should allow access to roles without auth', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/roles');

            expect(response.status).toBe(200);
        });

        it('should allow access to statuses without auth', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/case-file-statuses');

            expect(response.status).toBe(200);
        });

        it('should allow access to evidence types without auth', async () => {
            const response = await request(app)
                .get('/api/v1/catalogs/evidence-types');

            expect(response.status).toBe(200);
        });
    });
});
