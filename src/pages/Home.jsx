import { useEffect, useMemo, useState } from 'react'
import { Box, Container, Grid } from '@mui/material'
import CategorySection from '../components/CategorySection'
import { videos } from '../data/videos'

function Home() {
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
    <Container maxWidth="xl" sx={{ pb: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          height: 'calc(100vh - 110px)',
          overflowY: 'auto',
          pr: { xs: 0, sm: 0.5 },
          scrollBehavior: 'smooth',
        }}
      >
        <Grid container spacing={2.5}>
          {categories.map(([categoryName, categoryVideos]) => (
            <Grid item xs={12} key={categoryName}>
              <CategorySection category={categoryName} videos={categoryVideos} isLoading={isLoading} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default Home
