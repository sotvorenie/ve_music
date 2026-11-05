import {UserWithToken} from "@/types/user.ts";

import {apiGet, apiPost} from "@/api";

export const AuthService = {
    auth(
        login: string,
        password: string,
    ): Promise<UserWithToken> {
        return apiPost(`/auth/login`, {login, password})
    },

    registration(
        login: string,
        password: string,
        name: string,
    ): Promise<UserWithToken> {
        return apiPost(`/auth/register`, {login, password, name})
    },

    getMe(): Promise<UserWithToken> {
        return apiGet('/auth/me')
    },
}