import {Artist} from "@/types/artist.ts";

export const showArtists = (artistsArr: Artist[]) => {
    const emptyArtist: string = 'Неизвестный исполнитель'
    if (!artistsArr?.length) return emptyArtist

    return artistsArr.map(artist => artist.name)?.join(', ') || emptyArtist
}