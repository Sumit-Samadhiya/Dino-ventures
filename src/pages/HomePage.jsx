import { Grid, Typography } from '@mui/material'
import VideoCard from '../components/VideoCard'
import { videos } from '../data/videos'

function HomePage() {
  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Discover trending videos across technology, gaming, music, education, and entertainment.
      </Typography>

      <Grid container spacing={2.5}>
        {videos.map((video) => (
          <Grid key={video.id} item xs={12} sm={6} md={4} lg={3}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default HomePage
