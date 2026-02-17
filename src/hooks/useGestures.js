import { useMemo, useRef } from 'react'

function useGestures({
  onSwipeUp,
  onSwipeDown,
  onScrollDown,
  minSwipeDistance = 60,
  minSwipeVelocity = 0.4,
} = {}) {
  const touchDataRef = useRef({
    startY: 0,
    startTime: 0,
    latestY: 0,
    latestTime: 0,
  })

  const handlers = useMemo(
    () => ({
      onTouchStart: (event) => {
        const touch = event.touches[0]
        if (!touch) {
          return
        }

        const now = Date.now()
        touchDataRef.current = {
          startY: touch.clientY,
          startTime: now,
          latestY: touch.clientY,
          latestTime: now,
        }
      },
      onTouchMove: (event) => {
        const touch = event.touches[0]
        if (!touch) {
          return
        }

        touchDataRef.current.latestY = touch.clientY
        touchDataRef.current.latestTime = Date.now()
      },
      onTouchEnd: () => {
        const { startY, startTime, latestY, latestTime } = touchDataRef.current
        const distance = latestY - startY
        const duration = Math.max(latestTime - startTime, 1)
        const velocity = Math.abs(distance) / duration

        if (Math.abs(distance) < minSwipeDistance || velocity < minSwipeVelocity) {
          return
        }

        if (distance < 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      },
      onWheel: (event) => {
        if (event.deltaY > 22) {
          onScrollDown?.()
        }
      },
    }),
    [minSwipeDistance, minSwipeVelocity, onScrollDown, onSwipeDown, onSwipeUp],
  )

  return handlers
}

export default useGestures
