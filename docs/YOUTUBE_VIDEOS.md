# YouTube Video Integration Guide

## Overview

The website now supports **both local video files and YouTube videos** for model detail pages. This provides:
- ✅ Better performance (no server bandwidth for videos)
- ✅ Easier management (upload once to YouTube)
- ✅ Better SEO (YouTube videos are indexed)
- ✅ Local videos still supported for hero sections (autoplay, muted, loop)

## How It Works

### Video Detection
The system automatically detects if a video is:
- **YouTube URL/ID**: Renders as YouTube embed (iframe)
- **Local file**: Renders as HTML5 video element (autoplay, muted, loop)

### Supported YouTube Formats
- Full URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`
- Embed URL: `https://www.youtube.com/embed/VIDEO_ID`
- Just the ID: `VIDEO_ID`

## Using YouTube Videos

### In Admin Dashboard

1. **Go to Models tab** → Select a model
2. **Find "Video Files" section**
3. **Instead of uploading a video file**, enter a YouTube URL or ID:
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Or just: `dQw4w9WgXcQ`
4. **Click "Save Changes"**

### Video Display

- **YouTube videos**: Display as embedded player with controls
- **Local videos**: Display as autoplay, muted, looping background video

## Best Practices

1. **Hero Videos**: Keep as local files (for autoplay, muted, loop)
2. **Model Detail Videos**: Use YouTube (better performance, easier management)
3. **Multiple Videos**: Mix YouTube and local videos as needed
4. **Video Quality**: Upload high-quality videos to YouTube (1080p or 4K)

## Migration from Local Videos

If you have local videos you want to move to YouTube:

1. Upload video to YouTube
2. Copy the video URL or ID
3. In Admin Dashboard, replace the local filename with the YouTube URL/ID
4. Save changes
5. (Optional) Delete local video file from backend

## Technical Details

### YouTube URL Parsing
The system extracts the video ID from various YouTube URL formats:
- `youtube.com/watch?v=ID` → extracts `ID`
- `youtu.be/ID` → extracts `ID`
- `youtube.com/embed/ID` → extracts `ID`
- `ID` (just the ID) → uses as-is

### Video Rendering
- **YouTube**: Uses YouTube iframe API with responsive embed
- **Local**: Uses HTML5 `<video>` element with autoplay, muted, loop

