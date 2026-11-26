import {TrackPreview} from "@/types/music.ts";

import {getTrackInfoFromPreview} from "@utils/getTrackInfoFromPreview.ts";

import useControllersStore from "@store/useControllersStore.ts";
import useTracksStore from "@store/music/useTracksStore.ts";
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
import useAudioStore from "@store/useAudioStore.ts";
import useRandomStore from "@store/music/useRandomStore.ts";

export const usePlayerControllers = () => {
    const controllersStore = useControllersStore();
    const tracksStore = useTracksStore();
    const currentTrackStore = useCurrentTrackStore();
    const audioStore = useAudioStore();
    const randomStore = useRandomStore();

    const getCurrentIndex = (): number => {
        return tracksStore.tracks.findIndex((m: TrackPreview) => m.id === currentTrackStore.track.id)
    }

    const prev = async () => {
        if (audioStore.currentTime > 20) {
            audioStore.audio.currentTime = 0
            return
        }

        try {
            currentTrackStore.isLoading = true

            if (controllersStore.isRandom) {
                randomStore.randomIndex = Math.max(-1, randomStore.randomIndex - 1)
                const id = randomStore.randomIds.get(randomStore.randomIndex)
                if (id && id !== currentTrackStore.track.id) await currentTrackStore.updateTrack({id})
                return
            }

            const currentIndex = getCurrentIndex()

            const prevIndexInCurrentList = (currentIndex - 1 + tracksStore.tracks.length) % tracksStore.tracks.length

            const prevTrackInfo = getTrackInfoFromPreview(tracksStore.tracks[prevIndexInCurrentList])
            await currentTrackStore.updateTrack({id: prevTrackInfo.id, trackData: prevTrackInfo})
        } finally {
            currentTrackStore.isLoading = false
        }
    }
    const next = async () => {
        currentTrackStore.isLoading = true

        if (controllersStore.isRandom) {
            try {
                randomStore.randomIndex += 1
                if (randomStore.randomIndex === 0) {
                    randomStore.randomIds.set(-1, currentTrackStore.track.id)
                }

                const id = randomStore.randomIds.get(randomStore.randomIndex)
                if (!id || id === currentTrackStore.track.id) return

                await currentTrackStore.updateTrack({id})
            } catch {
                randomStore.randomIndex -= 1
            } finally {
                currentTrackStore.isLoading = false
            }
        } else {
            try {
                const currentIndex = getCurrentIndex()

                const nextIndexInCurrentList = (currentIndex + 1) % tracksStore.tracks.length

                const nextTrackInfo = getTrackInfoFromPreview(tracksStore.tracks[nextIndexInCurrentList])
                await currentTrackStore.updateTrack({id: nextTrackInfo.id, trackData: nextTrackInfo})
            } finally {
                currentTrackStore.isLoading = false
            }
        }
    }

    return {
        prev,
        next,
    }
}