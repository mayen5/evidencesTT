import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiClient } from './client';
import type { ErrorResponse } from '../types';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token management
export const tokenStorage = {
    getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
    setAccessToken: (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    clearTokens: (): void => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                // No refresh token, redirect to login
                tokenStorage.clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Call refresh endpoint
                const response = await apiClient.post('/auth/refresh', { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                // Update tokens
                tokenStorage.setAccessToken(accessToken);
                tokenStorage.setRefreshToken(newRefreshToken);

                // Update header and retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect
                processQueue(refreshError as AxiosError, null);
                tokenStorage.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
