# 🎬 Media Optimization Guide - Make Your Site Fast & Lightweight

## 🎯 Goal

Reduce your media files from **1.14 GB to ~200-300 MB** while maintaining good quality.

## ⚡ Quick Start

### Step 1: Preview What Will Be Optimized

```powershell
# Check current file sizes
.\check-file-sizes.ps1

# Preview video optimization (dry run)
.\optimize-videos.ps1 -DryRun

# Preview image optimization (dry run)
.\optimize-images.ps1 -DryRun
```

### Step 2: Install Required Tools

**For Videos (FFmpeg):**
```powershell
# Using Chocolatey
choco install ffmpeg

# OR download from: https://ffmpeg.org/download.html
```

**For Images (Optional - can use online tools):**
```powershell
# Using Chocolatey
choco install imagemagick

# OR use online tools (TinyPNG, Squoosh)
```

### Step 3: Optimize Videos

```powershell
# Optimize all videos (creates backups automatically)
.\optimize-videos.ps1

# Custom quality (lower number = better quality, larger file)
.\optimize-videos.ps1 -Quality 28 -MaxWidth 1920
```

### Step 4: Optimize Images

```powershell
# Optimize large images
.\optimize-images.ps1

# OR use online tools:
# - https://tinypng.com/
# - https://squoosh.app/
```

### Step 5: Verify & Test

1. Check file sizes again: `.\check-file-sizes.ps1`
2. Test your website locally
3. Make sure videos/images still look good
4. Commit optimized files

## 📊 Expected Results

| File Type | Before | After | Savings |
|-----------|--------|-------|---------|
| Videos | 1.14 GB | ~200-300 MB | 70-80% |
| Images | Varies | ~50-70% smaller | 30-50% |
| **Total** | **1.14 GB** | **~250-350 MB** | **~70%** |

## 🎬 Video Optimization Details

### Quality Settings

- **Quality 28** (default): Good balance, ~70% size reduction
- **Quality 24**: Higher quality, ~50% reduction
- **Quality 32**: Lower quality, ~80% reduction

### Resolution

- **1920px** (default): Full HD, good for most cases
- **1280px**: HD, smaller files
- **2560px**: 2K, larger files

### Example Commands

```powershell
# High quality (for hero videos)
.\optimize-videos.ps1 -Quality 24 -MaxWidth 1920

# Medium quality (for gallery)
.\optimize-videos.ps1 -Quality 28 -MaxWidth 1280

# Lower quality (for thumbnails/previews)
.\optimize-videos.ps1 -Quality 32 -MaxWidth 720
```

## 🖼️ Image Optimization

### Online Tools (Easiest)

1. **TinyPNG**: https://tinypng.com/
   - Drag & drop images
   - Automatic optimization
   - Free for up to 20 images at once

2. **Squoosh**: https://squoosh.app/
   - Google's tool
   - Compare before/after
   - Adjust quality in real-time

3. **ImageOptim** (Mac only): https://imageoptim.com/
   - Drag & drop
   - Automatic optimization

### Manual Optimization

If you have ImageMagick installed:
```powershell
.\optimize-images.ps1
```

## 🔄 Workflow

### Recommended Process

1. **Backup originals** (scripts do this automatically)
2. **Optimize videos** first (biggest impact)
3. **Optimize images** second
4. **Test locally** - make sure everything looks good
5. **Compare file sizes** - verify savings
6. **Commit optimized files**
7. **Push to GitHub** - should be much faster now!

### If Something Goes Wrong

Original files are backed up in:
- `original-videos-backup-YYYYMMDD-HHMMSS/`
- `original-images-backup-YYYYMMDD-HHMMSS/`

You can restore from these if needed.

## ⚠️ Important Notes

1. **Test first**: Always test optimized files before committing
2. **Keep backups**: Scripts create backups, but keep originals safe
3. **Quality vs Size**: Balance quality with file size
4. **Mobile users**: Smaller files = better mobile experience
5. **SEO**: Google favors fast-loading sites

## 🚀 After Optimization

Once optimized:
- ✅ Files will be much smaller
- ✅ GitHub push will be faster
- ✅ Website will load faster
- ✅ Better user experience
- ✅ Lower hosting costs

## 📝 Next Steps

1. Run optimization scripts
2. Test your website
3. Commit optimized files
4. Push to GitHub (should work now!)
5. Consider using a CDN for production

---

**Need help?** Check the individual script files for more options and details.

