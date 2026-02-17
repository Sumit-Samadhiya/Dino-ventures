import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

function YouTubePlayer({ videoId, isPlaying, onReady, onStateChange }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        initPlayer()
      }
    } else {
      initPlayer()
    }

    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '360',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0, // Hide YouTube controls, use custom
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
        },
      })
    }

    return () => {
      // Don't destroy player on unmount to maintain state
    }
  }, [videoId, onReady, onStateChange, isPlaying])

  // Sync isPlaying state
  useEffect(() => {
    if (!playerRef.current) return

    if (isPlaying && playerRef.current.getPlayerState?.() !== window.YT?.PlayerState?.PLAYING) {
      playerRef.current.playVideo?.()
    } else if (!isPlaying && playerRef.current.getPlayerState?.() === window.YT?.PlayerState?.PLAYING) {
      playerRef.current.pauseVideo?.()
    }
  }, [isPlaying])

  // Expose player to parent via ref
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.player = playerRef.current
    }
  }, [playerRef.current])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
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
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />
    </Box>
  )
}

export default YouTubePlayer
