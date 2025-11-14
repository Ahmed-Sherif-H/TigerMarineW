# ⚠️ URGENT: Fix Large Files Before Pushing

## Problem Found

You have **2 files that exceed GitHub's 100MB limit**:
1. `ProLine620\05 - 620 pro line 2021 v2.mp4` - **103.09 MB** ❌
2. `TopLine850\01 - TIGER MARINE 850TL 2021 - new.mov` - **357.43 MB** ❌

**These will cause your push to FAIL!**

Total repository size: **1.14 GB** (very large, will be slow)

## ✅ Solution: Use Git LFS

### Step 1: Install Git LFS (if not installed)

```bash
# Check if installed
git lfs version

# If not installed, download from: https://git-lfs.github.com/
# Or use package manager:
# Windows: choco install git-lfs
# Mac: brew install git-lfs
```

### Step 2: Initialize Git LFS

```bash
# Initialize Git LFS in your repository
git lfs install
```

### Step 3: Track Large Files

```bash
# Track all video files
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.MP4"
git lfs track "*.MOV"

# Track large images (optional, but recommended)
git lfs track "*.jpg"
git lfs track "*.JPG"
git lfs track "*.png"
```

### Step 4: Add .gitattributes

```bash
# This file was created automatically by git lfs track
git add .gitattributes
```

### Step 5: Add Your Files

```bash
# Remove files from Git cache if already added
git rm --cached public/images/**/*.mp4
git rm --cached public/images/**/*.mov
git rm --cached public/images/**/*.MP4
git rm --cached public/images/**/*.MOV

# Add them back with LFS
git add public/images/
git commit -m "Add images and videos with Git LFS"
```

### Step 6: Push

```bash
git push
```

## 📊 Git LFS Limits

- **Free tier**: 1 GB storage + 1 GB/month bandwidth
- Your videos total: ~1.14 GB
- **You may need to upgrade** or optimize videos

## 🔄 Alternative: Exclude Large Files

If you don't want to use LFS, exclude videos from Git:

### Option A: Exclude All Videos

1. Add to `.gitignore`:
```
# Large video files - store externally
public/images/**/*.mp4
public/images/**/*.mov
public/images/**/*.MP4
public/images/**/*.MOV
```

2. Remove from Git:
```bash
git rm --cached public/images/**/*.mp4
git rm --cached public/images/**/*.mov
git commit -m "Remove large video files from Git"
```

3. Upload videos to:
   - AWS S3
   - Cloudinary
   - Your own server
   - YouTube/Vimeo (embed)

4. Update your code to reference external URLs

### Option B: Compress Videos First

Use ffmpeg to compress:
```bash
ffmpeg -i "input.mp4" -vcodec libx264 -crf 28 -preset slow "output.mp4"
```

## 🚀 Quick Fix (Recommended)

Run these commands:

```bash
# 1. Install and setup LFS
git lfs install

# 2. Track video files
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.MP4"
git lfs track "*.MOV"

# 3. Add .gitattributes
git add .gitattributes

# 4. If files already in Git, remove and re-add
git rm --cached -r public/images/
git add public/images/

# 5. Commit
git commit -m "Use Git LFS for large video files"

# 6. Push
git push
```

## ⚠️ Important Notes

1. **Git LFS uses bandwidth** - Each clone/pull downloads LFS files
2. **Free tier limits** - You may hit the 1GB/month limit quickly
3. **Consider CDN** - For production, serve videos from CDN, not GitHub

## 📝 Next Steps

1. ✅ Run the commands above
2. ✅ Test push on a small branch first
3. ✅ Monitor LFS usage on GitHub
4. ✅ Consider optimizing/compressing videos for production

---

**Need help?** Check the `GITHUB_PUSH_GUIDE.md` for more details.

