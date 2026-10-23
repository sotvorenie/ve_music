import {Url} from "@/types/url.ts";

import {apiPatch, apiPost} from "@api/index.ts";

export const apiRedactUserName = (name: string): Promise<void> => {
    return apiPatch(`/user/update_name`, {
        name,
    })
}

export const apiRedactUserPassword = (password: string): Promise<void> => {
    return apiPatch(`/user/update_password`, {
        password,
    })
}

export const apiUploadUserAvatar = (file: File): Promise<Url> => {
    const formData = new FormData()
    formData.append('avatar', file)

    return apiPost(`/user/upload_avatar`, formData)
}

export const apiDeleteUserAvatar = (): Promise<void> => {
    return apiPatch(`/user/delete_avatar`)
}