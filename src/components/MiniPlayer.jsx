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
      sx={{
        position: 'fixed',
        left: { xs: 8, sm: 16, md: 24 },
        right: { xs: 8, sm: 16, md: 24 },
        bottom: { xs: 8, sm: 12, md: 16 },
        height: { xs: 80, sm: 88, md: 92 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 8,
        borderRadius: 2,
        zIndex: 1400,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: 'translateY(0)',
        animation: 'miniSlideIn 220ms ease-out',
        '@keyframes miniSlideIn': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%', px: 1 }}>
        <Box
          component="video"
          ref={videoRef}
          src={data.videoUrl}
          poster={data.thumbnail}
          playsInline
          onTimeUpdate={(event) => onStateUpdate({ currentTime: event.currentTarget.currentTime })}
          sx={{
            height: '100%',
            width: { xs: 128, sm: 150, md: 165 },
            borderRadius: 1,
            objectFit: 'cover',
            backgroundColor: 'black',
            flexShrink: 0,
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '0.86rem', sm: '0.94rem' },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Swipe up to restore
          </Typography>
        </Box>

        <IconButton onClick={handlePlayPause} sx={{ width: 44, height: 44 }}>
          {data.isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>

        <IconButton onClick={handleClose} sx={{ width: 44, height: 44 }}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default MiniPlayer