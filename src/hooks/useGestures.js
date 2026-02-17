import { useMemo, useRef } from 'react'

function useGestures({
  onSwipeUp,
  onSwipeDown,
  onScrollDown,
  onDragStart,
  onDragMove,
  onDragEnd,
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

        onDragStart?.()
      },
      onTouchMove: (event) => {
        const touch = event.touches[0]
        if (!touch) {
          return
        }

        touchDataRef.current.latestY = touch.clientY
        touchDataRef.current.latestTime = Date.now()

        const distance = touchDataRef.current.latestY - touchDataRef.current.startY
        const duration = Math.max(touchDataRef.current.latestTime - touchDataRef.current.startTime, 1)

        onDragMove?.({
          distanceY: distance,
          absDistanceY: Math.abs(distance),
          velocityY: Math.abs(distance) / duration,
        })
      },
      onTouchEnd: () => {
        const { startY, startTime, latestY, latestTime } = touchDataRef.current
        const distance = latestY - startY
        const duration = Math.max(latestTime - startTime, 1)
        const velocity = Math.abs(distance) / duration

        onDragEnd?.({
          distanceY: distance,
          absDistanceY: Math.abs(distance),
          velocityY: velocity,
        })

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
    [
      minSwipeDistance,
      minSwipeVelocity,
      onDragEnd,
      onDragMove,
      onDragStart,
      onScrollDown,
      onSwipeDown,
      onSwipeUp,
    ],
  )

  return handlers
}

export default useGestures
