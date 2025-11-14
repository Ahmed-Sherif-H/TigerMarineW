# 🚫 Exclude Large Files from Git - Quick Guide

## What This Does

Automatically finds large files (>50MB) and:
1. Adds them to `.gitignore` (so Git ignores them)
2. Removes them from Git tracking (if already committed)
3. Keeps the files on your disk (they're just not in Git)

## ⚡ Quick Start

### Step 1: Preview What Will Be Excluded

```powershell
.\exclude-large-files.ps1 -DryRun
```

This shows you which files will be excluded **without making any changes**.

### Step 2: Run the Script

```powershell
.\exclude-large-files.ps1
```

This will:
- ✅ Add large files to `.gitignore`
- ✅ Remove them from Git tracking
- ✅ Show you what was done

### Step 3: Commit the Changes

```powershell
git add .gitignore
git commit -m "Exclude large video files from Git"
git push
```

## 📊 What Was Found

Based on the dry run, these files will be excluded:

1. `public/images/Open650/37 - 650OP-LR.mp4` - 50.41 MB
2. `public/images/ProLine550/01 - 550PL -2022.mp4` - 89.87 MB
3. `public/images/ProLine620/05 - 620 pro line 2021 v2.mp4` - **103.09 MB** ⚠️
4. `public/images/TopLine750/28 - 850TL-75.mp4` - 73.16 MB
5. `public/images/TopLine850/01 - TIGER MARINE 850TL 2021 - new.mov` - **357.43 MB** ⚠️

**Total excluded: ~673 MB**

## ⚙️ Options

### Change Size Limit

```powershell
# Exclude files larger than 30MB instead of 50MB
.\exclude-large-files.ps1 -SizeLimitMB 30
```

### Don't Remove from Git Tracking

```powershell
# Only add to .gitignore, don't remove from Git
.\exclude-large-files.ps1 -RemoveFromGit:$false
```

### Custom Path

```powershell
# Scan a different directory
.\exclude-large-files.ps1 -Path "public\videos"
```

## ⚠️ Important Notes

1. **Files stay on your disk** - They're just not tracked by Git
2. **Website will still work** - Files are still in `public/images/`
3. **Others won't get these files** - When they clone, these files won't be there
4. **You need to handle them separately** - Upload to CDN, optimize, or share another way

## 🔄 After Excluding

### Option 1: Upload to External Storage
- AWS S3
- Cloudinary
- Your own server
- Update code to use external URLs

### Option 2: Optimize Later
- Use `optimize-videos.ps1` to compress
- Re-add to Git after optimization

### Option 3: Share Separately
- Upload to Google Drive/Dropbox
- Share link with team
- Document where files are stored

## ✅ Next Steps

1. Run the script: `.\exclude-large-files.ps1`
2. Review `.gitignore` to see what was added
3. Commit: `git add .gitignore && git commit -m "Exclude large files"`
4. Push: `git push` (should work now!)
5. Handle excluded files separately (optimize or host externally)

---

**Ready to push!** The large files won't block your GitHub push anymore.

