import { useEffect, useRef, useState } from 'react'

function useAutoPlay({ enabled, nextVideo, onAutoPlay, durationSeconds = 2 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const intervalRef = useRef(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const cancel = () => {
    clearTimer()
    setIsVisible(false)
    setSecondsLeft(durationSeconds)
  }

  useEffect(() => {
    if (!enabled || !nextVideo) {
      cancel()
      return
    }

    setIsVisible(true)
    setSecondsLeft(durationSeconds)

    const startedAt = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000
      const remaining = Math.max(durationSeconds - elapsedSeconds, 0)
      setSecondsLeft(remaining)

      if (remaining <= 0) {
        clearTimer()
        setIsVisible(false)
        onAutoPlay?.(nextVideo)
      }
    }, 100)

    return () => clearTimer()
  }, [durationSeconds, enabled, nextVideo, onAutoPlay])

  return {
    isVisible,
    secondsLeft,
    cancel,
  }
}

export default useAutoPlay
