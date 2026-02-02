# Upload Images to Backend - Quick Guide

## Overview

After downloading images from Cloudinary, you need to upload them to your backend's `public/images/` folder.

## Option 1: Using Railway CLI (Recommended)

If your backend is on Railway:

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your backend project**:
   ```bash
   cd path/to/your/backend
   railway link
   ```

4. **Upload images**:
   - Use Railway's file upload feature in the dashboard
   - Or use `railway up` to deploy with images included

## Option 2: Manual Upload via Git

1. **Clone your backend repository** (if not already):
   ```bash
   git clone <your-backend-repo-url>
   cd <backend-folder>
   ```

2. **Copy downloaded images** to match folder structure:
   ```
   backend/public/images/
   ├── TopLine950/          (copy all TopLine950 images here)
   ├── TopLine850/          (copy all TopLine850 images here)
   ├── ProLine620/          (copy all ProLine620 images here)
   ├── ProLine550/          (copy all ProLine550 images here)
   ├── Open850/             (copy all Open850 images here)
   ├── Open650/             (copy all Open650 images here)
   ├── categories/
   │   ├── TopLine/         (copy category images here)
   │   ├── ProLine/
   │   └── ...
   └── events/              (copy event images here)
   ```

3. **Commit and push**:
   ```bash
   git add public/images/
   git commit -m "Add migrated images from Cloudinary"
   git push
   ```

4. **Wait for Railway to deploy** (automatic if connected)

## Option 3: Direct File Transfer (FTP/SFTP)

If you have direct server access:

1. **Connect to your backend server** via FTP/SFTP
2. **Navigate to** `public/images/` folder
3. **Upload images** maintaining folder structure
4. **Verify permissions** (files should be readable)

## Folder Structure Reference

Your downloaded Cloudinary images should have a structure like:
```
downloaded-images/
├── models/
│   ├── TopLine950/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── ProLine620/
│   └── ...
├── categories/
│   ├── TopLine/
│   └── ...
└── events/
    └── ...
```

Copy these to:
```
backend/public/images/
├── TopLine950/        (from downloaded-images/models/TopLine950/)
├── ProLine620/       (from downloaded-images/models/ProLine620/)
├── categories/       (from downloaded-images/categories/)
└── events/           (from downloaded-images/events/)
```

## Important Notes

1. **Maintain exact folder names** - Case-sensitive!
   - `TopLine950` not `topline950`
   - `ProLine620` not `proline620`

2. **Preserve filenames** - Don't rename files
   - Database references exact filenames
   - Migration script extracts filenames from Cloudinary URLs

3. **Interior images** - Keep in `Interior/` subfolder:
   ```
   backend/public/images/Open650/
   ├── image1.jpg          (gallery images)
   ├── image2.jpg
   └── Interior/           (interior images)
       ├── interior1.jpg
       └── interior2.jpg
   ```

4. **Verify after upload**:
   - Check file count matches downloaded images
   - Test direct URL: `https://your-backend.railway.app/images/TopLine950/image1.jpg`
   - Should return the image (not 404)

## Troubleshooting

### Images not showing after upload

1. **Check file permissions** - Files should be readable
2. **Verify folder names** - Must match exactly (case-sensitive)
3. **Check backend static serving** - Ensure `/images/` route is configured
4. **Clear browser cache** - Hard refresh (Ctrl+F5)

### File size limits

- Railway has file size limits
- If images are too large, compress them first
- Consider using image optimization tools

### Missing files

- Double-check all folders were copied
- Verify no files were skipped during transfer
- Check for hidden files (some systems hide them)
