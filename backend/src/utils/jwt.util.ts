import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/environment';

export interface JwtPayload {
    userId: number;
    email: string;
    roleId: number;
    username?: string; // Optional for backwards compatibility
    roleName?: string; // Optional for backwards compatibility
}

export const generateAccessToken = (payload: Omit<JwtPayload, 'username' | 'roleName'>): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload as object, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: Pick<JwtPayload, 'userId' | 'email'>): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload as object, config.jwt.refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
