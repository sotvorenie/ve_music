import {describe, it, expect} from "vitest";

import {abortableRequest} from "@utils/abortableRequest.ts";

describe(abortableRequest, () => {
    it('nextSignal возвращает новый сигнал и отменяет предыдущий', () => {
        const {nextSignal} = abortableRequest()

        const signal1 = nextSignal()
        expect(signal1.aborted).toBe(false)

        const signal2 = nextSignal()
        expect(signal1.aborted).toBe(true)
        expect(signal2.aborted).toBe(false)
        expect(signal1).not.toBe(signal2)
    })

    it('isCurrent возвращает true только для последнего сигнала', () => {
        const {nextSignal, isCurrent} = abortableRequest()

        const signal1 = nextSignal()
        expect(isCurrent(signal1)).toBe(true)

        const signal2 = nextSignal()
        expect(isCurrent(signal1)).toBe(false)
        expect(isCurrent(signal2)).toBe(true)
    })

    it('abort отменяет текущий сигнал и сбрасывает состояние', () => {
        const {nextSignal, isCurrent, abort} = abortableRequest()

        const signal = nextSignal()
        abort()

        expect(signal.aborted).toBe(true)
        expect(isCurrent(signal)).toBe(false)
    })

    it('abort не падает, если не было ни одного nextSignal', () => {
        const {abort} = abortableRequest()
        expect(() => abort()).not.toThrow()
    })
})