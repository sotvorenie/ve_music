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
})