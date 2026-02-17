import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import Home from './pages/Home'
import Player from './pages/Player'
import theme from './styles/theme'

function App() {
  const location = useLocation()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2, mb: { xs: 1.5, sm: 2 } }}>
            Dino Ventures
          </Typography>
        </Box>

        <Box
          key={location.pathname}
          sx={{
            animation: 'routeFade 240ms ease-out',
            '@keyframes routeFade': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<Player />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
