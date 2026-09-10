import {UrlType} from "@/types/url.ts";

import {apiPatch, apiPost} from "@api/index.ts";

export const apiRedactUserName = async (name: string): Promise<void> => {
    return apiPatch(`/user/redact_name`, {
        name,
    })
}

export const apiRedactUserPassword = async (password: string): Promise<void> => {
    return apiPatch(`/user/redact_password`, {
        password,
    })
}

export const apiUploadUserAvatar = async (file: File): Promise<UrlType> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiPost(`/user/upload_avatar`, formData)
}

export const apiDeleteUserAvatar = async (): Promise<void> => {
    return apiPatch(`/user/delete_avatar`)
}