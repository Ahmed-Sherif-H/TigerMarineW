# GitHub Push Guide - Handling Large Files

## ⚠️ Potential Issues with Images & Videos

Yes, you **may face issues** when pushing large images and videos to GitHub:

### 1. **File Size Limits**
- **GitHub's hard limit**: 100 MB per file
- **Warning threshold**: 50 MB per file
- If any single file exceeds 100 MB, the push will **fail**

### 2. **Repository Performance**
- Large binary files make repositories slow to:
  - Clone
  - Push/Pull
  - Browse
- Very large repos (>1 GB) can cause timeouts

### 3. **Common Video File Sizes**
- MP4/MOV files are typically **10-500 MB each**
- Multiple videos can quickly add up to **several GB**

## ✅ Solutions

### **Option 1: Use Git LFS (Recommended for Large Files)**

Git Large File Storage (LFS) is designed for large files:

```bash
# Install Git LFS (if not already installed)
git lfs install

# Track large files
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.MP4"
git lfs track "*.MOV"

# Track large images (if any are >50MB)
git lfs track "*.jpg"
git lfs track "*.JPG"

# Add the .gitattributes file
git add .gitattributes

# Now add your files normally
git add public/images/
git commit -m "Add images and videos with LFS"
git push
```

**Note**: GitHub provides **1 GB of free LFS storage** and **1 GB/month bandwidth**. For more, you need a paid plan.

### **Option 2: Exclude Large Files from Git**

If videos are too large, store them externally:

1. **Add to .gitignore**:
   ```
   # Large video files
   public/images/**/*.mp4
   public/images/**/*.mov
   public/images/**/*.MP4
   public/images/**/*.MOV
   ```

2. **Use a CDN or Cloud Storage**:
   - Upload videos to:
     - AWS S3
     - Cloudinary
     - Vimeo/YouTube (embed)
     - Your own server
   - Update your code to reference external URLs

### **Option 3: Optimize Files Before Pushing**

Compress videos and images:

```bash
# For videos, use ffmpeg to compress:
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow output.mp4

# For images, use tools like:
# - ImageOptim (Mac)
# - TinyPNG (Web)
# - Squoosh (Web)
```

### **Option 4: Check File Sizes First**

Before pushing, check if any files are too large:

```powershell
# Check for files > 50MB
Get-ChildItem -Path public\images -Recurse -File | Where-Object {$_.Length -gt 50MB} | Select-Object Name, @{N='SizeMB';E={[math]::Round($_.Length/1MB,2)}}

# Check total size
$total = (Get-ChildItem -Path public\images -Recurse -File | Measure-Object -Property Length -Sum).Sum
Write-Host "Total: $([math]::Round($total/1MB, 2)) MB"
```

## 🚀 Recommended Approach

1. **Check file sizes** first (use Option 4)
2. **If videos are < 50MB each**: Push normally (should be fine)
3. **If videos are > 50MB**: Use Git LFS (Option 1)
4. **If total repo > 1GB**: Consider external storage (Option 2)

## 📝 Quick Checklist

- [ ] Check largest file size (should be < 100MB)
- [ ] Check total repository size (should be < 1GB ideally)
- [ ] If large files exist, set up Git LFS
- [ ] Test push on a small branch first
- [ ] Monitor push progress - if it's taking > 10 minutes, cancel and use LFS

## 💡 Best Practices

1. **Keep videos optimized** - Use compressed formats (H.264, WebM)
2. **Use Git LFS for videos** - Even if under 100MB, LFS makes pushes faster
3. **Consider lazy loading** - Only load videos when needed
4. **Use external CDN** - For production, serve media from CDN, not GitHub

## 🔧 If Push Fails

If you get an error like:
```
remote: error: File public/images/xxx.mp4 is 150.00 MB; this exceeds GitHub's file size limit of 100.00 MB
```

**Solution**:
1. Remove the file from Git history (if already committed):
   ```bash
   git rm --cached public/images/xxx.mp4
   git commit -m "Remove large file"
   ```
2. Add to .gitignore
3. Use Git LFS or external storage

---

**Need help?** Check GitHub's documentation on [large files](https://docs.github.com/en/repositories/working-with-files/managing-large-files) and [Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).

