# Populate Image Filenames - Quick Guide

## What This Script Does

This script automatically scans your `backend/public/images/` folders and populates the database with:
- **Main Image** (`imageFile`) - First image found
- **Hero Image** (`heroImageFile`) - First image found  
- **Content Image** (`contentImageFile`) - Second image found (or first if only one exists)
- **Gallery Images** - All images in the folder
- **Video Files** - All videos in the folder
- **Interior Images** - All images in the `Interior/` subfolder

## How to Run

1. **Make sure backend is running** (or just run the script directly)

2. **Run the script**:
   ```bash
   cd backend
   npm run populate:images
   ```

3. **Wait for completion** - The script will:
   - Scan each model's image folder
   - Find all images, videos, and interior images
   - Update the database automatically
   - Show progress for each model

## What You'll See

```
🔄 Starting to populate image filenames...

Found 12 models to process

📦 Processing: TL850
  ✅ Updated:
     - Main Image: 850TL - 1.jpg
     - Hero Image: 850TL - 1.jpg
     - Content Image: 850TL-2.jpg
     - Gallery Images: 15 files
     - Video Files: 1 files
     - Interior Images: 8 files

📦 Processing: TL750
  ✅ Updated:
     ...
```

## After Running

1. **Refresh your frontend** - Images should now load!
2. **Check Admin Dashboard** - You'll see all filenames populated
3. **Edit if needed** - You can manually adjust which images are used for hero/content in the admin dashboard

## Notes

- The script uses the **first image** as default for main/hero
- The script uses the **second image** as default for content
- All images in the folder become **gallery images**
- Videos are automatically detected and added
- Interior images from `Interior/` subfolder are added

## Troubleshooting

If a model shows "No images found":
- Check that the folder exists: `backend/public/images/[ModelFolder]/`
- Verify the folder name matches the mapping in the script
- Make sure images are actually in the folder


