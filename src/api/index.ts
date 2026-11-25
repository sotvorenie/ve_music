import axios, {AxiosRequestConfig} from 'axios'

import {BASE_URL} from "@api/url.ts";

import {logOut} from "@utils/auth.ts";

const client = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
client.interceptors.response.use(
    response => response,
    async error => {
        if (axios.isCancel(error)) {
            return Promise.reject({ isCanceled: true, detail: 'canceled' })
        }

        if (error.response?.status === 401 && error.response?.data?.code === 'JWT_INVALID') {
            logOut()
            return Promise.reject({ isCanceled: true })
        }

        const errorData = error.response?.data || { detail: error.message || "Ошибка сети" }
        return Promise.reject(errorData)
    }
)

export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await client.get(url, config)
    return res.data as T
}


export const apiPost = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const res = await client.post(url, data, config)
    return res.data as T
}

export const apiPatch = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const res = await client.patch(url, data, config)
    return res.data as T
}

export const apiDelete = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const res = await client.delete(url, config)
    return res.data as T
}

export const isCanceledErr = (
    err: unknown,
): boolean => {
    return typeof err === 'object' && err !== null && 'isCanceled' in err && err.isCanceled === true
}

export const getErrMessage = (
    err: unknown,
    fallback?: string,
) => {
    if (typeof err === 'object' && err !== null && 'detail' in err && typeof err.detail === 'string') {
        return err.detail
    }
    return fallback ?? 'Неизвестная ошибка'
}