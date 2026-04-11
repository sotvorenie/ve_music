import {SuccessResponse} from "../../types/SuccessResponse.ts";
import {UserAvatar} from "../../types/user.ts";

import {apiPost} from "../index.ts";

export const apiRedactUserName = async (name: string): Promise<SuccessResponse> => {
    return await apiPost(`/user/redact_name?name=${name}`)
}

export const apiRedactUserAvatar = async (file: File): Promise<UserAvatar> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiPost(`/user/redact_avatar`, formData)
}