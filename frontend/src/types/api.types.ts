// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    errors?: Record<string, string[]>;
}

// Common Types
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}
