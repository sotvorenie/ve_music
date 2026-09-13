import {watchEffect} from "vue";

export const observeList = (
    listRef: HTMLUListElement | null,
    liRef: HTMLLIElement | null,
    apiFunc: Function,
    checkValues: boolean
) => {
    let observer: IntersectionObserver | null = null

    const initObserver = () => {
        const observerOptions = {
            root: listRef,
            rootMargin: '400px',
            threshold: 0,
        }
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) apiFunc()
            })
        }

        observer = new IntersectionObserver(observerCallback, observerOptions)
        if (liRef) observer.observe(liRef)
    }

    const clearObserver = () => {
        if (observer) observer.disconnect()
    }

    watchEffect((onCleanup) => {
        if (!listRef || checkValues) return
        initObserver()
        onCleanup(() => clearObserver())
    })
}