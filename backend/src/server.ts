import app from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import config from './config/environment';

const PORT = config.port;

const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        logger.info('Connecting to database...');
        await connectDatabase();
        logger.info('✓ Database connected successfully');

        // Start HTTP server
        app.listen(PORT, () => {
            logger.info(`✓ Server started successfully`);
            logger.info(`✓ Environment: ${config.node_env}`);
            logger.info(`✓ Server running on port ${PORT}`);
            logger.info(`✓ API Base URL: http://localhost:${PORT}/api/${config.apiVersion}`);
            logger.info(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
            logger.info(`✓ Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string): void => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();
