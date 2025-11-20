import { apiClient, tokenStorage } from '../api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RefreshTokenResponse,
    User,
    ApiResponse,
} from '../types';

class AuthService {
    /**
     * Login user
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/login',
            credentials
        );

        const { accessToken, refreshToken, user } = response.data.data;

        // Store tokens
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);

        return { accessToken, refreshToken, user };
    }

    /**
     * Register new user
     */
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/register',
            userData
        );

        const { accessToken, refreshToken, user } = response.data.data;

        // Store tokens
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);

        return { accessToken, refreshToken, user };
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Call logout endpoint (if exists)
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error);
        } finally {
            // Clear tokens
            tokenStorage.clearTokens();
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
            '/auth/refresh',
            { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    }

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!tokenStorage.getAccessToken();
    }
}

export const authService = new AuthService();
export default authService;
