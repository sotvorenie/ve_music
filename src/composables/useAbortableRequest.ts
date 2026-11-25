import {onBeforeUnmount} from "vue";

import {abortableRequest} from "@utils/abortableRequest.ts";

export const useAbortableRequest = () => {
    const req = abortableRequest()
    onBeforeUnmount(req.abort)
    return req
}