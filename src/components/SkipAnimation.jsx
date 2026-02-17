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
        animation: `${scalePulse} 500ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'transform, opacity',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.8}>
        {isForward ? <Forward10RoundedIcon sx={{ fontSize: 44 }} /> : <Replay10RoundedIcon sx={{ fontSize: 44 }} />}
        <Typography sx={{ fontSize: { xs: '2rem', sm: '2.4rem' }, fontWeight: 700, color: '#FFFFFF' }}>
          {isForward ? '+10' : '-10'}
        </Typography>
      </Stack>
    </Box>
  )
}

export default memo(SkipAnimation)
