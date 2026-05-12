import {MusicList, Music} from "../../types/music.ts";

import {apiGet} from "../index.ts";

import useSearchStore from "../../store/useSearchStore.ts";
import useArtistStore from "../../store/useArtistStore.ts";
import useMenuStore from "../../store/useMenuStore.ts";

export const apiGetMusicList = async (
    page: number = 1,
    limit: number = 21
): Promise<MusicList> => {
    const searchStore = useSearchStore();
    const artistStore = useArtistStore();
    const menuStore = useMenuStore();

    return await apiGet(`/music/list?name=${searchStore.searchName}&genre_id=${menuStore.activeGenreId}&artist_id=${artistStore.artistId}&page=${page}&limit=${limit}`);
}

export const apiGetMusic = async (musicId: number, setView: boolean = true): Promise<Music> => {
    return await apiGet(`/music/${musicId}?set_view=${setView}`);
}