import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

function YouTubePlayer({ videoId, isPlaying, onReady, onStateChange }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!videoId) return

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) {
        console.warn('YouTube API not loaded yet, retrying...')
        setTimeout(initializePlayer, 500)
        return
      }

      if (!containerRef.current) return
      if (playerRef.current) {
        // Update existing player with new video
        playerRef.current.cueVideoById(videoId)
        if (isPlaying) {
          playerRef.current.playVideo?.()
        }
        return
      }

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event) => {
              setIsLoading(false)
              if (onReady) onReady(event)
            },
            onStateChange: (event) => {
              if (onStateChange) onStateChange(event)
            },
            onError: (event) => {
              console.error('YouTube error:', event.data)
              setIsLoading(false)
            },
          },
        })
      } catch (err) {
        console.error('Failed to initialize YouTube player:', err)
        setIsLoading(false)
      }
    }

    // Load YouTube API if not already present
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }

      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      initializePlayer()
    }

    return () => {
      // Don't destroy the player, just cleanup reference on unmount is ok
    }
  }, [videoId, onReady, onStateChange, isPlaying])

  // Sync playing state with YouTube player
  useEffect(() => {
    if (!playerRef.current || !window.YT) return

    const state = playerRef.current.getPlayerState?.()
    if (isPlaying && state !== window.YT.PlayerState.PLAYING && state !== window.YT.PlayerState.BUFFERING) {
      playerRef.current.playVideo?.()
    } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo?.()
    }
  }, [isPlaying])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}
      <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} id={`yt-player-${videoId}`} />
    </Box>
  )
}

export default YouTubePlayer
