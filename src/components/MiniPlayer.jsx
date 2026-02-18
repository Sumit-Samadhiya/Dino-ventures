import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import useGestures from '../hooks/useGestures'
import YouTubePlayer from './YouTubePlayer'

function MiniPlayer({ data, onClose, onRestore, onStateUpdate }) {
  const videoRef = useRef(null)
  const youtubePlayerRef = useRef(null)
  const [isDraggingUp, setIsDraggingUp] = useState(false)

  const youtubeVideoId = useMemo(() => {
    if (data.mediaType !== 'YOUTUBE' || !data.videoUrl) {
      return null
    }

    const match = data.videoUrl.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? match[1] : data.videoId
  }, [data.mediaType, data.videoId, data.videoUrl])

  const isYouTube = Boolean(youtubeVideoId)

  const gestureHandlers = useGestures({
    onSwipeUp: onRestore,
    onDragStart: () => setIsDraggingUp(true),
    onDragEnd: ({ distanceY }) => {
      setIsDraggingUp(false)
      if (distanceY < -90) {
        onRestore()
      }
    },
  })

  useEffect(() => {
    if (isYouTube) {
      return
    }

    const videoElement = videoRef.current
    if (!videoElement) {
      return
    }

    videoElement.currentTime = data.currentTime || 0
    videoElement.volume = data.volume ?? 1
    videoElement.muted = (data.volume ?? 1) === 0

    if (data.isPlaying) {
      videoElement.play().catch(() => {
        onStateUpdate({ isPlaying: false })
      })
    } else {
      videoElement.pause()
    }
  }, [data.currentTime, data.isPlaying, data.videoId, data.volume, isYouTube, onStateUpdate])

  useEffect(() => {
    if (!isYouTube || !youtubePlayerRef.current || !data.isPlaying) {
      return
    }

    const interval = setInterval(() => {
      const currentTime = youtubePlayerRef.current?.getCurrentTime?.() || 0
      onStateUpdate({ currentTime })
    }, 500)

    return () => clearInterval(interval)
  }, [data.isPlaying, isYouTube, onStateUpdate])

  const handlePlayPause = (event) => {
    event.stopPropagation()

    if (isYouTube) {
      if (data.isPlaying) {
        youtubePlayerRef.current?.pauseVideo?.()
        onStateUpdate({ isPlaying: false })
      } else {
        youtubePlayerRef.current?.playVideo?.()
        onStateUpdate({ isPlaying: true })
      }
      return
    }

    const videoElement = videoRef.current
    if (!videoElement) {
      return
    }

    if (videoElement.paused) {
      videoElement.play()
      onStateUpdate({ isPlaying: true })
    } else {
      videoElement.pause()
      onStateUpdate({ isPlaying: false })
    }
  }

  const handleClose = (event) => {
    event.stopPropagation()

    if (isYouTube) {
      youtubePlayerRef.current?.pauseVideo?.()
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.pause()
    }

    onStateUpdate({ isPlaying: false })
    onClose()
  }

  return (
    <Box
      {...gestureHandlers}
      onClick={onRestore}
      role="button"
      aria-label="Restore mini player"
      sx={{
        position: 'fixed',
        left: '50%',
        right: 'auto',
        bottom: { xs: 12, sm: 16, md: 20 },
        width: { xs: '92%', sm: 420, md: 440 },
        maxWidth: { xs: '92%', sm: 420, md: 440 },
        height: { xs: 82, sm: 88 },
        bgcolor: 'rgba(26,26,26,0.95)',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow: 12,
        borderRadius: 3,
        backdropFilter: 'blur(12px)',
        zIndex: 1400,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: isDraggingUp ? 'translate(-50%, -4px)' : 'translate(-50%, 0)',
        transition: isDraggingUp ? 'none' : 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
        animation: 'miniSlideIn 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        '@keyframes miniSlideIn': {
          from: { opacity: 0, transform: 'translate(-50%, 28px)' },
          to: { opacity: 1, transform: 'translate(-50%, 0)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 6,
          transform: 'translateX(-50%)',
          width: 36,
          height: 4,
          borderRadius: 99,
          bgcolor: 'rgba(255,255,255,0.32)',
        }}
      />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%', px: 1.2, pt: { xs: 1.2, sm: 1 } }}>
        <Box
          sx={{
            height: '100%',
            width: { xs: 118, sm: 132 },
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#000',
            flexShrink: 0,
          }}
        >
          {isYouTube ? (
            <YouTubePlayer
              videoId={youtubeVideoId}
              isPlaying={data.isPlaying}
              onReady={(event) => {
                youtubePlayerRef.current = event.target
                const startTime = data.currentTime || 0
                if (startTime > 0) {
                  event.target.seekTo?.(startTime, true)
                }
                if (data.isPlaying) {
                  event.target.playVideo?.()
                }
              }}
              onStateChange={(event) => {
                const playerState = event.data
                const isPlayingNow = playerState === 1 || playerState === 3
                onStateUpdate({
                  isPlaying: isPlayingNow,
                  currentTime: event.target?.getCurrentTime?.() || data.currentTime,
                })
              }}
            />
          ) : (
            <Box
              component="video"
              ref={videoRef}
              src={data.videoUrl}
              poster={data.thumbnail}
              playsInline
              onTimeUpdate={(event) => onStateUpdate({ currentTime: event.currentTarget.currentTime })}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                backgroundColor: '#000',
              }}
            />
          )}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '0.88rem', sm: '0.92rem' },
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'block' } }}>
            Swipe up to restore
          </Typography>
        </Box>

        <IconButton aria-label={data.isPlaying ? 'Pause mini player video' : 'Play mini player video'} onClick={handlePlayPause} sx={{ width: 44, height: 44, transition: 'transform 140ms ease', '&:active': { transform: 'scale(0.93)' } }}>
          {data.isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>

        <IconButton aria-label="Close mini player" onClick={handleClose} sx={{ width: 44, height: 44, transition: 'transform 140ms ease', '&:active': { transform: 'scale(0.93)' } }}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default MiniPlayer