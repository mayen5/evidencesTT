/**
 * User interface (matches database schema with Id, not UserId)
 */
export interface IUser {
    Id: number;
    Username?: string;
    Email: string;
    PasswordHash: string;
    FirstName: string;
    LastName: string;
    RoleId: number;
    RoleName?: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt?: Date;
}

/**
 * User response (without password) - camelCase for frontend
 */
export interface IUserResponse {
    userId: number;
    username?: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    roleName?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

/**
 * User with tokens
 */
export interface IUserWithTokens extends IUserResponse {
    accessToken: string;
    refreshToken: string;
}
