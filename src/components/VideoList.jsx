import { memo, useMemo } from 'react'
import {
  Box,
  Chip,
  Divider,
  Drawer,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded'
import { FixedSizeList as VirtualList } from 'react-window'
import LazyImage from './LazyImage'
import { formatDuration } from '../utils/helpers'

const ROW_HEIGHT = 94

const Row = memo(function Row({ index, style, data }) {
  const video = data.videos[index]
  const isCurrent = video.id === data.currentVideoId

  return (
    <Box style={style} sx={{ pr: 0.5 }}>
      <ListItemButton
        selected={isCurrent}
        onClick={() => data.onSelectVideo(video.id)}
        aria-label={`Play ${video.title}`}
        sx={{
          borderRadius: 1.5,
          mb: 0.35,
          alignItems: 'center',
          gap: 1,
          minHeight: 88,
          border: '1px solid transparent',
          transition: 'background-color 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.06)',
          },
          '&.Mui-selected': {
            bgcolor: 'rgba(255,0,0,0.12)',
            borderColor: 'primary.main',
          },
        }}
      >
        <LazyImage
          src={video.thumbnail}
          alt={video.title}
          width={120}
          height={67.5}
          sx={{
            borderRadius: 1,
            flexShrink: 0,
            objectFit: 'cover',
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: '0.9rem',
              lineHeight: 1.3,
              mb: 0.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {video.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <Typography variant="caption" color="text.secondary">
              {video.category}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(video.duration)}
            </Typography>
          </Stack>
        </Box>

        {isCurrent && <PlayCircleFilledWhiteRoundedIcon color="primary" fontSize="small" aria-label="Currently playing" />}
      </ListItemButton>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
    </Box>
  )
})

function VideoList({ open, onClose, videos, currentVideoId, category, onSelectVideo }) {
  const virtualHeight = useMemo(() => {
    return Math.min(videos.length * ROW_HEIGHT, 56 * 16)
  }, [videos.length])

  const rowData = useMemo(
    () => ({ videos, currentVideoId, onSelectVideo }),
    [videos, currentVideoId, onSelectVideo],
  )

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '68vh',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        },
      }}
    >
      <Box sx={{ px: 2, pt: 1.2, pb: 1.2, position: 'relative' }}>
        <Box
          sx={{
            width: 42,
            height: 4,
            borderRadius: 99,
            bgcolor: 'text.secondary',
            mx: 'auto',
            mb: 1,
            opacity: 0.55,
          }}
        />

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6">Up Next</Typography>
          <Chip size="small" color="primary" label={category} />
        </Stack>

        <Box
          sx={{
            maxHeight: '56vh',
            scrollBehavior: 'smooth',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 14,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0))',
              pointerEvents: 'none',
              zIndex: 2,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 14,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0))',
              pointerEvents: 'none',
              zIndex: 2,
            },
          }}
        >
          <VirtualList
            height={Math.max(virtualHeight, ROW_HEIGHT)}
            width="100%"
            itemCount={videos.length}
            itemSize={ROW_HEIGHT}
            itemData={rowData}
          >
            {Row}
          </VirtualList>
        </Box>
      </Box>
    </Drawer>
  )
}

export default memo(VideoList)
