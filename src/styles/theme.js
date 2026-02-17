import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FC3F7',
      dark: '#0288D1',
      light: '#81D4FA',
    },
    secondary: {
      main: '#FFB74D',
    },
    background: {
      default: '#0B1020',
      paper: '#151C32',
    },
    text: {
      primary: '#F5F7FF',
      secondary: '#A5B3D8',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.6rem',
      '@media (min-width:480px)': {
        fontSize: '1.9rem',
      },
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.35,
    },
    subtitle2: {
      fontSize: '0.82rem',
      letterSpacing: 0.2,
      color: '#A5B3D8',
    },
    videoTitle: {
      fontWeight: 650,
      fontSize: '1rem',
      lineHeight: 1.35,
    },
    videoMeta: {
      fontWeight: 500,
      fontSize: '0.82rem',
      letterSpacing: 0.25,
    },
  },
})

export default theme
