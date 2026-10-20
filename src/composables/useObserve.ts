import {MaybeRef, MaybeRefOrGetter, onBeforeUnmount, toValue, watch} from "vue";

export const useObserve = (
    element: MaybeRef<HTMLElement | null>,
    func: Function,
    hasMore: MaybeRefOrGetter<boolean> = true
) => {
    let observer: IntersectionObserver | null = null
    let isProcessing: boolean = false

    watch(
        () => [toValue(element), toValue(hasMore)] as const,
        ([el, more]) => {
            observer?.disconnect()
            observer = null
            if (!el || !more) return

            observer = new IntersectionObserver(entries => {
                entries.forEach(async entry => {
                    if (!entry.isIntersecting) return
                    if (isProcessing) return

                    isProcessing = true
                    try {
                        await func()
                    } finally {
                        isProcessing = false
                    }
                })
            }, {
                root: el?.parentElement,
                rootMargin: '300px',
            })

            observer.observe(el)
        }
    )

    onBeforeUnmount(() => observer?.disconnect())
}