import {
  Avatar,
  Box,
  Chip,
  Drawer,
  List,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded'
import { formatDuration } from '../utils/helpers'

function VideoList({ open, onClose, videos, currentVideoId, category, onSelectVideo }) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          maxHeight: '68vh',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          transition: 'transform 260ms ease',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        },
      }}
    >
      <Box sx={{ px: 2, pt: 1.2, pb: 1 }}>
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

        <List
          disablePadding
          sx={{
            maxHeight: '56vh',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            pr: 0.5,
          }}
        >
          {videos.map((video) => {
            const isCurrent = video.id === currentVideoId

            return (
              <ListItemButton
                key={video.id}
                selected={isCurrent}
                onClick={() => onSelectVideo(video.id)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  alignItems: 'flex-start',
                  gap: 1,
                  minHeight: 72,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <Avatar
                  variant="rounded"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{ width: 84, height: 48, flexShrink: 0, borderRadius: 1 }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '0.92rem',
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
                  <Typography variant="caption" color="text.secondary">
                    {formatDuration(video.duration)}
                  </Typography>
                </Box>

                {isCurrent && <PlayCircleFilledWhiteRoundedIcon color="primary" fontSize="small" />}
              </ListItemButton>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}

export default VideoList
