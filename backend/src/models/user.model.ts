export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash?: string;
    firstName: string;
    lastName: string;
    roleId: number;
    roleName?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId?: number;
}

export interface UserUpdateInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    roleId?: number;
    isActive?: boolean;
}

export interface UserResponse extends Omit<User, 'passwordHash'> { }
