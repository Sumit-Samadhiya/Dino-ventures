import { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import PlayerControls from './PlayerControls'

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

  const skipFeedbackText = useMemo(() => {
    if (!skipFeedback) {
      return ''
    }

    return skipFeedback.startsWith('+10') ? '+10s' : '-10s'
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
      onTouchStart={revealControls}
      onClick={revealControls}
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
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {skipFeedback && (
        <Box
          key={skipFeedback}
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            px: 1.2,
            py: 0.6,
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            color: 'common.white',
            fontSize: '0.95rem',
            fontWeight: 700,
            animation: 'skipPulse 560ms ease-out',
            '@keyframes skipPulse': {
              from: { opacity: 0, transform: 'translate(-50%, -46%) scale(0.92)' },
              to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            },
          }}
        >
          {skipFeedbackText}
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
        }}
      >
        <PlayerControls
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          duration={player.duration}
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
