import { createTheme } from '@mui/material/styles'

export const categoryColors = {
  Technology: { primary: '#2196F3', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  Gaming: { primary: '#9C27B0', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  Music: { primary: '#E91E63', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  Education: { primary: '#FF9800', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  Entertainment: { primary: '#F44336', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1440,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF0000',
      dark: '#D00000',
      light: '#FF4A4A',
    },
    secondary: {
      main: '#3EA6FF',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1F1F1F',
    },
    divider: 'rgba(255,255,255,0.12)',
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
    surface: {
      main: '#272727',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.24)',
    '0 2px 4px rgba(0,0,0,0.26)',
    '0 4px 10px rgba(0,0,0,0.3)',
    '0 6px 14px rgba(0,0,0,0.32)',
    '0 8px 18px rgba(0,0,0,0.34)',
    '0 10px 20px rgba(0,0,0,0.36)',
    '0 12px 24px rgba(0,0,0,0.38)',
    '0 14px 28px rgba(0,0,0,0.4)',
    '0 16px 30px rgba(0,0,0,0.42)',
    '0 18px 34px rgba(0,0,0,0.44)',
    '0 20px 38px rgba(0,0,0,0.46)',
    '0 22px 42px rgba(0,0,0,0.48)',
    '0 24px 46px rgba(0,0,0,0.5)',
    '0 26px 50px rgba(0,0,0,0.52)',
    '0 28px 54px rgba(0,0,0,0.54)',
    '0 30px 58px rgba(0,0,0,0.56)',
    '0 32px 62px rgba(0,0,0,0.58)',
    '0 34px 66px rgba(0,0,0,0.6)',
    '0 36px 70px rgba(0,0,0,0.62)',
    '0 38px 74px rgba(0,0,0,0.64)',
    '0 40px 78px rgba(0,0,0,0.66)',
    '0 42px 82px rgba(0,0,0,0.68)',
    '0 44px 86px rgba(0,0,0,0.7)',
    '0 46px 90px rgba(0,0,0,0.72)',
  ],
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    body2: {
      lineHeight: 1.6,
    },
    videoTitle: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      color: '#FFFFFF',
    },
    videoMeta: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#AAAAAA',
    },
    categoryLabel: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
  },
  transitions: {
    duration: {
      shortest: 200,
      shorter: 200,
      short: 200,
      standard: 200,
      complex: 300,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
  },
  custom: {
    categoryColors,
  },
})

export default theme

