import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import config from './config/environment';
import { requestLogger } from './middlewares/requestLogger.middleware';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';
import { generalLimiter } from './middlewares/rateLimit.middleware';

// Import routes (will be created)
// import routes from './routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
    })
);

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.node_env,
    });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Evidence Management API',
}));

// API routes
// app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
