# 🎬 Optimize Media Files for Production

## Why Optimize?

- **Faster page loads** - Better user experience
- **Lower bandwidth costs** - Save money on hosting/CDN
- **Better SEO** - Google favors fast sites
- **Mobile-friendly** - Works better on slow connections
- **Smaller Git repo** - Easier to push to GitHub

## 📊 Current Situation

- **Total size**: 1.14 GB
- **Largest video**: 357 MB (TopLine850 video)
- **2 files > 100MB**: Will fail GitHub push
- **Many files > 50MB**: Slow to load

## ✅ Recommended Solution

### 1. Compress Videos

**Target sizes:**
- Hero videos: **5-15 MB** (max 30 seconds)
- Gallery videos: **10-30 MB** (max 1 minute)
- Full videos: **50-100 MB** (if needed, host externally)

**Tools:**
- **FFmpeg** (free, command-line) - Best quality/size ratio
- **HandBrake** (free, GUI) - Easy to use
- **Online tools**: CloudConvert, FreeConvert

### 2. Optimize Images

**Target sizes:**
- Thumbnails: **50-200 KB**
- Hero images: **200-500 KB**
- Gallery images: **300-800 KB**

**Tools:**
- **ImageOptim** (Mac)
- **TinyPNG** (Web)
- **Squoosh** (Web, Google)
- **Sharp** (Node.js, automated)

### 3. Use Modern Formats

- **Videos**: H.264 (MP4) or WebM
- **Images**: WebP (with JPEG fallback)

## 🚀 Quick Start Guide

### Option A: Use FFmpeg (Recommended)

```bash
# Install FFmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Compress a video (good quality, smaller size)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:-1" output.mp4

# For even smaller (lower quality)
ffmpeg -i input.mp4 -vcodec libx264 -crf 32 -preset slow -vf "scale=1280:-1" output.mp4

# Batch compress all videos in a folder
for file in *.mp4; do
  ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset slow "${file%.mp4}_compressed.mp4"
done
```

### Option B: Use HandBrake (GUI)

1. Download: https://handbrake.fr/
2. Open video file
3. Preset: "Fast 1080p30" or "Fast 720p30"
4. Adjust quality slider (lower = smaller file)
5. Start encode

### Option C: Online Tools

1. **CloudConvert**: https://cloudconvert.com/
2. **FreeConvert**: https://www.freeconvert.com/
3. Upload → Compress → Download

## 📝 Recommended Workflow

1. **Keep originals** in a separate folder (e.g., `original-media/`)
2. **Compress copies** for web use
3. **Replace** in `public/images/`
4. **Test** that videos/images still look good
5. **Commit** optimized versions

## 🎯 Target File Sizes

| File Type | Current | Target | Tool |
|----------|---------|--------|------|
| Hero videos | 50-357 MB | 5-15 MB | FFmpeg |
| Gallery videos | 45-103 MB | 10-30 MB | FFmpeg |
| Hero images | Varies | 200-500 KB | ImageOptim |
| Gallery images | Varies | 300-800 KB | ImageOptim |

## 💡 Additional Optimizations

### 1. Lazy Loading
- Load videos/images only when needed
- Already implemented in React with `loading="lazy"`

### 2. Responsive Images
- Serve different sizes for mobile/desktop
- Use `srcset` attribute

### 3. Video Hosting (For Very Large Files)
- **YouTube/Vimeo** - Free, embed videos
- **Cloudinary** - Paid, automatic optimization
- **AWS S3 + CloudFront** - Scalable CDN

### 4. Progressive Loading
- Show thumbnail first, load full video on click
- Use poster images for videos

## 🔧 Automated Script (Coming Next)

I'll create a script to help automate the optimization process.

