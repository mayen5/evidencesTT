import sql from 'mssql';
import config from './environment';
import { logger } from '../utils/logger';

const dbConfig: sql.config = {
    server: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    options: {
        encrypt: config.database.encrypt,
        trustServerCertificate: config.database.trustServerCertificate,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000,
};

let pool: sql.ConnectionPool | null = null;

export const connectDatabase = async (): Promise<sql.ConnectionPool> => {
    try {
        if (pool) {
            return pool;
        }

        logger.info('Connecting to SQL Server...');
        pool = await sql.connect(dbConfig);
        logger.info('SQL Server connected successfully');

        // Handle pool errors
        pool.on('error', (err: Error) => {
            logger.error('SQL Pool Error:', err);
        });

        return pool;
    } catch (error) {
        logger.error('Database connection failed:', error);
        throw error;
    }
};

export const getPool = (): sql.ConnectionPool => {
    if (!pool) {
        throw new Error('Database pool not initialized. Call connectDatabase() first.');
    }
    return pool;
};

export const closeDatabase = async (): Promise<void> => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            logger.info('Database connection closed');
        }
    } catch (error) {
        logger.error('Error closing database connection:', error);
        throw error;
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDatabase();
    process.exit(0);
});

export default { connectDatabase, getPool, closeDatabase };
