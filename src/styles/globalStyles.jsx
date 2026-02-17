import { GlobalStyles } from '@mui/material'

function AppGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          WebkitFontSmoothing: 'antialiased',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          backgroundColor: '#0F0F0F',
          color: '#FFFFFF',
          overscrollBehaviorY: 'none',
        },
        '::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(255,0,0,0.85), rgba(255,76,76,0.8))',
          borderRadius: 12,
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        ':focus-visible': {
          outline: '2px solid #FF0000',
          outlineOffset: '2px',
        },
        '@media (max-width: 600px)': {
          '::-webkit-scrollbar': {
            width: 0,
            height: 0,
          },
        },
      }}
    />
  )
}

export default AppGlobalStyles