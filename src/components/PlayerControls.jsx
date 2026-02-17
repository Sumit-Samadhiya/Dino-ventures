import { useMemo, useState } from 'react'
import {
  Box,
  IconButton,
  Slider,
  Stack,
  Tooltip,
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
  bufferedPercent,
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

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
        p: { xs: 1.5, sm: 1.75 },
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.86) 72%)',
      }}
    >
      <Box
        onMouseMove={handleProgressHover}
        onMouseLeave={() => setHoverTime(null)}
        sx={{ position: 'relative', mb: 0.8 }}
      >
        {hoverTime && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: `calc(${hoverTime.leftPercent}% - 22px)`,
              fontSize: '0.72rem',
              px: 0.8,
              py: 0.3,
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
          onChangeCommitted={(_, value) => onSeek(Number(value))}
          sx={{
            color: 'primary.main',
            height: { xs: 4, sm: 5 },
            transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              height: { xs: 8, sm: 8 },
            },
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              opacity: hoverTime ? 1 : 0,
              transition: 'opacity 180ms ease',
            },
            '&:hover .MuiSlider-thumb': { opacity: 1 },
            '& .MuiSlider-rail': { opacity: 0.32 },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 1,
            width: `${bufferedPercent || 0}%`,
            height: 3,
            bgcolor: 'rgba(255, 255, 255, 0.35)',
            pointerEvents: 'none',
            borderRadius: 2,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 1,
            width: `${progressPercent}%`,
            height: 3,
            bgcolor: 'primary.main',
            pointerEvents: 'none',
            borderRadius: 2,
            transition: 'width 120ms linear',
          }}
        />
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
        <Stack direction="row" alignItems="center" spacing={0.35}>
          <Tooltip title="Replay 10 seconds">
            <IconButton aria-label="Skip backward 10 seconds" onClick={onSkipBackward} sx={{ width: 48, height: 48, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              <Replay10RoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <IconButton aria-label={isPlaying ? 'Pause video' : 'Play video'} onClick={onPlayPause} sx={{ width: 48, height: 48, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              {isPlaying ? <PauseRoundedIcon sx={{ fontSize: 28 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Forward 10 seconds">
            <IconButton aria-label="Skip forward 10 seconds" onClick={onSkipForward} sx={{ width: 48, height: 48, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              <Forward10RoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>

          <Typography variant="subtitle2" sx={{ ml: 0.9, color: 'common.white', minWidth: 96, fontSize: '0.75rem', fontFamily: 'Roboto Mono, monospace', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: { xs: 48, sm: 180 } }}>
          <Box onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)} sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={volume === 0 ? 'Unmute' : 'Volume'}>
              <IconButton aria-label={volume === 0 ? 'Unmute volume' : 'Adjust volume'} onClick={() => onVolumeChange(volume === 0 ? 0.6 : 0)} sx={{ width: 48, height: 48, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
                {volume === 0 ? <VolumeOffRoundedIcon sx={{ fontSize: 28 }} /> : <VolumeUpRoundedIcon sx={{ fontSize: 28 }} />}
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                width: { xs: 0, sm: showVolumeSlider ? 96 : 0 },
                opacity: { xs: 0, sm: showVolumeSlider ? 1 : 0 },
                overflow: 'hidden',
                transition: 'width 200ms cubic-bezier(0.4,0,0.2,1), opacity 200ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <Slider
                aria-label="Volume"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(_, value) => onVolumeChange(Number(value))}
                sx={{ color: 'common.white' }}
              />
            </Box>
          </Box>

          <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <IconButton aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={onToggleFullscreen} sx={{ width: 48, height: 48, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              {isFullscreen ? <FullscreenExitRoundedIcon sx={{ fontSize: 28 }} /> : <FullscreenRoundedIcon sx={{ fontSize: 28 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PlayerControls
