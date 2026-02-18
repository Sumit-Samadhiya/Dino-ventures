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
  const [forceAutoPlayToken, setForceAutoPlayToken] = useState(0)
  const [playerHasEnded, setPlayerHasEnded] = useState(false)
  const [dragOffsetY, setDragOffsetY] = useState(0)
  const [isDraggingDown, setIsDraggingDown] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    if (id) {
      // Decode URL parameter in case it's encoded
      const decodedId = decodeURIComponent(id)
      setCurrentVideoId(decodedId)
      console.log('Player: URL ID:', id, 'Decoded ID:', decodedId)
    }
  }, [id])

  const video = useMemo(() => {
    const foundVideo = videos.find((item) => item.id === currentVideoId)
    if (!foundVideo) {
      console.warn('Video not found for ID:', currentVideoId)
      console.log('Available videos:', videos.map(v => ({ id: v.id, title: v.title })))
    }
    return foundVideo
  }, [currentVideoId])

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

  useEffect(() => {
    if (video?.mediaType === 'YOUTUBE') {
      return
    }

    setPlayerHasEnded(playerState.hasEnded)
  }, [playerState.hasEnded, video?.mediaType])

  useEffect(() => {
    setPlayerHasEnded(false)
  }, [currentVideoId])

  const autoPlayState = useAutoPlay({
    enabled: playerHasEnded && Boolean(nextVideo),
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
          mediaType: video.mediaType,
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

    setForceAutoPlayToken((previous) => previous + 1)
    setPlayerHasEnded(false)
    setCurrentVideoId(nextVideoId)

    const targetPath = `/player/${encodeURIComponent(nextVideoId)}`
    const startViewTransition = document.startViewTransition?.bind(document)
    if (startViewTransition) {
      startViewTransition(() => {
        navigate(targetPath)
      })
    } else {
      navigate(targetPath)
    }

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
  const dragScale = 1 - Math.min(dragOffsetY / 900, 0.12)

  const handleBackToHome = () => {
    const currentElement = videoRef.current
    onMinimizePlayer({
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      mediaType: video.mediaType,
      currentTime: currentElement?.currentTime ?? playerState.currentTime,
      isPlaying: currentElement ? !currentElement.paused : playerState.isPlaying,
      volume: currentElement?.volume ?? playerState.volume,
    })
    navigate('/')
  }

  return (
    <Box sx={{ px: { xs: 1.5, sm: 3, md: 4 }, pb: { xs: 2.5, sm: 4 } }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={handleBackToHome}
        sx={{ mb: 1.5, width: { xs: '100%', sm: 'auto' } }}
      >
        Back to Home
      </Button>

      <Box
        {...gestureHandlers}
        sx={{
          touchAction: 'pan-y',
          transform: `translateY(${dragOffsetY}px) scale(${dragScale})`,
          transformOrigin: 'top center',
          transition: isDraggingDown ? 'none' : 'transform 220ms ease',
          willChange: 'transform',
          position: 'relative',
          opacity: 1 - Math.min(dragOffsetY / 1200, 0.15),
          borderRadius: 2,
          boxShadow: dragProgress > 0 ? 12 : 0,
          backgroundColor: dragProgress > 0 ? 'rgba(15,15,15,0.65)' : 'transparent',
          backdropFilter: dragProgress > 0 ? 'blur(6px)' : 'none',
        }}
      >
        <Box
          sx={{
            width: { xs: 36, sm: 46 },
            height: 4,
            borderRadius: 99,
            bgcolor: 'text.secondary',
            opacity: 0.55,
            mx: 'auto',
            mb: { xs: 0.5, sm: 0.8 },
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center', mb: 1 }}
        >
          Drag down to minimize
        </Typography>

        <Box sx={{ viewTransitionName: `video-thumb-${video.id}` }}>
          <VideoPlayer
            video={video}
            player={{ ...playerState, videoRef }}
            autoPlayToken={forceAutoPlayToken}
            onEndedChange={setPlayerHasEnded}
          />
        </Box>

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
            viewTransitionName: `video-title-${video.id}`,
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