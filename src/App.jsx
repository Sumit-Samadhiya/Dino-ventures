import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import Home from './pages/Home'
import Player from './pages/Player'
import MiniPlayer from './components/MiniPlayer'
import theme from './styles/theme'
import AppGlobalStyles from './styles/globalStyles'
import { routeTransition } from './styles/animations'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [miniPlayerState, setMiniPlayerState] = useState({
    visible: false,
    videoId: null,
    title: '',
    thumbnail: '',
    videoUrl: '',
    mediaType: '',
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
      <AppGlobalStyles />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Box
          key={location.pathname}
          sx={{
            ...routeTransition,
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
