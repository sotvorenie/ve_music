import {Url} from "@/types/url.ts";

import {apiPatch, apiPost} from "@/api";

export const UserService = {
    updateName(
        name: string = '',
    ): Promise<void> {
        const payload = {
            name,
        }

        return apiPatch(`/user/update_name`, payload)
    },

    updatePassword(
        password: string = '',
    ): Promise<void> {
        const payload = {
            password,
        }

        return apiPatch(`/user/update_password`, payload)
    },

    uploadAvatar(
        file: File,
    ): Promise<Url> {
        const formData = new FormData()
        formData.append('avatar', file)

        return apiPost(`/user/upload_avatar`, formData)
    },

    deleteAvatar(): Promise<void> {
        return apiPatch(`/user/delete_avatar`)
    }
}