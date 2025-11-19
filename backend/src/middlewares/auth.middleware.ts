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

/**
 * Authorization middleware - checks if user has required role
 * @param allowedRoles Array of roleIds that are allowed to access the route
 */
export const authorize = (allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No user authenticated' });
                return;
            }

            if (!allowedRoles.includes(req.user.roleId)) {
                logger.warn('Authorization failed:', {
                    userId: req.user.userId,
                    userRole: req.user.roleId,
                    allowedRoles,
                });
                res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
                return;
            }

            next();
        } catch (error) {
            logger.error('Authorization error:', error);
            res.status(500).json({ error: 'Authorization error' });
            return;
        }
    };
};

export default authenticate;
