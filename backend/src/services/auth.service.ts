import bcrypt from 'bcryptjs';
import { authenticateUser, registerUser } from '../repositories/auth.repository';
import { IUserResponse, IUserWithTokens } from '../types/user.types';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { ApiError } from '../utils/ApiError';

/**
 * Login user with email and password
 */
export const login = async (data: LoginInput): Promise<IUserWithTokens> => {
    const { email, password } = data;

    // Get user from database
    const user = await authenticateUser(email);

    if (!user) {
        throw new ApiError(401, 'Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Credenciales inválidas');
    }

    // Check if user is active
    if (!user.IsActive) {
        throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user.Id,
        email: user.Email,
        roleId: user.RoleId,
    });

    const refreshToken = generateRefreshToken({
        userId: user.Id,
        email: user.Email,
    });

    // Return user data with tokens
    const userResponse: IUserWithTokens = {
        userId: user.Id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        roleId: user.RoleId,
        roleName: user.RoleName,
        isActive: user.IsActive,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
        accessToken,
        refreshToken,
    };

    return userResponse;
};

/**
 * Register a new user
 */
export const register = async (data: RegisterInput): Promise<IUserResponse> => {
    const { email, password, firstName, lastName, roleId } = data;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await registerUser(email, passwordHash, firstName, lastName, roleId);

    if (!result.userId) {
        throw new ApiError(500, 'Error al registrar usuario');
    }

    // Get created user
    const user = await authenticateUser(email);

    if (!user) {
        throw new ApiError(500, 'Error al obtener usuario creado');
    }

    const userResponse: IUserResponse = {
        userId: user.Id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        roleId: user.RoleId,
        roleName: user.RoleName,
        isActive: user.IsActive,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
    };

    return userResponse;
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (userId: number, email: string, roleId: number): Promise<{ accessToken: string }> => {
    const accessToken = generateAccessToken({
        userId,
        email,
        roleId,
    });

    return { accessToken };
};
