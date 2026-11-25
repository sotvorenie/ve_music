import {Url} from "@/types/url.ts";

import {apiDelete, apiPatch, apiPost} from "@/api";

export const UserService = {
    updateName(
        name: string = '',
        signal?: AbortSignal,
    ): Promise<void> {
        const payload = {
            name,
        }

        return apiPatch(`/user/name`, payload, {signal})
    },

    updatePassword(
        password: string = '',
        oldPassword: string = '',
        signal?: AbortSignal,
    ): Promise<{token: string}> {
        const payload = {
            password,
            old_password: oldPassword,
        }

        return apiPatch(`/user/password`, payload, {signal})
    },

    uploadAvatar(
        file: File,
    ): Promise<Url> {
        const formData = new FormData()
        formData.append('avatar', file)

        return apiPost(`/user/avatar`, formData)
    },

    deleteAvatar(
        signal?: AbortSignal,
    ): Promise<void> {
        return apiDelete(`/user/avatar`, {signal})
    }
}