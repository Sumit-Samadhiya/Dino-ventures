# Dino Ventures Video Player

A modern, mobile-first video browsing and playback experience built with React, Vite, and Material UI. The app includes categorized feeds, a full custom player, swipe gestures, mini-player continuity, and autoplay-next behavior.

## Demo

- Demo video / GIF: _Add your link here_  
  Example: `https://your-hosted-demo-link`

## Screenshots

- Home page: _Add screenshot_ (`docs/screenshots/home.png`)
- Player page: _Add screenshot_ (`docs/screenshots/player.png`)
- Mini player: _Add screenshot_ (`docs/screenshots/mini-player.png`)
- Video list drawer: _Add screenshot_ (`docs/screenshots/video-list-drawer.png`)

## Features

### Core Product
- Vite + React app with Material UI dark theme
- Mobile-first responsive layout and route transitions
- Home feed grouped by categories with smooth horizontal scrolling
- Full custom in-page video controls (play/pause, seek, volume, fullscreen)
- Swipe-up video list drawer with same-category recommendations
- Drag-to-minimize mini player that persists across navigation

### Playback Experience
- Autoplay next video with 2-second countdown overlay
- Next-video looping within category (last -> first)
- Skip ±10 second visual feedback overlays
- Video buffering and network error overlays with retry action

### Performance & UX
- Lazy-loaded thumbnails using Intersection Observer
- Virtualized in-player list rendering using `react-window`
- Optimized re-renders with `React.memo` in heavy components
- Smooth transitions and micro-interactions on controls

### Accessibility
- Keyboard playback shortcuts (Space / Arrow Left / Arrow Right)
- ARIA labels across player controls and interactive elements
- Screen-reader friendly live regions for status feedback
- Focus management for autoplay countdown cancellation

## Tech Stack

- React 18
- Vite
- Material UI (`@mui/material`, `@mui/icons-material`)
- Emotion (`@emotion/react`, `@emotion/styled`)
- React Router DOM
- react-window

## Project Structure

```text
src/
  components/
  data/
  hooks/
  pages/
  styles/
  utils/
```

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

## Routes

- `/` : Home page with category feeds
- `/player/:id` : Full custom video player

## Deployment

### Vercel
1. Push repository to GitHub.
2. Import project in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.

### Netlify
1. Connect GitHub repo in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add SPA redirect rule in `public/_redirects` if needed:
   - `/* /index.html 200`
