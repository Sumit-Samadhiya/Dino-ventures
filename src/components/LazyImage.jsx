import { memo, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

function LazyImage({ src, alt, sx, ...rest }) {
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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
      onLoad={() => setIsLoaded(true)}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        filter: isLoaded ? 'blur(0)' : 'blur(14px)',
        transform: isLoaded ? 'scale(1)' : 'scale(1.03)',
        opacity: isVisible ? 1 : 0,
        transition: 'filter 320ms cubic-bezier(0.4,0,0.2,1), transform 320ms cubic-bezier(0.4,0,0.2,1), opacity 220ms cubic-bezier(0.4,0,0.2,1)',
        ...sx,
      }}
      {...rest}
    />
  )
}

export default memo(LazyImage)