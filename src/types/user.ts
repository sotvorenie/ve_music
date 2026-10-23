export enum UserRoles {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: number
    name: string
    avatarUrl: string
    role: UserRoles
}

export interface UserWithToken {
    user: User,
    token: string
}