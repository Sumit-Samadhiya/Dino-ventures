import { useEffect, useMemo, useState } from 'react'
import { AppBar, Avatar, Box, Container, Grid, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CategorySection from '../components/CategorySection'
import { videos } from '../data/videos'
import { routeTransition } from '../styles/animations'

function Home({ miniPlayerVisible = false }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  const groupedVideos = useMemo(() => {
    return videos.reduce((accumulator, video) => {
      if (!accumulator[video.category]) {
        accumulator[video.category] = []
      }

      accumulator[video.category].push(video)
      return accumulator
    }, {})
  }, [])

  const categories = Object.entries(groupedVideos)

  return (
    <Box sx={routeTransition}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: 'rgba(15,15,15,0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 20,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <Box sx={{ width: 20, height: 14, bgcolor: 'primary.main', borderRadius: 0.6 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Dino Ventures
            </Typography>
          </Stack>

          <Tooltip title="Search">
            <IconButton aria-label="Search videos" sx={{ width: 44, height: 44 }}>
              <SearchRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton aria-label="Open profile" sx={{ ml: 0.4 }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: '0.78rem' }}>U</Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 2, pb: miniPlayerVisible ? { xs: 12, sm: 13 } : { xs: 4, sm: 5 } }}>
        <Box
          sx={{
            height: miniPlayerVisible ? 'calc(100vh - 218px)' : 'calc(100vh - 130px)',
            overflowY: 'auto',
            px: { xs: 0, sm: 0.5 },
            scrollBehavior: 'smooth',
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
            {categories.length > 0 ? (
              categories.map(([categoryName, categoryVideos]) => (
                <Grid item xs={12} key={categoryName}>
                  <CategorySection category={categoryName} videos={categoryVideos} isLoading={isLoading} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="h6" sx={{ mb: 0.8 }}>No videos available</Typography>
                  <Typography color="text.secondary">Try refreshing the feed later.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
