import { useCallback, useEffect, useState } from 'react'

function useVideoPlayer(videoRef) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const play = useCallback(async () => {
    if (!videoRef.current) {
      return
    }

    try {
      await videoRef.current.play()
    } catch {
      setIsPlaying(false)
    }
  }, [videoRef])

  const pause = useCallback(() => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.pause()
  }, [videoRef])

  const seek = useCallback(
    (time) => {
      if (!videoRef.current || Number.isNaN(time)) {
        return
      }

      const boundedTime = Math.min(Math.max(time, 0), duration || 0)
      videoRef.current.currentTime = boundedTime
      setCurrentTime(boundedTime)
    },
    [duration, videoRef],
  )

  const skipForward = useCallback(() => {
    seek((videoRef.current?.currentTime ?? 0) + 10)
  }, [seek, videoRef])

  const skipBackward = useCallback(() => {
    seek((videoRef.current?.currentTime ?? 0) - 10)
  }, [seek, videoRef])

  const setPlayerVolume = useCallback(
    (value) => {
      if (!videoRef.current) {
        return
      }

      const boundedVolume = Math.min(Math.max(value, 0), 1)
      videoRef.current.volume = boundedVolume
      videoRef.current.muted = boundedVolume === 0
      setVolume(boundedVolume)
    },
    [videoRef],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration || 0)
    const handleVolumeChange = () => setVolume(video.volume)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(video.duration || 0)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('durationchange', handleLoadedMetadata)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('durationchange', handleLoadedMetadata)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTagName = document.activeElement?.tagName?.toLowerCase()
      if (activeTagName === 'input' || activeTagName === 'textarea') {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        if (isPlaying) {
          pause()
        } else {
          play()
        }
      }

      if (event.code === 'ArrowRight') {
        event.preventDefault()
        skipForward()
      }

      if (event.code === 'ArrowLeft') {
        event.preventDefault()
        skipBackward()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, pause, play, skipBackward, skipForward])

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    seek,
    skipForward,
    skipBackward,
    setPlayerVolume,
  }
}

export default useVideoPlayer
