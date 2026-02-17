import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import VideoPlayer from '../components/VideoPlayer'
import { videos } from '../data/videos'
import { formatDuration } from '../utils/helpers'
import useVideoPlayer from '../hooks/useVideoPlayer'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const playerState = useVideoPlayer(videoRef)

  const video = useMemo(() => videos.find((item) => item.id === id), [id])

  useEffect(() => {
    playerState.play()
  }, [id])

  if (!video) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2.5, sm: 4 } }}>
      <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/')} sx={{ mb: 1.5 }}>
        Back to Home
      </Button>

      <VideoPlayer video={video} player={{ ...playerState, videoRef }} />

      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="h5"
          sx={(theme) => ({
            ...theme.typography.videoTitle,
            fontSize: { xs: '1.05rem', sm: '1.25rem' },
            mb: 1,
          })}
        >
          {video.title}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip color="primary" label={video.category} />
          <Chip variant="outlined" label={formatDuration(video.duration)} />
        </Stack>
      </Box>
    </Box>
  )
}

export default Player