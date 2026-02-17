import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import VideoPlayer from '../components/VideoPlayer'
import VideoList from '../components/VideoList'
import { videos } from '../data/videos'
import { formatDuration } from '../utils/helpers'
import useVideoPlayer from '../hooks/useVideoPlayer'
import useGestures from '../hooks/useGestures'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const playerState = useVideoPlayer(videoRef)
  const [currentVideoId, setCurrentVideoId] = useState(id)
  const [isVideoListOpen, setIsVideoListOpen] = useState(false)

  useEffect(() => {
    setCurrentVideoId(id)
  }, [id])

  const video = useMemo(() => videos.find((item) => item.id === currentVideoId), [currentVideoId])

  const categoryVideos = useMemo(() => {
    if (!video) {
      return []
    }

    return videos.filter((item) => item.category === video.category)
  }, [video])

  const gestureHandlers = useGestures({
    onSwipeUp: () => setIsVideoListOpen(true),
    onSwipeDown: () => setIsVideoListOpen(false),
    onScrollDown: () => setIsVideoListOpen(true),
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      playerState.play()
    }, 0)

    return () => clearTimeout(timer)
  }, [currentVideoId, playerState.play])

  const handleSwitchVideo = (nextVideoId) => {
    if (nextVideoId === currentVideoId) {
      setIsVideoListOpen(false)
      return
    }

    setCurrentVideoId(nextVideoId)
    navigate(`/player/${nextVideoId}`)
    setIsVideoListOpen(false)
  }

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

      <Box {...gestureHandlers} sx={{ touchAction: 'pan-y' }}>
        <VideoPlayer video={video} player={{ ...playerState, videoRef }} />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.8, display: 'inline-block' }}>
        Swipe up or scroll down to open videos in this category
      </Typography>

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

      <VideoList
        open={isVideoListOpen}
        onClose={() => setIsVideoListOpen(false)}
        videos={categoryVideos}
        currentVideoId={video.id}
        category={video.category}
        onSelectVideo={handleSwitchVideo}
      />
    </Box>
  )
}

export default Player