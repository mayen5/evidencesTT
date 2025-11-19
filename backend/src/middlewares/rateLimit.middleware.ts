import rateLimit from 'express-rate-limit';
import config from '../config/environment';

export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        error: 'Too many requests',
        message: 'Has excedido el límite de solicitudes. Por favor intenta más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        error: 'Too many login attempts',
        message: 'Demasiados intentos de inicio de sesión. Por favor intenta en 15 minutos.',
    },
    skipSuccessfulRequests: true,
});

export const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        error: 'Too many create requests',
        message: 'Estás creando demasiados registros. Por favor espera un momento.',
    },
});

export default { generalLimiter, authLimiter, createLimiter };
