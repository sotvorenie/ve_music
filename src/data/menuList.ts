import MusicIcon from "@icons/MusicIcon.vue";
import HistoryIcon from "@icons/HistoryIcon.vue";
import LikeIcon from "@icons/LikeIcon.vue";

export const menuList = [
    {
        name: 'Жанры',
        value: 'genres',
        icon: MusicIcon,
    },
    {
        name: 'История',
        value: 'history',
        icon: HistoryIcon,
    },
    {
        name: 'Избранное',
        value: 'favorites',
        icon: LikeIcon,
    },
]