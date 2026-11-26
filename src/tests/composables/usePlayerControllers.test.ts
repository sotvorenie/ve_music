import {beforeEach, describe, expect, vi, it} from "vitest";
import {createPinia, setActivePinia} from "pinia";

import {usePlayerControllers} from "@composables/usePlayerControllers.ts";

import useControllersStore from "@store/useControllersStore.ts";
import useTracksStore from "@store/music/useTracksStore.ts";
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
import useRandomStore from "@store/music/useRandomStore.ts";

describe('usePlayerControllers', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    const tracks = [
        {
            id: 1, name: 'trackName', duration: 200, url: '/static/track',
            previewUrl: '/static/preview_url', previewX480Url: null, genreId: 1,
            artists: [{ id: 1, name: 'artistName', avatarUrl: '/static/avatar_url' }],
        },
        {
            id: 2, name: 'trackName', duration: 200, url: '/static/track',
            previewUrl: '/static/preview_url', previewX480Url: null, genreId: 1,
            artists: [{ id: 1, name: 'artistName', avatarUrl: '/static/avatar_url' }],
        },
        {
            id: 3, name: 'trackName', duration: 200, url: '/static/track',
            previewUrl: '/static/preview_url', previewX480Url: null, genreId: 1,
            artists: [{ id: 1, name: 'artistName', avatarUrl: '/static/avatar_url' }],
        },
        {
            id: 4, name: 'trackName', duration: 200, url: '/static/track',
            previewUrl: '/static/preview_url', previewX480Url: null, genreId: 1,
            artists: [{ id: 1, name: 'artistName', avatarUrl: '/static/avatar_url' }],
        },
        {
            id: 5, name: 'trackName', duration: 200, url: '/static/track',
            previewUrl: '/static/preview_url', previewX480Url: null, genreId: 1,
            artists: [{ id: 1, name: 'artistName', avatarUrl: '/static/avatar_url' }],
        },
    ]

    it('next() переключает на следующий трек в списке', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 1
        controllersStore.isRandom = false

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {next} = usePlayerControllers()
        await next()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 2})
        )
    })

    it('next() переключает на первый трек, если мы в конце списка', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 5
        controllersStore.isRandom = false

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {next} = usePlayerControllers()
        await next()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 1})
        )
    })

    it('next() в режиме random использует randomIndex', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()
        const randomStore = useRandomStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 4
        controllersStore.isRandom = true
        randomStore.randomIds = new Map([[-1, 1], [0, 2], [1, 4], [2, 5], [3, 3]])
        randomStore.randomIndex = 1

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {next} = usePlayerControllers()
        await next()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 5})
        )
    })

    it('prev() переключает на предыдущий трек в списке', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 2
        controllersStore.isRandom = false

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {prev} = usePlayerControllers()
        await prev()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 1})
        )
    })

    it('prev() переключает на последний трек, если мы в начале списка', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 1
        controllersStore.isRandom = false

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {prev} = usePlayerControllers()
        await prev()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 5})
        )
    })

    it('prev() в режиме random использует randomIndex', async () => {
        const controllersStore = useControllersStore()
        const tracksStore = useTracksStore()
        const currentTrackStore = useCurrentTrackStore()
        const randomStore = useRandomStore()

        tracksStore.tracks = tracks
        currentTrackStore.track.id = 4
        controllersStore.isRandom = true
        randomStore.randomIds = new Map([[-1, 1], [0, 2], [1, 4], [2, 5], [3, 3]])
        randomStore.randomIndex = 1

        const updateSpy = vi
            .spyOn(currentTrackStore, 'updateTrack')
            .mockImplementation(async () => {})

        const {prev} = usePlayerControllers()
        await prev()

        expect(updateSpy).toHaveBeenCalledWith(
            expect.objectContaining({id: 2})
        )
    })
})