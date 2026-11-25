import useTracksStore from "@store/music/useTracksStore.ts";
import useSearchStore from '@store/useSearchStore'
import useArtistsStore from '@store/useArtistsStore.ts'
import useGenresStore from '@store/useGenresStore'
import useMenuStore from '@store/useMenuStore'

export const useTracksLoader = () => {
    const tracksStore = useTracksStore()
    const searchStore = useSearchStore()
    const artistStore = useArtistsStore()
    const genresStore = useGenresStore()
    const menuStore = useMenuStore()

    const load = async (isClear = false) => {
        if (isClear) tracksStore.clear()

        await tracksStore.getTracks({
            mode: menuStore.menuMode,
            searchName: searchStore.searchName,
            artistId: artistStore.currentArtist?.id,
            genreId: genresStore.currentGenre?.id,
            page: tracksStore.meta.page,
            limit: tracksStore.meta.limit,
        })
    }

    const loadMore = () => {
        if (tracksStore.meta.hasMore && !tracksStore.isLoading) {
            return load()
        }
    }

    return {
        load,
        loadMore,
    }
}