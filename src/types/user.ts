export interface User {
    id: number
    name: string
    avatarUrl: string
}

export interface UserWithToken {
    user: User,
    token: string
}

export interface UserAvatar {
    newAvatarUrl: string
}