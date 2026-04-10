const formatTime = (time: number): string => {
    const totalSeconds = Math.round(time)

    const minutes: number = Math.floor(totalSeconds / 60)
    const seconds: number = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default formatTime