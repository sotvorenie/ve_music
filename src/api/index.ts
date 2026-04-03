import axios from 'axios'

import {showError} from "../utils/modals.ts";
import {logout} from "../utils/auth.ts";

import useUserStore from "../store/useUserStore.ts";

const client = axios.create({
    baseURL: 'http://localhost:81',
    timeout: 10000,
})

client.interceptors.request.use((config) => {
    const userStore = useUserStore();

    if (userStore.token) config.headers.Authorization = `Bearer ${userStore.token}`
    return config
})
client.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            await showError(
                'Невалидный токен..',
                'Ваш токен авторизации невалиден!! Пожалуйста, авторизуйтесь'
            )
            logout()
        }
        return Promise.reject(error)
    }
)

export const apiGet = async <T>(url: string, params?: any, signal?: AbortSignal): Promise<T> => {
    const res = await client.get(url, { params, signal })
    return res.data as T
}

export const apiPost = async <T>(
    url: string,
    data?: any,
    config?: any,
    signal?: AbortSignal
): Promise<T> => {
    const finalConfig = { ...config, signal }
    const res = await client.post(url, data, finalConfig)
    return res.data as T
}