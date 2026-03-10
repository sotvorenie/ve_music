import {Artist} from "../types/artist.ts";

const emptyArtist: string = 'Неизвестный исполнитель'

export const showArtists = (artistsArr: Artist[]) => {
    if (!artistsArr?.length) return emptyArtist
    return artistsArr.map(artist => artist.name)?.join(', ') || emptyArtist
}