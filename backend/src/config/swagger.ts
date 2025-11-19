import swaggerJsdoc from 'swagger-jsdoc';
import config from './environment';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Evidence Management System API',
            version: '1.0.0',
            description: 'API para Sistema de Gestión de Evidencias Criminalísticas',
            contact: {
                name: 'API Support',
                email: 'support@evidence.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api/${config.apiVersion}`,
                description: 'Development server',
            },
            {
                url: `http://localhost:${config.port}/api/${config.apiVersion}`,
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                        },
                        details: {
                            type: 'object',
                            description: 'Additional error details',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        roleId: { type: 'integer' },
                        roleName: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CaseFile: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        caseNumber: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        incidentDate: { type: 'string', format: 'date-time' },
                        incidentLocation: { type: 'string' },
                        statusId: { type: 'integer' },
                        statusName: { type: 'string' },
                        registeredById: { type: 'integer' },
                        registeredByName: { type: 'string' },
                        reviewedById: { type: 'integer' },
                        reviewedByName: { type: 'string' },
                        rejectionReason: { type: 'string' },
                        registeredAt: { type: 'string', format: 'date-time' },
                        reviewedAt: { type: 'string', format: 'date-time' },
                        approvedAt: { type: 'string', format: 'date-time' },
                        evidenceCount: { type: 'integer' },
                    },
                },
                Evidence: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        caseFileId: { type: 'integer' },
                        evidenceNumber: { type: 'string' },
                        description: { type: 'string' },
                        evidenceTypeId: { type: 'integer' },
                        evidenceTypeName: { type: 'string' },
                        color: { type: 'string' },
                        size: { type: 'string' },
                        weight: { type: 'number' },
                        location: { type: 'string' },
                        storageLocation: { type: 'string' },
                        collectedById: { type: 'integer' },
                        collectedByName: { type: 'string' },
                        collectedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [ './src/routes/*.ts', './src/controllers/*.ts' ],
};

export const swaggerSpec = swaggerJsdoc(options);
