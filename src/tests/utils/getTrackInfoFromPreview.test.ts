import {describe, expect, it} from "vitest";

import {TrackPreview} from "@/types/music.ts";

import {getTrackInfoFromPreview} from "@utils/getTrackInfoFromPreview.ts";

describe('getTrackInfoFromPreview', () => {
    const basePreview: TrackPreview = {
        id: 1,
        name: 'название',
        duration: 200,
        url: '/static/track',
        previewUrl: '/static/preview',
        previewX480Url: '/static/preview_mobile',
        genreId: 1,
        artists: [
            {
                id: 1,
                name: 'артист',
                avatarUrl: '/static/avatar_url',
            },
        ],
    }

    it('копирует id, name, duration, url, artists', () => {
        const result = getTrackInfoFromPreview(basePreview)

        expect(result.id).toBe(basePreview.id)
        expect(result.name).toBe(basePreview.name)
        expect(result.duration).toBe(basePreview.duration)
        expect(result.url).toBe(basePreview.url)
        expect(result.artists).toEqual(basePreview.artists)
    })

    it('подставляет пустые значения для отсутствующих полей', () => {
        const result = getTrackInfoFromPreview(basePreview)

        expect(result.auditionsCount).toBe(0)
        expect(result.likesCount).toBe(0)
        expect(result.isLiked).toBe(false)
        expect(result.genre).toStrictEqual({id: -1, name: ''})
        expect(result.segmentsCount).toBe(0)
        expect(result.bitrates).toEqual([])
    })

    it('previewUrl: fallback на null', () => {
        const result = getTrackInfoFromPreview({
            ...basePreview,
            previewUrl: null,
        })

        expect(result.previewUrl).toBe('')
    })

    it('previewX480Url: fallback на null', () => {
        const result = getTrackInfoFromPreview({
            ...basePreview,
            previewX480Url: null,
        })

        expect(result.previewX480Url).toBeNull()
    })
})