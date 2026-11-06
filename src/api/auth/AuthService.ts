import {UserWithToken} from "@/types/user.ts";

import {apiGet, apiPost} from "@/api";

export const AuthService = {
    auth(
        login: string,
        password: string,
    ): Promise<UserWithToken> {
        const payload = {
            login,
            password,
        }

        return apiPost(`/auth/login`, payload)
    },

    registration(
        login: string,
        password: string,
        name: string,
    ): Promise<UserWithToken> {
        const payload = {
            login,
            password,
            name,
        }

        return apiPost(`/auth/register`, payload)
    },

    getMe(): Promise<UserWithToken> {
        return apiGet('/auth/me')
    },
}