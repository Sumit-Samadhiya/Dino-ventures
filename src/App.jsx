import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import Home from './pages/Home'
import Player from './pages/Player'
import MiniPlayer from './components/MiniPlayer'
import theme from './styles/theme'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [miniPlayerState, setMiniPlayerState] = useState({
    visible: false,
    videoId: null,
    title: '',
    thumbnail: '',
    videoUrl: '',
    currentTime: 0,
    isPlaying: true,
    volume: 1,
  })

  const handleMinimizePlayer = (nextState) => {
    setMiniPlayerState({
      ...nextState,
      visible: true,
    })
  }

  const handleCloseMiniPlayer = () => {
    setMiniPlayerState((previousState) => ({
      ...previousState,
      visible: false,
      isPlaying: false,
    }))
  }

  const handleUpdateMiniPlayer = (patch) => {
    setMiniPlayerState((previousState) => ({
      ...previousState,
      ...patch,
    }))
  }

  const handleRestoreFromMiniPlayer = () => {
    if (!miniPlayerState.videoId) {
      return
    }

    const restorePayload = { ...miniPlayerState }
    setMiniPlayerState((previousState) => ({ ...previousState, visible: false }))
    navigate(`/player/${miniPlayerState.videoId}`, {
      state: {
        fromMiniPlayer: true,
        miniPlayerData: restorePayload,
      },
    })
  }

  const shouldShowMiniPlayer = miniPlayerState.visible && !location.pathname.startsWith('/player/')

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
            <Route path="/" element={<Home miniPlayerVisible={shouldShowMiniPlayer} />} />
            <Route
              path="/player/:id"
              element={
                <Player
                  onMinimizePlayer={handleMinimizePlayer}
                  onCloseMiniPlayer={handleCloseMiniPlayer}
                />
              }
            />
          </Routes>
        </Box>

        {shouldShowMiniPlayer && (
          <MiniPlayer
            data={miniPlayerState}
            onClose={handleCloseMiniPlayer}
            onRestore={handleRestoreFromMiniPlayer}
            onStateUpdate={handleUpdateMiniPlayer}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
