import { memo, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

function LazyImage({ src, alt, sx, ...rest }) {
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = imageRef.current
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '120px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      ref={imageRef}
      component="img"
      src={isVisible ? src : undefined}
      alt={alt}
      loading="lazy"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        ...sx,
      }}
      {...rest}
    />
  )
}

export default memo(LazyImage)