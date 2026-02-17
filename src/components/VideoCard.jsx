import { memo } from 'react'
import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LazyImage from './LazyImage'
import { formatDuration } from '../utils/helpers'

const categoryColorMap = {
  Technology: 'info',
  Gaming: 'success',
  Music: 'secondary',
  Education: 'warning',
  Entertainment: 'primary',
}

function VideoCard({ video }) {
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 8,
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/player/${video.id}`} aria-label={`Open video ${video.title}`} sx={{ height: '100%' }}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              transition: 'transform 260ms ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.04)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              bgcolor: 'rgba(0, 0, 0, 0.72)',
              color: 'common.white',
              px: 0.8,
              py: 0.2,
              borderRadius: 1,
              fontSize: '0.74rem',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {formatDuration(video.duration)}
          </Box>
        </Box>

        <CardContent>
          <Typography
            variant="h6"
            sx={(theme) => ({
              ...theme.typography.videoTitle,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.7em',
            })}
          >
            {video.title}
          </Typography>

          <Chip
            size="small"
            label={video.category}
            color={categoryColorMap[video.category] ?? 'default'}
            sx={{ fontWeight: 600, transition: 'transform 140ms ease', '&:active': { transform: 'scale(0.97)' } }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(VideoCard)
