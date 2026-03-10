import {SuccessResponse} from "../../types/SuccessResponse.ts";

import {apiPost} from "../index.ts";

export const apiRedactUserName = async (name: string): Promise<SuccessResponse> => {
    return await apiPost(`/user/redact_name?name=${name}`)
}