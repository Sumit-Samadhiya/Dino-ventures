import { Box, Skeleton, Typography } from '@mui/material'
import VideoCard from './VideoCard'

function CategorySection({ category, videos, isLoading }) {
  return (
    <Box sx={{ pb: 1.5 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {category}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: 2,
          gridAutoColumns: {
            xs: '100%',
            sm: 'calc((100% - 16px) / 2)',
            lg: 'calc((100% - 48px) / 4)',
          },
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          pb: 0.5,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            borderRadius: 4,
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Box key={`${category}-skeleton-${index}`}>
                <Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '16 / 9', mb: 1 }} />
                <Skeleton variant="text" width="92%" />
                <Skeleton variant="text" width="55%" />
              </Box>
            ))
          : videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </Box>
    </Box>
  )
}

export default CategorySection