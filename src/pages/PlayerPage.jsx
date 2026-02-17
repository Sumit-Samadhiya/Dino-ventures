import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { videos } from '../data/videos'
import { formatDuration } from '../utils/helpers'

function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const video = useMemo(() => videos.find((item) => item.id === id), [id])

  if (!video) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant="h6">Video not found.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Home
      </Button>

      <Box
        component="video"
        controls
        src={video.videoUrl}
        poster={video.thumbnail}
        sx={{
          width: '100%',
          borderRadius: 2,
          backgroundColor: '#000',
          mb: 2,
          maxHeight: { xs: 240, sm: 420, md: 540 },
        }}
      />

      <Typography
        variant="h5"
        sx={(theme) => ({
          ...theme.typography.videoTitle,
          fontSize: { xs: '1.1rem', sm: '1.35rem' },
          mb: 1,
        })}
      >
        {video.title}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Chip color="primary" label={video.category} />
        <Chip variant="outlined" label={formatDuration(video.duration)} />
      </Stack>
    </Box>
  )
}

export default PlayerPage
