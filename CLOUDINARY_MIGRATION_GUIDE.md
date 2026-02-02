# Cloudinary to Local Storage Migration Guide

## Overview

This guide will help you migrate from Cloudinary to local static file hosting. Your images will be served directly from your backend's `public/images/` folder instead of Cloudinary.

## Prerequisites

✅ You have downloaded all images from Cloudinary with folder structure  
✅ You have exported models data from the dashboard  
✅ Your backend is running and accessible

## Migration Steps

### Step 1: Upload Images to Backend

1. **Locate your backend repository** (separate from this frontend)

2. **Upload images to backend's public folder:**
   - Copy all downloaded model images to: `backend/public/images/[ModelName]/`
   - Copy all downloaded category images to: `backend/public/images/categories/[CategoryName]/`
   - Copy event images to: `backend/public/images/events/`
   - Maintain the exact folder structure you downloaded from Cloudinary

3. **Verify folder structure matches:**
   ```
   backend/public/images/
   ├── TopLine950/
   ├── TopLine850/
   ├── ProLine620/
   ├── ProLine550/
   ├── Open850/
   ├── Open650/
   ├── categories/
   │   ├── TopLine/
   │   ├── ProLine/
   │   └── ...
   └── events/
   ```

### Step 2: Convert Database URLs

The database currently stores Cloudinary URLs like:
```
https://res.cloudinary.com/dtmcjepgn/image/upload/v1768186565/models/Open850/DJI_0202.jpg
```

We need to convert them to just filenames:
```
DJI_0202.jpg
```

**Option A: Use the Migration Script (Recommended)**

1. Run the migration script provided in `scripts/migrate-cloudinary-to-local.js`
2. This will:
   - Connect to your backend API
   - Find all Cloudinary URLs in models and categories
   - Extract filenames from URLs
   - Update the database with local filenames

**Option B: Manual Update via Admin Dashboard**

1. Go to Admin Dashboard
2. For each model:
   - Open the model editor
   - For each image field (imageFile, heroImageFile, etc.):
     - If it shows a Cloudinary URL, extract just the filename
     - Example: `https://res.cloudinary.com/.../DJI_0202.jpg` → `DJI_0202.jpg`
     - Update the field with just the filename
   - Save changes
3. Repeat for categories and events

### Step 3: Update Backend (Disable Cloudinary)

**Important:** You need to update your backend to stop uploading to Cloudinary and serve files locally.

1. **In your backend code**, find the upload handler (usually in `routes/upload.js` or similar)

2. **Change upload logic** to save files locally instead of Cloudinary:
   ```javascript
   // OLD (Cloudinary):
   const result = await cloudinaryService.uploadFile(file, folder);
   return { url: result.secure_url, filename: result.public_id };
   
   // NEW (Local):
   const uploadPath = path.join(__dirname, '../public/images', folder, filename);
   await fs.writeFile(uploadPath, file.buffer);
   return { url: `/images/${folder}/${filename}`, filename: filename };
   ```

3. **Keep static file serving enabled** (usually already configured):
   ```javascript
   app.use('/images', express.static(path.join(__dirname, 'public/images')));
   ```

4. **Optional:** Remove Cloudinary environment variables from backend `.env`:
   ```
   # CLOUDINARY_CLOUD_NAME=...
   # CLOUDINARY_API_KEY=...
   # CLOUDINARY_API_SECRET=...
   ```

### Step 4: Verify Migration

1. **Check images load correctly:**
   - Visit model detail pages
   - Check category pages
   - Verify gallery images
   - Check interior images

2. **Test image uploads:**
   - Go to Admin Dashboard
   - Try uploading a new image
   - Verify it saves to local storage and displays correctly

3. **Check browser console:**
   - No 404 errors for images
   - Images load from backend URL (not Cloudinary)

## Troubleshooting

### Images Not Loading

1. **Check file paths:**
   - Verify images exist in `backend/public/images/`
   - Check folder names match exactly (case-sensitive)
   - Ensure filenames match database entries exactly

2. **Check backend static serving:**
   - Verify backend serves files from `/images/` route
   - Test direct URL: `https://your-backend.railway.app/images/TopLine950/image.jpg`

3. **Check database:**
   - Ensure filenames in database match actual file names
   - No Cloudinary URLs remaining in database

### Filename Mismatches

If filenames don't match:
1. Check the actual filename in the backend folder
2. Update the database entry to match exactly
3. Use Admin Dashboard to update the filename

### Special Characters in Filenames

If filenames have spaces or special characters:
- The frontend already handles URL encoding
- Ensure database stores the exact filename (with spaces)
- The system will automatically encode URLs when serving

## Post-Migration Checklist

- [ ] All images uploaded to backend `public/images/`
- [ ] Database URLs converted to filenames
- [ ] Backend configured to serve local files
- [ ] Backend upload handler updated (no Cloudinary)
- [ ] All images loading correctly on frontend
- [ ] New uploads working via Admin Dashboard
- [ ] No Cloudinary URLs in database
- [ ] No errors in browser console

## Rollback Plan

If you need to rollback:
1. Keep Cloudinary account active (don't delete yet)
2. Keep a backup of the database with Cloudinary URLs
3. Re-enable Cloudinary in backend if needed
4. Restore database backup if migration fails

## Next Steps

After successful migration:
1. Monitor image loading performance
2. Consider image optimization (compress large files)
3. Set up image CDN if needed (optional)
4. Remove Cloudinary dependencies from backend (optional cleanup)
