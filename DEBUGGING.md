# 🔧 Debugging Guide - Video Loading Issues

## Overview
This guide helps you troubleshoot issues when videos don't load properly in Dino Ventures.

---

## 1. **Check Browser Console for Errors**

### How to Open:
- **Chrome/Edge**: `Ctrl + Shift + J` (Windows) or `Cmd + Option + J` (Mac)
- **Firefox**: `Ctrl + Shift + K` (Windows) or `Cmd + Option + K` (Mac)

### What to Look For:

#### ✅ **Expected Console Logs:**
```
Player: URL ID: _HL7l_62bUc Decoded ID: _HL7l_62bUc
Extracted YouTube ID: _HL7l_62bUc from URL: https://youtube.com/embed/_HL7l_62bUc
YouTube API not found, loading...
YouTube IFrame API ready
Creating new YouTube player for video ID: _HL7l_62bUc
YouTube player ready for video: _HL7l_62bUc
```

---

## 2. **Common Issues & Solutions**

### ❌ **Issue: "Video not found" Error**

**Symptoms:**
- Player page shows "Video data not found, please go back and select a video again"
- Console shows: `Video not found for ID: {videoId}`

**Causes:**
1. Video ID doesn't match any video in the database
2. URL encoded video ID isn't being decoded properly
3. Video database hasn't loaded

**Solutions:**
1. Open browser console and check which videos are available:
   ```javascript
   // Paste this in console to see all available video IDs
   console.table(document.querySelector('video')?.dataset || 'No videos found')
   ```

2. Try navigating directly to a known video:
   - Replace `{id}` in URL with an actual video ID from the dataset
   - Example: `http://localhost:5173/player/_HL7l_62bUc`

3. Hard refresh the page:  
   - `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

---

### ❌ **Issue: YouTube Player Doesn't Load**

**Symptoms:**
- Player area shows loading spinner indefinitely
- No video appears after 5+ seconds
- Console shows: `YouTube API failed to load after multiple attempts`

**Causes:**
1. YouTube API isn't loading (network issue)
2. YouTube is blocked by extensions/firewall
3. Multiple player instances conflicting

**Solutions:**
1. Check if YouTube API loads:
   ```javascript
   // In console
   console.log(window.YT) // Should show YouTube API object
   ```

2. Disable browser extensions temporarily (AdBlock, uBlock, etc.)

3. Check network tab:
   - Press `F12` → Network tab
   - Look for requests to `youtube.com/iframe_api`
   - Should return status 200

4. Try a different browser

---

### ❌ **Issue: Video Embeds Not Allowed Error**

**Symptoms:**
- YouTube player shows: "Video owner does not allow embedding"
- Error code 101 or 150 in console

**Causes:**
- YouTube video upload restrictions
- The specific video is not embeddable

**Solution:**
- This is a YouTube restriction, not a code issue
- Try with a different video
- Video owners can enable embedding in YouTube Studio settings

---

## 3. **Network Check**

### Verify YouTube API Loading:

Open browser console and run:
```javascript
// Check if YouTube API is loaded
if (window.YT) {
  console.log('✅ YouTube API loaded successfully');
  console.log('PlayerState:', window.YT.PlayerState);
} else {
  console.log('❌ YouTube API not loaded');
}
```

### Check Video URL Format:

```javascript
// In console, check a video URL
const videoUrl = 'https://youtube.com/embed/_HL7l_62bUc';
const match = videoUrl.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
console.log('Extracted video ID:', match ? match[1] : 'No ID found');
// Should output: Extracted video ID: _HL7l_62bUc
```

---

## 4. **Check Video Data**

### Verify Videos Are Loaded:

Open browser console:
```javascript
// Try to import and inspect videos
fetch('/src/data/videos.js')
  .then(r => r.text())
  .then(t => console.log('First 5 videos:', t.slice(0, 500)))
  .catch(e => console.log('Videos loaded from client memory'))
```

### Or Check Directly:

1. Go to `http://localhost:5173/` (Home page)
2. Open console and run:
   ```javascript
   // Find a video card and log its link
   const link = document.querySelector('a[href*="/player/"]');
   console.log('First video route:', link?.href);
   console.log('Video ID:', link?.href.split('/player/')[1]);
   ```

---

## 5. **Development Server Issues**

### If Using `npm run dev`:

```bash
# Clear cache and restart
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```

### If Using Built Version:

```bash
# Create fresh build
npm run build

# Check build output
ls -la dist/
```

---

## 6. **Log Collection for Bug Report**

If videos still don't load, collect this info for debugging:

1. **Browser & OS:**
   ```javascript
   console.log(navigator.userAgent)
   ```

2. **Console Errors** (take screenshot)

3. **Network Errors** (F12 → Network tab, filter by `youtube`, `iframe_api`)

4. **Video ID being accessed:**
   - Check URL bar: `http://localhost:5173/player/{ID}`

5. **Video Data Sample:**
   ```javascript
   // Check a video record structure
   console.log('Sample response:', {
     id: '_HL7l_62bUc',
     mediaType: 'YOUTUBE',
     videoUrl: 'https://youtube.com/embed/_HL7l_62bUc'
   })
   ```

---

## 7. **Quick Diagnostic Checklist**

- [ ] Are videos loading on Home page? (visible in feed)
- [ ] Can you click a video card without errors?
- [ ] Does URL change to `/player/{id}` after clicking?
- [ ] Does console show "Video not found" or loading errors?
- [ ] Is YouTube API loading? (`window.YT` defined)
- [ ] Are there any CORS/network errors in Network tab?
- [ ] Can you access `youtube.com` directly in browser?
- [ ] Are extensions blocking YouTube embeds?

---

## 8. **Contact Support**

If issues persist, provide:
1. Screenshot of error message
2. Browser console output (F12 → Console tab)
3. Steps to reproduce
4. Video ID being accessed
5. Browser/OS information

---

## 🎥 **Testing Videos**

Test these known-working YouTube video IDs:

- `_HL7l_62bUc` - AI Motivational Reel Banao Free Mein
- `avZd1bSvqyE` - Social Media Ke Liye Facts Video Banao  
- `meVTqNn1P5A` - Instagram Ka Naya AI Feature

Direct test URL:  
`http://localhost:5173/player/_HL7l_62bUc`

---

**Last Updated:** Feb 17, 2025 | Dino Ventures v1.0
