import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'

function YouTubePlayer({ videoId, isPlaying, onReady, onStateChange }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const apiRetryCountRef = useRef(0)
  const [isLoading, setIsLoading] = useState(!videoId)
  const [error, setError] = useState('')

  // YouTube error codes
  const youtubeErrorMessages = {
    2: 'Invalid video parameter',
    5: 'HTML5 player error',
    100: 'Video not found',
    101: 'Video owner does not allow embedding',
    150: 'Video owner does not allow embedding',
  }

  useEffect(() => {
    if (!videoId) {
      console.warn('No video ID provided to YouTubePlayer')
      setError('No video ID provided')
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
        return
      }

      if (playerRef.current) {
        console.log('Updating existing player with video ID:', videoId)
        try {
          playerRef.current.cueVideoById(videoId)
          if (isPlaying) {
            playerRef.current.playVideo?.()
          }
        } catch (err) {
          console.error('Error updating player:', err)
          setError('Failed to load video')
        }
        return
      }

      try {
        console.log('Creating new YouTube player for video ID:', videoId)
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
              setIsLoading(false)
            },
          },
        })
      } catch (err) {
        console.error('Failed to initialize YouTube player:', err)
        setError('Failed to initialize YouTube player')
        setIsLoading(false)
      }
    }

    // Load YouTube API if not already present
    if (!window.YT) {
      console.log('YouTube API not found, loading...')
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube IFrame API ready')
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
