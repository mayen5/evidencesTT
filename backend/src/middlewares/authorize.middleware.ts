import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/enums';

export const authorize = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        if (!allowedRoles.includes(req.user.roleId as UserRole)) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'No tiene permisos para realizar esta acción',
            });
            return;
        }

        next();
    };
};

export default authorize;
