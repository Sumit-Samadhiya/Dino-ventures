import { useMemo, useState } from 'react'
import {
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import { formatDuration } from '../utils/helpers'

function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isFullscreen,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onSeek,
  onVolumeChange,
  onToggleFullscreen,
}) {
  const [hoverTime, setHoverTime] = useState(null)

  const progressPercent = useMemo(() => {
    if (!duration) {
      return 0
    }
    return Math.min((currentTime / duration) * 100, 100)
  }, [currentTime, duration])

  const handleProgressHover = (event) => {
    if (!duration) {
      setHoverTime(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    setHoverTime({
      time: ratio * duration,
      leftPercent: ratio * 100,
    })
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        p: { xs: 1.25, sm: 1.5 },
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.76) 65%)',
      }}
    >
      <Box
        onMouseMove={handleProgressHover}
        onMouseLeave={() => setHoverTime(null)}
        sx={{ position: 'relative', mb: 0.6 }}
      >
        {hoverTime && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: `calc(${hoverTime.leftPercent}% - 16px)`,
              fontSize: '0.72rem',
              px: 0.6,
              py: 0.2,
              borderRadius: 0.8,
              bgcolor: 'rgba(0, 0, 0, 0.78)',
              color: 'common.white',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDuration(hoverTime.time)}
          </Typography>
        )}

        <Slider
          aria-label="Video progress"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(_, value) => onSeek(Number(value))}
          sx={{
            color: 'primary.main',
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: `${progressPercent}%`,
            height: 2,
            bgcolor: 'primary.light',
            pointerEvents: 'none',
          }}
        />
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <IconButton aria-label="Skip backward" onClick={onSkipBackward} sx={{ width: 44, height: 44 }}>
            <Replay10RoundedIcon />
          </IconButton>

          <IconButton aria-label="Play pause" onClick={onPlayPause} sx={{ width: 44, height: 44 }}>
            {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>

          <IconButton aria-label="Skip forward" onClick={onSkipForward} sx={{ width: 44, height: 44 }}>
            <Forward10RoundedIcon />
          </IconButton>

          <Typography variant="subtitle2" sx={{ ml: 0.8, color: 'common.white', minWidth: 90 }}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: { xs: 110, sm: 170 } }}>
          {volume === 0 ? <VolumeOffRoundedIcon fontSize="small" /> : <VolumeUpRoundedIcon fontSize="small" />}
          <Slider
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(_, value) => onVolumeChange(Number(value))}
            sx={{ maxWidth: { xs: 60, sm: 100 } }}
          />
          <IconButton aria-label="Fullscreen" onClick={onToggleFullscreen} sx={{ width: 44, height: 44 }}>
            {isFullscreen ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PlayerControls
