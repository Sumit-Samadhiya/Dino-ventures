import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import PlayerControls from './PlayerControls'
import SkipAnimation from './SkipAnimation'
import YouTubePlayer from './YouTubePlayer'

function VideoPlayer({ video, player, autoPlayToken = 0, onEndedChange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const updateIntervalRef = useRef(null)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInPictureInPicture, setIsInPictureInPicture] = useState(false)
  const [skipFeedback, setSkipFeedback] = useState(null)
  const [youtubePlayer, setYoutubePlayer] = useState(null)
  const [youtubeState, setYoutubeState] = useState({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
  })

  // Safety check for video object
  if (!video) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          bgcolor: 'black',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 42px rgba(255, 0, 0, 0.18)',
        }}
      >
        <Typography color="error" variant="body1">
          Video data not found, please go back and select a video again
        </Typography>
      </Box>
    )
  }

  const getYoutubeVideoId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const youtubeVideoId = useMemo(() => {
    if (video?.mediaType === 'YOUTUBE') {
      const id = getYoutubeVideoId(video.videoUrl)
      if (id) {
        console.log('Extracted YouTube ID:', id, 'from URL:', video.videoUrl)
      }
      return id
    }
    return null
  }, [video])

  const isYouTubeVideo = Boolean(youtubeVideoId)
  const canUsePiP = !isYouTubeVideo && typeof document !== 'undefined' && Boolean(document.pictureInPictureEnabled)

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const scheduleAutoHide = () => {
    clearHideTimeout()
    if (isMobile) {
      return
    }
    const isCurrentlyPlaying = isYouTubeVideo ? youtubeState.isPlaying : player.isPlaying
    if (!isCurrentlyPlaying) return

    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  const revealControls = () => {
    setShowControls(true)
    scheduleAutoHide()
  }

  const showSkipFeedback = (label) => {
    setSkipFeedback(`${label}-${Date.now()}`)
  }

  const skipFeedbackType = useMemo(() => {
    if (!skipFeedback) return null
    return skipFeedback.startsWith('+10') ? 'forward' : 'backward'
  }, [skipFeedback])

  const handleYoutubeReady = (event) => {
    const player = event.target
    setYoutubePlayer(player)
    // Set initial state
    if (player) {
      setYoutubeState({
        currentTime: player.getCurrentTime?.() || 0,
        duration: player.getDuration?.() || 0,
        isPlaying: true,
        volume: ((player.getVolume?.() ?? 100) / 100),
      })
      player.playVideo?.()
    }
  }

  const handleYoutubeStateChange = (event) => {
    const playerState = event.data
    const hasEnded = playerState === 0
    const isPlaying = playerState === 1 || playerState === 3

    setYoutubeState((prev) => ({
      ...prev,
      isPlaying,
    }))

    onEndedChange?.(hasEnded)

    if (isPlaying) {
      scheduleAutoHide()
    }
  }

  // Update YouTube player state periodically
  useEffect(() => {
    if (!isYouTubeVideo || !youtubePlayer) return

    updateIntervalRef.current = setInterval(() => {
      try {
        const current = youtubePlayer.getCurrentTime?.() || 0
        const duration = youtubePlayer.getDuration?.() || 0
        const state = youtubePlayer.getPlayerState?.() || -1
        const isPlaying = state === 1 || state === 3
        const volume = ((youtubePlayer.getVolume?.() ?? 100) / 100)

        setYoutubeState({
          currentTime: current,
          duration: duration,
          isPlaying: isPlaying,
          volume,
        })
      } catch (err) {
        // Silently handle YouTube API errors
      }
    }, 500)

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [isYouTubeVideo, youtubePlayer])

  useEffect(() => {
    if (isMobile) {
      setShowControls(true)
      clearHideTimeout()
      return
    }

    revealControls()
    return () => clearHideTimeout()
  }, [isMobile])

  useEffect(() => {
    if (!video?.id) {
      return
    }

    onEndedChange?.(false)

    if (isYouTubeVideo) {
      setYoutubeState((previous) => ({
        ...previous,
        isPlaying: true,
      }))
      youtubePlayer?.playVideo?.()
      revealControls()
      return
    }

    player.play()
    revealControls()
  }, [autoPlayToken, isYouTubeVideo, onEndedChange, player.play, video?.id, youtubePlayer])

  useEffect(() => {
    if (isYouTubeVideo) {
      return
    }

    onEndedChange?.(player.hasEnded)
  }, [isYouTubeVideo, onEndedChange, player.hasEnded])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (!skipFeedback) return

    const timer = setTimeout(() => {
      setSkipFeedback(null)
    }, 600)

    return () => clearTimeout(timer)
  }, [skipFeedback])

  useEffect(() => {
    if (isYouTubeVideo || !player.videoRef?.current) {
      return undefined
    }

    const videoElement = player.videoRef.current

    const handleEnterPiP = () => setIsInPictureInPicture(true)
    const handleLeavePiP = () => setIsInPictureInPicture(false)

    videoElement.addEventListener('enterpictureinpicture', handleEnterPiP)
    videoElement.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      videoElement.removeEventListener('enterpictureinpicture', handleEnterPiP)
      videoElement.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [isYouTubeVideo, player.videoRef, video?.id])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(() => {
        // Fullscreen request failed
      })
    } else {
      await document.exitFullscreen().catch(() => {
        // Exit fullscreen failed
      })
    }
  }

  const togglePictureInPicture = async () => {
    if (!canUsePiP || !player.videoRef?.current) {
      return
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await player.videoRef.current.requestPictureInPicture()
      }
    } catch {
      // PiP can fail due to browser permissions or unsupported context
    }
  }

  const handlePlayPause = () => {
    if (isYouTubeVideo && youtubePlayer) {
      if (youtubeState.isPlaying) {
        youtubePlayer.pauseVideo?.()
      } else {
        youtubePlayer.playVideo?.()
      }
    } else {
      if (player.isPlaying) {
        player.pause()
      } else {
        player.play()
      }
    }
    revealControls()
  }

  const handleSkipBackward = () => {
    if (isYouTubeVideo && youtubePlayer) {
      const newTime = Math.max(youtubeState.currentTime - 10, 0)
      youtubePlayer.seekTo?.(newTime)
      setYoutubeState((prev) => ({ ...prev, currentTime: newTime }))
    } else {
      player.skipBackward()
    }
    showSkipFeedback('-10')
    revealControls()
  }

  const handleSkipForward = () => {
    if (isYouTubeVideo && youtubePlayer) {
      const newTime = Math.min(youtubeState.currentTime + 10, youtubeState.duration)
      youtubePlayer.seekTo?.(newTime)
      setYoutubeState((prev) => ({ ...prev, currentTime: newTime }))
    } else {
      player.skipForward()
    }
    showSkipFeedback('+10')
    revealControls()
  }

  if (isYouTubeVideo) {
    const controls = (
      <PlayerControls
        currentTime={youtubeState.currentTime}
        duration={youtubeState.duration || video.duration}
        isPlaying={youtubeState.isPlaying}
        volume={youtubeState.volume}
        bufferedPercent={0}
        isPiPAvailable={false}
        isInPiP={false}
        isFullscreen={isFullscreen}
        onPlayPause={handlePlayPause}
        onSkipBackward={handleSkipBackward}
        onSkipForward={handleSkipForward}
        onSeek={(seconds) => {
          youtubePlayer?.seekTo?.(seconds)
          setYoutubeState((prev) => ({ ...prev, currentTime: seconds }))
        }}
        onVolumeChange={(volume) => {
          youtubePlayer?.setVolume?.(volume * 100)
          youtubePlayer?.unMute?.()
          setYoutubeState((prev) => ({ ...prev, volume }))
        }}
        onFullscreenToggle={toggleFullscreen}
        showControls={showControls}
        docked={isMobile}
      />
    )

    return (
      <Box sx={{ display: 'grid', gap: { xs: 1, sm: 0 } }}>
        <Box
          ref={containerRef}
          onMouseMove={revealControls}
          onMouseEnter={revealControls}
          onTouchStart={revealControls}
          onClick={revealControls}
          role="region"
          aria-label="YouTube video player"
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: { xs: 240, sm: 420, md: 540 },
            bgcolor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 10,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: -18,
              backgroundImage: `url(${video.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(26px) saturate(1.05)',
              opacity: 0.24,
              transform: 'scale(1.1)',
              pointerEvents: 'none',
            }}
          />

          <YouTubePlayer videoId={youtubeVideoId} isPlaying={youtubeState.isPlaying} onReady={handleYoutubeReady} onStateChange={handleYoutubeStateChange} />

          <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />

          {skipFeedbackType && <SkipAnimation type={skipFeedbackType} />}

          {!isMobile && controls}
        </Box>

        {isMobile && controls}
      </Box>
    )
  }

  const controls = (
    <PlayerControls
      currentTime={player.currentTime}
      duration={player.duration}
      isPlaying={player.isPlaying}
      bufferedPercent={player.bufferedPercent}
      isPiPAvailable={canUsePiP}
      isInPiP={isInPictureInPicture}
      onTogglePiP={togglePictureInPicture}
      isFullscreen={isFullscreen}
      onPlayPause={handlePlayPause}
      onSkipBackward={handleSkipBackward}
      onSkipForward={handleSkipForward}
      onSeek={player.seek}
      onVolumeChange={player.setPlayerVolume}
      onFullscreenToggle={toggleFullscreen}
      showControls={showControls}
      docked={isMobile}
    />
  )

  return (
    <Box sx={{ display: 'grid', gap: { xs: 1, sm: 0 } }}>
      <Box
        ref={containerRef}
        onMouseMove={revealControls}
        onMouseEnter={revealControls}
        onTouchStart={revealControls}
        onClick={revealControls}
        role="region"
        aria-label="Video player"
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          maxHeight: { xs: 240, sm: 420, md: 540 },
          bgcolor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 10,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: -18,
            backgroundImage: `url(${video.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(26px) saturate(1.05)',
            opacity: 0.24,
            transform: 'scale(1.1)',
            pointerEvents: 'none',
          }}
        />

        <Box
          component="video"
          ref={player.videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          autoPlay
          playsInline
          controls={false}
          aria-label={video.title}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            objectFit: { xs: 'cover', sm: 'contain' },
            display: 'block',
            viewTransitionName: `video-thumb-${video.id}`,
          }}
        />

        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />

        {skipFeedbackType && <SkipAnimation type={skipFeedbackType} />}

        {player.isBuffering && !player.error && (
          <Box
            role="status"
            aria-live="polite"
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              px: 1,
              py: 0.6,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.66)',
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CircularProgress size={16} color="inherit" />
            <Typography variant="caption">Buffering...</Typography>
          </Box>
        )}

        {player.error && (
          <Box
            role="alert"
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '88%', sm: 340 },
              bgcolor: 'rgba(0, 0, 0, 0.82)',
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 1.5,
              p: 1.5,
              color: 'common.white',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {player.error}
            </Typography>
            <Button size="small" variant="contained" color="error" onClick={player.retry} aria-label="Retry video playback">
              Retry
            </Button>
          </Box>
        )}

        {!isMobile && controls}
      </Box>

      {isMobile && controls}
    </Box>
  )
}

export default VideoPlayer
