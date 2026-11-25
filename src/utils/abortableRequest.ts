export const abortableRequest = () => {
    let currentController: AbortController | null = null

    const nextSignal = (): AbortSignal => {
        currentController?.abort()
        currentController = new AbortController()
        return currentController.signal
    }

    const isCurrent = (signal: AbortSignal): boolean => {
        return currentController?.signal === signal
    }

    const abort = () => {
        currentController?.abort()
        currentController = null
    }

    return { nextSignal, isCurrent, abort }
}