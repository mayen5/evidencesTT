/**
 * Custom API Error class
 */
export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Common API errors
 */
export class NotFoundError extends ApiError {
    constructor(message = 'Recurso no encontrado') {
        super(404, message);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'No autorizado') {
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Acceso denegado') {
        super(403, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message = 'Solicitud inválida') {
        super(400, message);
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'Conflicto con el estado actual del recurso') {
        super(409, message);
    }
}

export class InternalServerError extends ApiError {
    constructor(message = 'Error interno del servidor') {
        super(500, message);
    }
}
