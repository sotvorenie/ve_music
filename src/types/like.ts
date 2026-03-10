import {SuccessResponse} from "./SuccessResponse.ts";

export interface Like extends SuccessResponse{
    liked: boolean
}

export interface IsLiked {
    is_liked: boolean
}