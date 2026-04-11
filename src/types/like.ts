import {SuccessResponse} from "./SuccessResponse.ts";

export interface Like extends SuccessResponse {
    is_liked: boolean;
}