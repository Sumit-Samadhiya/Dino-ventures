import { keyframes } from '@mui/material/styles'

export const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

export const scalePulse = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
`

export const routeTransition = {
  animation: `${fadeSlideIn} 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
}
