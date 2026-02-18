import { memo, useRef, useState } from 'react'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SmartDisplayRoundedIcon from '@mui/icons-material/SmartDisplayRounded'
import { useNavigate } from 'react-router-dom'
import LazyImage from './LazyImage'
import { formatDuration } from '../utils/helpers'
import { categoryColors } from '../styles/theme'

const categoryColorMap = {
  Technology: 'info',
  Gaming: 'success',
  Music: 'secondary',
  Education: 'warning',
  Entertainment: 'primary',
}

function VideoCard({ video }) {
  const navigate = useNavigate()
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const previewRef = useRef(null)
  const canPreview = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && video.mediaType !== 'YOUTUBE'

  const handlePreviewStart = async () => {
    if (!canPreview || !previewRef.current) {
      return
    }

    setIsPreviewVisible(true)
    try {
      previewRef.current.currentTime = 0
      await previewRef.current.play()
    } catch {
      setIsPreviewVisible(false)
    }
  }

  const handlePreviewStop = () => {
    if (!previewRef.current) {
      return
    }

    previewRef.current.pause()
    setIsPreviewVisible(false)
  }

  const handleOpenVideo = () => {
    const targetPath = `/player/${video.id}`
    const startViewTransition = document.startViewTransition?.bind(document)

    if (startViewTransition) {
      startViewTransition(() => {
        navigate(targetPath)
      })
      return
    }

    navigate(targetPath)
  }

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        '&:hover': {
          transform: 'translateY(-3px) scale(1.01)',
          boxShadow: 10,
          filter: 'brightness(1.04)',
        },
      }}
    >
      <CardActionArea
        onClick={handleOpenVideo}
        aria-label={`Open video ${video.title}`}
        onMouseEnter={handlePreviewStart}
        onMouseLeave={handlePreviewStop}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              borderRadius: 1,
              viewTransitionName: `video-thumb-${video.id}`,
              transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.02)',
              },
            }}
          />

          <Box
            component="video"
            ref={previewRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isPreviewVisible ? 1 : 0,
              transition: 'opacity 220ms cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
              px: 0.8,
              py: 0.35,
              borderRadius: 1,
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 0.2,
              background: categoryColors[video.category]?.gradient ?? 'linear-gradient(135deg, #606060, #3F3F3F)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.35,
              transition: 'transform 180ms cubic-bezier(0.4,0,0.2,1)',
              '.MuiCard-root:hover &': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            <SmartDisplayRoundedIcon sx={{ fontSize: 12 }} />
            {video.category}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              bgcolor: 'rgba(0, 0, 0, 0.72)',
              color: 'common.white',
              px: 0.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.74rem',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {formatDuration(video.duration)}
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 1.1, sm: 1.5 } }}>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              ...theme.typography.videoTitle,
              mb: { xs: 0.8, sm: 1.2 },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.8em',
              color: '#FFFFFF',
              viewTransitionName: `video-title-${video.id}`,
            })}
          >
            {video.title}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Chip
              size="small"
              label={video.category}
              color={categoryColorMap[video.category] ?? 'default'}
              sx={{
                fontWeight: 600,
                height: 24,
                transition: 'transform 140ms ease',
                '&:active': { transform: 'scale(0.97)' },
              }}
            />

            <Stack direction="row" alignItems="center" spacing={0.4}>
              <ScheduleRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#AAAAAA' }}>{formatDuration(video.duration)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(VideoCard)
