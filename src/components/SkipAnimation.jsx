import { memo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import { scalePulse } from '../styles/animations'

function SkipAnimation({ type }) {
  const isForward = type === 'forward'

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        animation: `${scalePulse} 560ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'transform, opacity',
        zIndex: 4,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: { xs: 120, sm: 140 },
          height: { xs: 120, sm: 140 },
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0) 75%)',
          filter: 'blur(1px)',
          animation: 'skipRing 560ms ease-out',
          '@keyframes skipRing': {
            from: { opacity: 0.95, transform: 'translate(-50%, -50%) scale(0.72)' },
            to: { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' },
          },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={0.8}>
        {isForward ? <Forward10RoundedIcon sx={{ fontSize: 44, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.45))' }} /> : <Replay10RoundedIcon sx={{ fontSize: 44, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.45))' }} />}
        <Typography sx={{ fontSize: { xs: '2rem', sm: '2.4rem' }, fontWeight: 700, color: '#FFFFFF' }}>
          {isForward ? '+10' : '-10'}
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            opacity: 0.7,
            transform: isForward ? 'translateX(0)' : 'translateX(0)',
            animation: isForward ? 'skipTrailRight 560ms ease-out' : 'skipTrailLeft 560ms ease-out',
            '@keyframes skipTrailRight': {
              from: { opacity: 0, transform: 'translateX(-8px)' },
              to: { opacity: 0.75, transform: 'translateX(6px)' },
            },
            '@keyframes skipTrailLeft': {
              from: { opacity: 0, transform: 'translateX(8px)' },
              to: { opacity: 0.75, transform: 'translateX(-6px)' },
            },
          }}
        >
          {isForward ? <Forward10RoundedIcon sx={{ fontSize: 30 }} /> : <Replay10RoundedIcon sx={{ fontSize: 30 }} />}
        </Box>
      </Stack>
    </Box>
  )
}

export default memo(SkipAnimation)
