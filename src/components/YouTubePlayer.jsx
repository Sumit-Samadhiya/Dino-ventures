import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'

const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api'

function YouTubePlayer({ videoId, isPlaying, onReady, onStateChange }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const playerReadyRef = useRef(false)
  const apiRetryCountRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // YouTube error codes
  const youtubeErrorMessages = {
    2: 'Invalid video parameter',
    5: 'HTML5 player error',
    100: 'Video not found',
    101: 'Video owner does not allow embedding',
    150: 'Video owner does not allow embedding',
  }

  // Handle video ID changes when player is ready
  useEffect(() => {
    if (!videoId) {
      console.warn('No video ID provided to YouTubePlayer')
      setError('No video ID provided')
      return
    }

    setError('')
    setIsLoading(true)

    // If player exists and is ready, update it
    if (playerRef.current && playerReadyRef.current) {
      console.log('Updating player with video ID:', videoId)
      try {
        if (isPlaying) {
          playerRef.current.loadVideoById(videoId)
        } else {
          playerRef.current.cueVideoById(videoId)
        }
        if (isPlaying) {
          playerRef.current.playVideo?.()
        }
        setIsLoading(false)
      } catch (err) {
        console.error('Error cueing video:', err)
        setError('Failed to load video')
        setIsLoading(false)
      }
    }
  }, [videoId])

  // Initialize player on mount
  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided')
      setIsLoading(false)
      return
    }

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) {
        if (apiRetryCountRef.current < 5) {
          console.log('YouTube API not ready, retrying... attempt', apiRetryCountRef.current + 1)
          apiRetryCountRef.current += 1
          setTimeout(initializePlayer, 500)
        } else {
          console.error('YouTube API failed to load after multiple attempts')
          setError('YouTube API failed to load')
          setIsLoading(false)
        }
        return
      }

      apiRetryCountRef.current = 0

      if (!containerRef.current) {
        console.error('Container ref not available')
        setError('Player container not available')
        setIsLoading(false)
        return
      }

      // If player already exists, don't recreate it
      if (playerRef.current && playerReadyRef.current) {
        console.log('Player already initialized for video ID:', videoId)
        return
      }

      try {
        console.log('Creating new YouTube player for video ID:', videoId)
        
        // Clear any existing children to avoid conflicts
        containerRef.current.innerHTML = ''
        
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
              console.log('YouTube player ready for video:', videoId)
              playerReadyRef.current = true
              setIsLoading(false)
              setError('')
              if (onReady) onReady(event)
            },
            onStateChange: (event) => {
              console.log('YouTube player state changed:', event.data)
              if (onStateChange) onStateChange(event)
            },
            onError: (event) => {
              const errorCode = event.data
              const errorMsg = youtubeErrorMessages[errorCode] || 'Unknown YouTube error'
              console.error('YouTube player error:', errorCode, errorMsg)
              setError(errorMsg)
              playerReadyRef.current = false
              setIsLoading(false)
            },
          },
        })
      } catch (err) {
        console.error('Failed to initialize YouTube player:', err)
        setError('Failed to initialize YouTube player')
        playerReadyRef.current = false
        setIsLoading(false)
      }
    }

    // Load YouTube API if not already present
    if (!window.YT) {
      console.log('YouTube API not found, loading...')
      if (!document.querySelector(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`)) {
        const tag = document.createElement('script')
        tag.src = YOUTUBE_IFRAME_API_SRC
        tag.async = true

        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
      }

      const previousReadyHandler = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousReadyHandler?.()
        console.log('YouTube IFrame API ready')
        initializePlayer()
      }

      setTimeout(initializePlayer, 300)
    } else {
      initializePlayer()
    }

    return () => {
      // Cleanup: reset ready state and destroy instance to avoid stale player state
      playerReadyRef.current = false
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
  }, [])

// Sync playing state with YouTube player when it changes
  useEffect(() => {
    if (!playerRef.current || !playerReadyRef.current || !window.YT) return

    try {
      const state = playerRef.current.getPlayerState?.()
      if (isPlaying && state !== window.YT.PlayerState.PLAYING && state !== window.YT.PlayerState.BUFFERING) {
        playerRef.current.playVideo?.()
      } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo?.()
      }
    } catch (err) {
      console.error('Error syncing player state:', err)
    }
  }, [isPlaying])

  if (error) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          overflow: 'hidden',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          <Typography variant="body2">Failed to load YouTube video (ID: {videoId})</Typography>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Alert>
      </Box>
    )
  }

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
