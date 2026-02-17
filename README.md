# Dino Ventures Video Player

Dino Ventures is a React-based video player starter application built with Vite and Material UI. It provides a clean, dark-themed interface designed for browsing and playing categorized video content.

## Features

- Vite-powered React application setup for fast development and builds
- Material UI dark theme optimized for video-centric interfaces
- Mobile-first responsive layout and breakpoints
- Home page with video grid and category chips
- Player page with dynamic route-based video playback
- Mock video dataset with 15 entries across key categories

## Tech Stack

- React
- Vite
- Material UI (`@mui/material`, `@mui/icons-material`)
- Emotion (`@emotion/react`, `@emotion/styled`)
- React Router DOM

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

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Available Routes

- `/` : Home page listing videos
- `/player/:id` : Video player page for selected video
