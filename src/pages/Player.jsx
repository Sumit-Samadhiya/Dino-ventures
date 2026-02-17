import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Alert, Box, Button, Chip, Snackbar, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import VideoPlayer from '../components/VideoPlayer'
import VideoList from '../components/VideoList'
import AutoPlayCountdown from '../components/AutoPlayCountdown'
import { videos } from '../data/videos'
import { formatDuration } from '../utils/helpers'
import useVideoPlayer from '../hooks/useVideoPlayer'
import useGestures from '../hooks/useGestures'
import useAutoPlay from '../hooks/useAutoPlay'

function Player({ onMinimizePlayer, onCloseMiniPlayer }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const playerState = useVideoPlayer(videoRef)
  const [currentVideoId, setCurrentVideoId] = useState(id)
  const [isVideoListOpen, setIsVideoListOpen] = useState(false)
  const [dragOffsetY, setDragOffsetY] = useState(0)
  const [isDraggingDown, setIsDraggingDown] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' })

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

  const nextVideo = useMemo(() => {
    if (!video || !categoryVideos.length) {
      return null
    }

    const currentIndex = categoryVideos.findIndex((item) => item.id === video.id)
    if (currentIndex === -1) {
      return categoryVideos[0]
    }

    const nextIndex = (currentIndex + 1) % categoryVideos.length
    return categoryVideos[nextIndex]
  }, [categoryVideos, video])

  useEffect(() => {
    onCloseMiniPlayer()
  }, [currentVideoId, onCloseMiniPlayer])

  const autoPlayState = useAutoPlay({
    enabled: playerState.hasEnded && Boolean(nextVideo),
    nextVideo,
    onAutoPlay: (upNextVideo) => {
      if (upNextVideo) {
        handleSwitchVideo(upNextVideo.id)
      }
    },
    durationSeconds: 2,
  })

  const gestureHandlers = useGestures({
    onSwipeUp: () => setIsVideoListOpen(true),
    onSwipeDown: () => setIsVideoListOpen(false),
    onScrollDown: () => setIsVideoListOpen(true),
    onDragStart: () => {
      setIsDraggingDown(true)
    },
    onDragMove: ({ distanceY }) => {
      const pullDistance = Math.max(distanceY, 0)
      setDragOffsetY(Math.min(pullDistance, 220))
    },
    onDragEnd: ({ distanceY }) => {
      setIsDraggingDown(false)

      if (distanceY > 150 && video) {
        const currentElement = videoRef.current
        onMinimizePlayer({
          videoId: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          videoUrl: video.videoUrl,
          currentTime: currentElement?.currentTime ?? playerState.currentTime,
          isPlaying: currentElement ? !currentElement.paused : playerState.isPlaying,
          volume: currentElement?.volume ?? playerState.volume,
        })
        setDragOffsetY(0)
        navigate('/')
        return
      }

      setDragOffsetY(0)
    },
  })

  useEffect(() => {
    const miniPayload = location.state?.miniPlayerData

    const timer = setTimeout(async () => {
      const currentElement = videoRef.current

      if (miniPayload && miniPayload.videoId === currentVideoId && currentElement) {
        currentElement.currentTime = miniPayload.currentTime || 0
        currentElement.volume = miniPayload.volume ?? 1
        currentElement.muted = (miniPayload.volume ?? 1) === 0

        if (miniPayload.isPlaying) {
          await playerState.play()
        } else {
          playerState.pause()
        }
      } else {
        await playerState.play()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [currentVideoId, location.state, playerState.pause, playerState.play])

  const handleSwitchVideo = (nextVideoId) => {
    if (nextVideoId === currentVideoId) {
      setIsVideoListOpen(false)
      return
    }

    setCurrentVideoId(nextVideoId)
    navigate(`/player/${nextVideoId}`)
    setIsVideoListOpen(false)
    setToast({ open: true, message: 'Switched to next video', severity: 'success' })
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

  const dragProgress = Math.min(dragOffsetY / 150, 1)

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2.5, sm: 4 } }}>
      <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/')} sx={{ mb: 1.5 }}>
        Back to Home
      </Button>

      <Box
        {...gestureHandlers}
        sx={{
          touchAction: 'pan-y',
          transform: `translateY(${dragOffsetY}px)`,
          transition: isDraggingDown ? 'none' : 'transform 220ms ease',
          willChange: 'transform',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 4,
            borderRadius: 99,
            bgcolor: 'text.secondary',
            opacity: 0.6,
            mx: 'auto',
            mb: 0.8,
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
          Drag down to minimize
        </Typography>

        <VideoPlayer video={video} player={{ ...playerState, videoRef }} />

        {autoPlayState.isVisible && nextVideo && (
          <AutoPlayCountdown
            nextVideo={nextVideo}
            secondsLeft={autoPlayState.secondsLeft}
            onCancel={() => {
              autoPlayState.cancel()
              setToast({ open: true, message: 'Autoplay canceled', severity: 'info' })
            }}
          />
        )}

        {dragOffsetY > 0 && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.main',
              pointerEvents: 'none',
              opacity: dragProgress,
              transition: 'opacity 120ms linear',
            }}
          />
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.8, display: 'inline-block' }}>
        Swipe up or scroll down to open videos in this category
      </Typography>

      {(playerState.isBuffering || playerState.error) && (
        <Typography role="status" aria-live="polite" variant="caption" color={playerState.error ? 'error.main' : 'text.secondary'} sx={{ ml: 1, display: 'inline-block' }}>
          {playerState.error || 'Buffering video...'}
        </Typography>
      )}

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

      <Snackbar
        open={toast.open}
        autoHideDuration={1800}
        onClose={() => setToast((previous) => ({ ...previous, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert variant="filled" severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Player