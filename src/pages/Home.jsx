import { useEffect, useMemo, useRef, useState } from 'react'
import { AppBar, Avatar, Box, Chip, Container, Grid, IconButton, InputBase, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'
import CategorySection from '../components/CategorySection'
import { videos } from '../data/videos'
import { routeTransition } from '../styles/animations'
import { categoryColors } from '../styles/theme'

const categoryIconMap = {
  'Social Media AI': <SmartToyRoundedIcon sx={{ fontSize: 16 }} />,
  'AI Income': <MonetizationOnRoundedIcon sx={{ fontSize: 16 }} />,
  'AI Essentials': <SchoolRoundedIcon sx={{ fontSize: 16 }} />,
}

function Home({ miniPlayerVisible = false }) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrollTop, setScrollTop] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 900)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const savedPosition = Number(sessionStorage.getItem('home-scroll-top') || 0)
    if (contentRef.current && savedPosition > 0) {
      contentRef.current.scrollTop = savedPosition
      setScrollTop(savedPosition)
    }

    return () => {
      if (contentRef.current) {
        sessionStorage.setItem('home-scroll-top', String(contentRef.current.scrollTop))
      }
    }
  }, [])

  const groupedVideos = useMemo(() => {
    return videos.reduce((accumulator, video) => {
      if (!accumulator[video.category]) {
        accumulator[video.category] = []
      }

      accumulator[video.category].push(video)
      return accumulator
    }, {})
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const searchFilteredGroups = useMemo(() => {
    if (!normalizedQuery) {
      return groupedVideos
    }

    return Object.entries(groupedVideos).reduce((accumulator, [categoryName, categoryVideos]) => {
      const matchedVideos = categoryVideos.filter((video) => {
        const searchableText = `${video.title} ${video.category}`.toLowerCase()
        return searchableText.includes(normalizedQuery)
      })

      if (matchedVideos.length > 0) {
        accumulator[categoryName] = matchedVideos
      }

      return accumulator
    }, {})
  }, [groupedVideos, normalizedQuery])

  const categories = Object.entries(groupedVideos)
  const visibleCategories = Object.entries(searchFilteredGroups)
  const filteredCategories = selectedCategory === 'All'
    ? visibleCategories
    : visibleCategories.filter(([categoryName]) => categoryName === selectedCategory)

  const totalMatchedVideos = useMemo(
    () => visibleCategories.reduce((total, [, categoryVideos]) => total + categoryVideos.length, 0),
    [visibleCategories],
  )

  const handleFilterCategory = (categoryName) => {
    setExpandedCategory(null)
    setSelectedCategory((previous) => (previous === categoryName ? 'All' : categoryName))
  }

  const handleSeeAll = (categoryName) => {
    setSelectedCategory(categoryName)
    setExpandedCategory((previous) => (previous === categoryName ? null : categoryName))
  }

  return (
    <Box sx={routeTransition}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: 'rgba(15,15,15,0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 20,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 2.5 }, flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 1, sm: 0 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
            <Box sx={{ width: 20, height: 14, bgcolor: 'primary.main', borderRadius: 0.6 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Dino Ventures
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 260, md: 320 },
              mr: { xs: 0, sm: 1 },
              px: 1,
              py: 0.35,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              order: { xs: 3, sm: 0 },
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 0.8 }} />
            <InputBase
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search videos"
              inputProps={{ 'aria-label': 'Search videos' }}
              sx={{
                flex: 1,
                fontSize: '0.92rem',
                color: 'text.primary',
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                sx={{ ml: 0.4 }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Tooltip title="Profile">
            <IconButton aria-label="Open profile" sx={{ ml: 0.4, order: { xs: 2, sm: 0 } }}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: '0.78rem' }}>U</Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 2, pb: miniPlayerVisible ? { xs: 12, sm: 13 } : { xs: 4, sm: 5 } }}>
        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 1,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 8,
                animation: 'logoPulse 1.2s cubic-bezier(0.4,0,0.2,1) infinite',
                '@keyframes logoPulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.08)' },
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>DV</Typography>
            </Box>
            <Typography color="text.secondary">Loading premium experience...</Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip
            label="All"
            clickable
            onClick={() => setSelectedCategory('All')}
            color={selectedCategory === 'All' ? 'primary' : 'default'}
            sx={{ borderRadius: 3 }}
          />
          {categories.map(([categoryName]) => (
            <Chip
              key={categoryName}
              icon={categoryIconMap[categoryName]}
              label={categoryName}
              clickable
              onClick={() => handleFilterCategory(categoryName)}
              sx={{
                borderRadius: 3,
                color: '#FFFFFF',
                background: categoryColors[categoryName]?.gradient,
                border: selectedCategory === categoryName ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1), filter 200ms cubic-bezier(0.4,0,0.2,1)',
                '&:hover': { transform: 'translateY(-1px)', filter: 'brightness(1.08)' },
              }}
            />
          ))}
        </Stack>

        {searchQuery && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {totalMatchedVideos} result{totalMatchedVideos === 1 ? '' : 's'} for "{searchQuery.trim()}"
          </Typography>
        )}

        <Box
          ref={contentRef}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          sx={{
            height: miniPlayerVisible ? 'calc(100vh - 218px)' : 'calc(100vh - 130px)',
            overflowY: 'auto',
            px: { xs: 0, sm: 0.5 },
            scrollBehavior: 'smooth',
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map(([categoryName, categoryVideos], index) => (
                <Grid item xs={12} key={categoryName}>
                  <CategorySection
                    category={categoryName}
                    videos={categoryVideos}
                    isLoading={isLoading}
                    parallaxOffset={(scrollTop * 0.015) * (index % 2 === 0 ? 1 : -1)}
                    isFiltered={selectedCategory === categoryName}
                    onFilterCategory={handleFilterCategory}
                    onSeeAll={handleSeeAll}
                    isExpanded={expandedCategory === categoryName}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="h6" sx={{ mb: 0.8 }}>No videos found</Typography>
                  <Typography color="text.secondary">Try a different search or category filter.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
