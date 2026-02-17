import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import PlayerControls from './PlayerControls'
import SkipAnimation from './SkipAnimation'
import YouTubePlayer from './YouTubePlayer'

function VideoPlayer({ video, player }) {
  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [skipFeedback, setSkipFeedback] = useState(null)
  const [youtubePlayer, setYoutubePlayer] = useState(null)

  // Extract YouTube video ID from embed URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const youtubeVideoId = useMemo(() => {
    if (video?.mediaType === 'YOUTUBE') {
      return getYoutubeVideoId(video.videoUrl)
    }
    return null
  }, [video])

  const isYouTubeVideo = Boolean(youtubeVideoId)

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

  const handleYoutubeReady = (event) => {
    setYoutubePlayer(event.target)
  }

  const handleYoutubeStateChange = (event) => {
    // YouTube player state: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
    const playerState = event.data
    if (playerState === 1) {
      // Playing
      scheduleAutoHide()
    }
  }

  useEffect(() => {
    revealControls()
    return () => clearHideTimeout()
  }, [])

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
    if (isYouTubeVideo && youtubePlayer) {
      if (youtubePlayer.getPlayerState?.() === 1) {
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
      const current = youtubePlayer.getCurrentTime?.() || 0
      youtubePlayer.seekTo?.(Math.max(current - 10, 0))
    } else {
      player.skipBackward()
    }
    showSkipFeedback('-10')
    revealControls()
  }

  const handleSkipForward = () => {
    if (isYouTubeVideo && youtubePlayer) {
      const current = youtubePlayer.getCurrentTime?.() || 0
      const duration = youtubePlayer.getDuration?.() || 0
      youtubePlayer.seekTo?.(Math.min(current + 10, duration))
    } else {
      player.skipForward()
    }
    showSkipFeedback('+10')
    revealControls()
  }

  if (isYouTubeVideo) {
    return (
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
          bgcolor: 'black',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 0 42px rgba(255, 0, 0, 0.18)',
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

        <YouTubePlayer videoId={youtubeVideoId} isPlaying={player.isPlaying} onReady={handleYoutubeReady} onStateChange={handleYoutubeStateChange} />

        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8%', bgcolor: 'rgba(0,0,0,0.58)', zIndex: 2, pointerEvents: 'none' }} />

        {skipFeedbackType && <SkipAnimation type={skipFeedbackType} />}

        <PlayerControls
          currentTime={youtubePlayer?.getCurrentTime?.() || 0}
          duration={youtubePlayer?.getDuration?.() || video.duration}
          isPlaying={youtubePlayer?.getPlayerState?.() === 1}
          bufferedPercentage={0}
          isFullscreen={isFullscreen}
          onPlayPause={handlePlayPause}
          onSkipBackward={handleSkipBackward}
          onSkipForward={handleSkipForward}
          onSeek={(seconds) => youtubePlayer?.seekTo?.(seconds)}
          onVolumeChange={(volume) => youtubePlayer?.setVolume?.(volume * 100)}
          onFullscreenToggle={toggleFullscreen}
          showControls={showControls}
        />
      </Box>
    )
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
        boxShadow: '0 0 42px rgba(255, 0, 0, 0.18)',
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
          objectFit: 'contain',
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
