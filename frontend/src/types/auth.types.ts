import type { BaseEntity } from './api.types';

// User Roles
export const UserRole = {
    ADMIN: 1,
    COORDINATOR: 2,
    TECHNICIAN: 3,
    VIEWER: 4,
} as const;

export type UserRole = typeof UserRole[ keyof typeof UserRole ];

export interface Role {
    id: number;
    name: string;
    description: string;
}

// User Interface
export interface User extends BaseEntity {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    role?: Role;
    isActive: boolean;
}

// Auth Request/Response Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: number;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
