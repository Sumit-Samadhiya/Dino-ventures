import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, Container, Typography } from '@mui/material'
import HomePage from './pages/HomePage'
import PlayerPage from './pages/PlayerPage'
import theme from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            Dino Ventures
          </Typography>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/player/:id" element={<PlayerPage />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
