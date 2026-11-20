import {Url} from "@/types/url.ts";

import {apiDelete, apiPatch, apiPost} from "@/api";

export const UserService = {
    updateName(
        name: string = '',
    ): Promise<void> {
        const payload = {
            name,
        }

        return apiPatch(`/user/name`, payload)
    },

    updatePassword(
        password: string = '',
        oldPassword: string = '',
    ): Promise<{token: string}> {
        const payload = {
            password,
            old_password: oldPassword,
        }

        return apiPatch(`/user/password`, payload)
    },

    uploadAvatar(
        file: File,
    ): Promise<Url> {
        const formData = new FormData()
        formData.append('avatar', file)

        return apiPost(`/user/avatar`, formData)
    },

    deleteAvatar(): Promise<void> {
        return apiDelete(`/user/avatar`)
    }
}