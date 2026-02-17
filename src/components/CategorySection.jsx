import { memo } from 'react'
import { Box, Link, Skeleton, Stack, Typography } from '@mui/material'
import VideoCard from './VideoCard'
import { shimmer } from '../styles/animations'

function CategorySection({ category, videos, isLoading }) {
  return (
    <Box sx={{ pb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={(theme) => ({ ...theme.typography.categoryLabel })}>
          {category}
        </Typography>
        <Link href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.82rem', fontWeight: 500 }}>
          See all
        </Link>
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: { xs: 2, md: 2.5 },
          gridAutoColumns: {
            xs: '100%',
            sm: 'calc((100% - 16px) / 2)',
            md: 'calc((100% - 32px) / 3)',
            lg: 'calc((100% - 48px) / 4)',
          },
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x proximity',
          pb: 0.5,
          scrollbarWidth: 'none',
          '& > *': {
            scrollSnapAlign: 'start',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Box key={`${category}-skeleton-${index}`}>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      borderRadius: 2,
                      mb: 1,
                      background: 'linear-gradient(90deg, rgba(39,39,39,0.6) 0%, rgba(80,80,80,0.55) 50%, rgba(39,39,39,0.6) 100%)',
                      backgroundSize: '200% 100%',
                      animation: `${shimmer} 1.5s linear infinite`,
                    }}
                  />
                  <Skeleton variant="text" width="92%" sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
                  <Skeleton variant="text" width="55%" sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </Box>
              ))
            : videos.map((video) => <VideoCard key={video.id} video={video} />)}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 20,
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, #0F0F0F 0%, rgba(15,15,15,0) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 20,
            pointerEvents: 'none',
            background: 'linear-gradient(270deg, #0F0F0F 0%, rgba(15,15,15,0) 100%)',
          }}
        />
      </Box>
    </Box>
  )
}

export default memo(CategorySection)