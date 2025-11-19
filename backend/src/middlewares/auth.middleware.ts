import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        try {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            logger.warn('Invalid token attempt:', { token: token.substring(0, 10) + '...' });
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication error' });
        return;
    }
};

export default authenticate;
