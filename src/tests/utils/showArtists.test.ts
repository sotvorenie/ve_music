import {describe, expect, it} from "vitest";

import {Artist} from "@/types/artist.ts";

import {showArtists} from "@utils/showArtist.ts";

describe('showArtists', () => {
    const artistsArr: Artist[] = [
        {
            id: 1,
            name: 'артист 1',
            avatarUrl: '/static/avatar_url_1',
        },
        {
            id: 2,
            name: 'артист 2',
            avatarUrl: '/static/avatar_url_2',
        },
    ]
    const invalidArtist = { id: 1, name: null, avatarUrl: '' } as unknown as Artist

    it('возвращет список имен исполнителей', () => {
        expect(showArtists(artistsArr)).toBe(`${artistsArr[0].name}, ${artistsArr[1].name}`)
    })

    it('возвращет emptyArtists если artistsArr.length = 0', () => {
        expect(showArtists([])).toBe('Неизвестный исполнитель')
    })

    it('возвращет emptyArtists если все имена null', () => {
        expect(showArtists([invalidArtist, invalidArtist])).toBe('Неизвестный исполнитель')
    })

    it('возвращет список корректных имен исполнителей, если есть хотя один исполнитель с name = null', () => {
        expect(showArtists([invalidArtist, ...artistsArr])).toBe(`${artistsArr[0].name}, ${artistsArr[1].name}`)
    })
})