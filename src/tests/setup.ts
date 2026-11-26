import { afterEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'

// автоматически размонтирует компоненты после каждого теста.
enableAutoUnmount(afterEach)

// глобальная очистка после каждого теста.
afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

// заглушка для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// заглушка для ResizeObserver
class ResizeObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// заглушка для IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
}))
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)