import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import PlayerControls from './PlayerControls'
import SkipAnimation from './SkipAnimation'

function VideoPlayer({ video, player }) {
  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [skipFeedback, setSkipFeedback] = useState(null)

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const scheduleAutoHide = () => {
    clearHideTimeout()
    if (!player.isPlaying) {
      return
    }

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
    if (!skipFeedback) {
      return null
    }

    return skipFeedback.startsWith('+10') ? 'forward' : 'backward'
  }, [skipFeedback])

  useEffect(() => {
    revealControls()
    return () => clearHideTimeout()
  }, [player.isPlaying])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (!skipFeedback) {
      return
    }

    const timer = setTimeout(() => {
      setSkipFeedback(null)
    }, 600)

    return () => clearTimeout(timer)
  }, [skipFeedback])

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return
    }

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  const handlePlayPause = () => {
    if (player.isPlaying) {
      player.pause()
    } else {
      player.play()
    }
    revealControls()
  }

  const handleSkipBackward = () => {
    player.skipBackward()
    showSkipFeedback('-10')
    revealControls()
  }

  const handleSkipForward = () => {
    player.skipForward()
    showSkipFeedback('+10')
    revealControls()
  }

  return (
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
        bgcolor: 'black',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
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
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />

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

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        }}
      >
        <PlayerControls
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          duration={player.duration}
          bufferedPercent={player.bufferedPercent}
          volume={player.volume}
          isFullscreen={isFullscreen}
          onPlayPause={handlePlayPause}
          onSkipBackward={handleSkipBackward}
          onSkipForward={handleSkipForward}
          onSeek={player.seek}
          onVolumeChange={player.setPlayerVolume}
          onToggleFullscreen={toggleFullscreen}
        />
      </Box>
    </Box>
  )
}

export default VideoPlayer
