import {SuccessResponse} from "@/types/SuccessResponse.ts";
import {UserAvatar} from "@/types/user.ts";

import {apiPatch, apiPost} from "@api/index.ts";

export const apiRedactUserName = async (name: string): Promise<SuccessResponse> => {
    return apiPatch(`/user/redact_name`, {
        name,
    })
}

export const apiRedactUserPassword = async (password: string): Promise<SuccessResponse> => {
    return apiPatch(`/user/redact_password`, {
        password,
    })
}

export const apiRedactUserAvatar = async (file: File): Promise<UserAvatar> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiPost(`/user/upload_avatar`, formData)
}