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
import PictureInPictureAltRoundedIcon from '@mui/icons-material/PictureInPictureAltRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import { formatDuration } from '../utils/helpers'

function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  bufferedPercent,
  bufferedPercentage,
  volume = 1,
  isFullscreen,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onSeek,
  onVolumeChange,
  isPiPAvailable = false,
  isInPiP = false,
  onTogglePiP,
  onToggleFullscreen,
  onFullscreenToggle,
  showControls = true,
  docked = false,
}) {
  const [hoverTime, setHoverTime] = useState(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const effectiveBufferedPercent = bufferedPercentage ?? bufferedPercent ?? 0
  const handleFullscreenToggle = onToggleFullscreen ?? onFullscreenToggle

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
        position: docked ? 'relative' : 'absolute',
        left: docked ? 'auto' : 0,
        right: docked ? 'auto' : 0,
        bottom: docked ? 'auto' : 0,
        mt: docked ? 1 : 0,
        px: docked ? { xs: 0, sm: 0 } : { xs: 0.6, sm: 1.5 },
        pb: docked ? 0 : { xs: 0.6, sm: 1.3 },
        background: docked ? 'transparent' : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 62%)',
        opacity: showControls ? 1 : 0,
        transform: showControls ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: showControls ? 'auto' : 'none',
        transition: 'opacity 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        sx={{
          px: docked ? { xs: 0.6, sm: 1.25 } : { xs: 0.6, sm: 1.25 },
          py: docked ? { xs: 0.6, sm: 0.75 } : { xs: 0.55, sm: 0.9 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: docked ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.12)',
          bgcolor: docked ? 'rgba(15, 15, 15, 0.7)' : 'rgba(15, 15, 15, 0.46)',
          backdropFilter: docked ? 'blur(10px)' : 'blur(8px)',
        }}
      >
      <Box
        onMouseMove={handleProgressHover}
        onMouseLeave={() => setHoverTime(null)}
        sx={{ position: 'relative', mb: { xs: 0.7, sm: 0.8 } }}
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
            height: { xs: 3, sm: 5 },
            transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              height: { xs: 8, sm: 8 },
            },
            '& .MuiSlider-thumb': {
              width: { xs: 12, sm: 16 },
              height: { xs: 12, sm: 16 },
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
            width: `${effectiveBufferedPercent}%`,
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

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={{ xs: 0.6, sm: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.2, sm: 0.35 }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Tooltip title="Replay 10 seconds">
            <IconButton aria-label="Skip backward 10 seconds" onClick={onSkipBackward} sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              <Replay10RoundedIcon sx={{ fontSize: { xs: 20, sm: 26 } }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <IconButton aria-label={isPlaying ? 'Pause video' : 'Play video'} onClick={onPlayPause} sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              {isPlaying ? <PauseRoundedIcon sx={{ fontSize: { xs: 20, sm: 26 } }} /> : <PlayArrowRoundedIcon sx={{ fontSize: { xs: 20, sm: 26 } }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Forward 10 seconds">
            <IconButton aria-label="Skip forward 10 seconds" onClick={onSkipForward} sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              <Forward10RoundedIcon sx={{ fontSize: { xs: 20, sm: 26 } }} />
            </IconButton>
          </Tooltip>

          <Typography variant="subtitle2" sx={{ ml: { xs: 0.35, sm: 0.8 }, color: 'common.white', minWidth: { xs: 72, sm: 96 }, fontSize: { xs: '0.62rem', sm: '0.75rem' }, fontFamily: 'Roboto Mono, monospace', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.2, sm: 0.5 }}
          sx={{ minWidth: { xs: 42, sm: 172 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
        >
          <Box onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)} sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={volume === 0 ? 'Unmute' : 'Volume'}>
              <IconButton aria-label={volume === 0 ? 'Unmute volume' : 'Adjust volume'} onClick={() => onVolumeChange(volume === 0 ? 0.6 : 0)} sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
                {volume === 0 ? <VolumeOffRoundedIcon sx={{ fontSize: { xs: 19, sm: 25 } }} /> : <VolumeUpRoundedIcon sx={{ fontSize: { xs: 19, sm: 25 } }} />}
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
                sx={{ color: 'common.white', py: 0 }}
              />
            </Box>
          </Box>

          <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <IconButton aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={handleFullscreenToggle} sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}>
              {isFullscreen ? <FullscreenExitRoundedIcon sx={{ fontSize: { xs: 19, sm: 25 } }} /> : <FullscreenRoundedIcon sx={{ fontSize: { xs: 19, sm: 25 } }} />}
            </IconButton>
          </Tooltip>

          {isPiPAvailable && (
            <Tooltip title={isInPiP ? 'Exit Picture-in-Picture' : 'Picture-in-Picture'}>
              <IconButton
                aria-label={isInPiP ? 'Exit picture in picture' : 'Enter picture in picture'}
                onClick={onTogglePiP}
                sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, color: isInPiP ? 'primary.main' : 'common.white', transition: 'opacity 200ms ease, transform 140ms ease', '&:hover': { opacity: 0.85 }, '&:active': { transform: 'scale(0.94)' } }}
              >
                <PictureInPictureAltRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
      </Box>
    </Box>
  )
}

export default PlayerControls
