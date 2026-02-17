import { useCallback, useEffect, useState } from 'react'

function useVideoPlayer(videoRef) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [bufferedPercent, setBufferedPercent] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState('')

  const play = useCallback(async () => {
    if (!videoRef.current) {
      return
    }

    try {
      await videoRef.current.play()
      setError('')
      setHasEnded(false)
    } catch {
      setIsPlaying(false)
      setError('Playback was interrupted. Please try again.')
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
      if (boundedTime < (duration || 0)) {
        setHasEnded(false)
      }
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

  const retry = useCallback(() => {
    if (!videoRef.current) {
      return
    }

    setError('')
    videoRef.current.load()
    play()
  }, [play, videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (video.currentTime < (video.duration || 0)) {
        setHasEnded(false)
      }
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0)
      setHasEnded(false)
      setIsBuffering(false)
    }
    const handleProgress = () => {
      if (!video.duration || video.buffered.length === 0) {
        setBufferedPercent(0)
        return
      }

      const bufferedEnd = video.buffered.end(video.buffered.length - 1)
      setBufferedPercent(Math.min((bufferedEnd / video.duration) * 100, 100))
    }
    const handleVolumeChange = () => setVolume(video.volume)
    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => {
      setIsBuffering(false)
      setError('')
    }
    const handleStalled = () => {
      setIsBuffering(true)
      setError('Network is unstable. Trying to recover...')
    }
    const handleError = () => {
      setIsPlaying(false)
      setIsBuffering(false)
      setError('Unable to load this video. Check your connection and retry.')
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(video.duration || 0)
      setHasEnded(true)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('durationchange', handleLoadedMetadata)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handleCanPlay)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('error', handleError)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('durationchange', handleLoadedMetadata)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('playing', handleCanPlay)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('error', handleError)
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
    bufferedPercent,
    hasEnded,
    isBuffering,
    error,
    play,
    pause,
    seek,
    skipForward,
    skipBackward,
    setPlayerVolume,
    retry,
  }
}

export default useVideoPlayer
