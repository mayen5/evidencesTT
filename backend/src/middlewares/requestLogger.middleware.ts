import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { logger } from '../utils/logger';

// Custom morgan token for response time
morgan.token('response-time-ms', (req: Request, res: Response) => {
    const responseTime = res.get('X-Response-Time');
    return responseTime || '-';
});

// Morgan middleware with winston
export const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message: string) => {
                logger.info(message.trim());
            },
        },
    }
);

// Custom request logger middleware
export const customRequestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip,
        });
    });

    next();
};

export default { requestLogger, customRequestLogger };
