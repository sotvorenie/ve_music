import {describe, it, expect} from "vitest";

import {formatTime} from "@utils/formatTime.ts";

describe('formatTime', () => {
    it('форматирует 0 секунд', () => {
        expect(formatTime(0)).toBe('00:00')
    })

    it('форматирует 65 секунд в 01:05', () => {
        expect(formatTime(65)).toBe('01:05')
    })

    it('округляет и обрабатывает отрицательные значения', () => {
        expect(formatTime(-10)).toBe('00:00')
        expect(formatTime(59.6)).toBe('01:00')
    })

    it('выводим 00:00 при time = null/undefined/NaN', () => {
        expect(formatTime(null as unknown as number)).toBe('00:00')
        expect(formatTime(undefined as unknown as number)).toBe('00:00')
        expect(formatTime(NaN as unknown as number)).toBe('00:00')
    })

    it('преобразуем в число если time = string', () => {
        expect(formatTime('65' as unknown as number)).toBe('01:05')
    })
})