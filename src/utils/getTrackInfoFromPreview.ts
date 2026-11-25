import {Track, TrackPreview} from "@/types/music.ts";

export const getTrackInfoFromPreview = (previewTrack: TrackPreview): Track => {
    return {
        id: previewTrack.id,
        name: previewTrack.name,
        duration: previewTrack.duration,
        auditionsCount: 0,
        likesCount: 0,
        url: previewTrack.url,
        previewUrl: previewTrack.previewUrl ?? '',
        previewX480Url: previewTrack.previewX480Url ?? null,
        videoClipUrl: '',
        isLiked: false,
        genre: {
            id: -1,
            name: '',
        },
        artists: previewTrack.artists,
        segmentsCount: 0,
        bitrates: [],
    }
}