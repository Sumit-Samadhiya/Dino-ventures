import { Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Link as RouterLink } from 'react-router-dom'
import { formatDuration } from '../utils/helpers'

function VideoCard({ video }) {
  return (
    <Card sx={{ height: '100%', backgroundColor: 'background.paper' }}>
      <CardActionArea component={RouterLink} to={`/player/${video.id}`} sx={{ height: '100%' }}>
        <CardMedia component="img" image={video.thumbnail} alt={video.title} sx={{ aspectRatio: '16 / 9' }} />
        <CardContent>
          <Typography
            variant="h6"
            sx={(theme) => ({
              ...theme.typography.videoTitle,
              mb: 1,
            })}
          >
            {video.title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Chip size="small" icon={<PlayArrowRoundedIcon />} label={video.category} color="primary" />
            <Typography
              sx={(theme) => ({
                ...theme.typography.videoMeta,
                color: 'text.secondary',
              })}
            >
              {formatDuration(video.duration)}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default VideoCard
