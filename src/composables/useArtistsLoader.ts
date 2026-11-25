import useArtistsStore from "@store/useArtistsStore.ts";
import useSearchStore from "@store/useSearchStore.ts";

export const useArtistsLoader = () => {
    const artistsStore = useArtistsStore();
    const searchStore = useSearchStore();

    const load = async (isClear = false) => {
        if (isClear) artistsStore.clear()

        await artistsStore.getArtists({
            searchName: searchStore.searchName,
            page: artistsStore.meta.page,
            limit: artistsStore.meta.limit,
        })
    }

    const loadMore = () => {
        if (artistsStore.meta.hasMore && !artistsStore.isLoading) {
            return load()
        }
    }

    return {
        load,
        loadMore,
    }
}