import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ isLoading, setIsLoading ] = useState(true);

    const isAuthenticated = !!user;

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Check if user is authenticated
     */
    const checkAuth = async () => {
        setIsLoading(true);
        try {
            if (authService.isAuthenticated()) {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login user
     */
    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.login(credentials);
            setUser(response.user);
            toast.success('¡Inicio de sesión exitoso!');
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || 'Error al iniciar sesión';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Register user
     */
    const register = async (userData: RegisterRequest) => {
        try {
            setIsLoading(true);
            const response = await authService.register(userData);
            setUser(response.user);
            toast.success('¡Registro exitoso!');
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || 'Error al registrar usuario';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
            toast.success('Sesión cerrada');
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
