import {UserWithToken} from "../../types/user.ts";

import {apiGet, apiPost} from "../index.ts";

export const apiAuth = async (login: string, password: string): Promise<UserWithToken> => {
    return await apiPost(`/auth/login`, {
        login,
        password
    })
}

export const apiRegister = async (login: string, password: string, name: string): Promise<UserWithToken> => {
    return await apiPost(`/auth/register`, {
        login,
        password,
        name
    })
}

export const apiCheckMe = async (): Promise<UserWithToken> => {
    return await apiGet('/auth/me')
}