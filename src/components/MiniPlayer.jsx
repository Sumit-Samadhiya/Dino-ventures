import { useEffect, useRef } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import useGestures from '../hooks/useGestures'

function MiniPlayer({ data, onClose, onRestore, onStateUpdate }) {
  const videoRef = useRef(null)

  const gestureHandlers = useGestures({
    onSwipeUp: onRestore,
    onDragEnd: ({ distanceY }) => {
      if (distanceY < -90) {
        onRestore()
      }
    },
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.currentTime = data.currentTime || 0
    video.volume = data.volume ?? 1
    video.muted = (data.volume ?? 1) === 0

    if (data.isPlaying) {
      video.play().catch(() => {
        onStateUpdate({ isPlaying: false })
      })
    } else {
      video.pause()
    }
  }, [data.currentTime, data.isPlaying, data.videoId, data.volume, onStateUpdate])

  const handlePlayPause = (event) => {
    event.stopPropagation()

    const video = videoRef.current
    if (!video) {
      return
    }

    if (video.paused) {
      video.play()
      onStateUpdate({ isPlaying: true })
    } else {
      video.pause()
      onStateUpdate({ isPlaying: false })
    }
  }

  const handleClose = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    if (video) {
      video.pause()
    }
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
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 20 },
        bottom: { xs: 8, sm: 12, md: 16 },
        width: { xs: '100%', md: 400 },
        maxWidth: { xs: '100%', md: 400 },
        height: { xs: 72, md: 78 },
        bgcolor: 'rgba(31,31,31,0.9)',
        borderTop: '1px solid',
        borderColor: 'divider',
        boxShadow: 8,
        borderRadius: { xs: 0, md: 2 },
        backdropFilter: 'blur(10px)',
        zIndex: 1400,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: 'translateY(0)',
        animation: 'miniSlideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        '@keyframes miniSlideIn': {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ position: 'absolute', left: '50%', top: 4, transform: 'translateX(-50%)', width: 34, height: 4, borderRadius: 99, bgcolor: 'rgba(255,255,255,0.35)' }} />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%', px: 1, pt: { xs: 1, md: 0.7 } }}>
        <Box
          component="video"
          ref={videoRef}
          src={data.videoUrl}
          poster={data.thumbnail}
          playsInline
          onTimeUpdate={(event) => onStateUpdate({ currentTime: event.currentTarget.currentTime })}
          sx={{
            height: '100%',
            width: { xs: 108, md: 120 },
            borderRadius: 1,
            objectFit: 'cover',
            backgroundColor: 'black',
            flexShrink: 0,
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '0.82rem', md: '0.88rem' },
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
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