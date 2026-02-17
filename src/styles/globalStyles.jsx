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
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        ':focus-visible': {
          outline: '2px solid #FF0000',
          outlineOffset: '2px',
        },
      }}
    />
  )
}

export default AppGlobalStyles