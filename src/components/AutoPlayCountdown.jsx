import { memo, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'

function AutoPlayCountdown({ nextVideo, secondsLeft, durationSeconds = 2, onCancel }) {
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    cancelButtonRef.current?.focus()
  }, [nextVideo?.id])

  const progressValue = ((durationSeconds - secondsLeft) / durationSeconds) * 100

  return (
    <Box
      role="dialog"
      aria-live="polite"
      aria-label="Autoplay countdown"
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '92%', sm: 360 },
        bgcolor: 'rgba(10, 14, 24, 0.9)',
        backdropFilter: 'blur(6px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: 2,
        py: 1.6,
        boxShadow: 10,
        animation: 'countdownFadeIn 220ms ease-out',
        '@keyframes countdownFadeIn': {
          from: { opacity: 0, transform: 'translate(-50%, -46%)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%)' },
        },
      }}
    >
      <Stack direction="row" spacing={1.3}>
        <Box
          component="img"
          src={nextVideo.thumbnail}
          alt={nextVideo.title}
          loading="lazy"
          width={112}
          height={63}
          sx={{
            borderRadius: 1,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.4 }}>
            Playing next in {Math.ceil(secondsLeft)} seconds...
          </Typography>
          <Typography
            sx={{
              fontSize: '0.95rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {nextVideo.title}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="space-between" sx={{ mt: 1.2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress variant="determinate" value={progressValue} size={26} thickness={5} />
          <Typography variant="caption" color="text.secondary">
            Auto-play next video
          </Typography>
        </Stack>

        <Button
          ref={cancelButtonRef}
          variant="outlined"
          size="small"
          onClick={onCancel}
          aria-label="Cancel auto play"
          sx={{
            transition: 'transform 150ms ease',
            '&:active': { transform: 'scale(0.97)' },
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  )
}

export default memo(AutoPlayCountdown)
