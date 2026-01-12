# Cloudinary Image Management Guide

## How to Check Images on Cloudinary

1. **Log in to Cloudinary Dashboard:**
   - Go to: https://cloudinary.com/console
   - Sign in with your account credentials

2. **View Media Library:**
   - Click on "Media Library" in the left sidebar
   - You'll see all uploaded images organized by folders

3. **Browse by Folder:**
   - Images are organized in folders like:
     - `models/` - Model images (e.g., `models/Open850/DJI_0202.jpg`)
     - `categories/` - Category images
     - `images/Events/` - Event images

4. **Search for Images:**
   - Use the search bar to find specific images
   - Filter by folder, date, or tags

5. **Get Image URL:**
   - Click on any image to view details
   - Copy the URL from the "URL" field
   - Format: `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/vTIMESTAMP/FOLDER/FILENAME.jpg`

## Image Storage Format

### ✅ Correct Format (Cloudinary URL):
```
https://res.cloudinary.com/dtmcjepgn/image/upload/v1768186565/models/Open850/DJI_0202.jpg
```

### ❌ Incorrect Format (Just filename):
```
DJI_0202.jpg
```

## How the System Works

1. **When Uploading:**
   - Image is uploaded to Cloudinary
   - Backend returns: `{ url: "https://res.cloudinary.com/...", public_id: "...", filename: "..." }`
   - Frontend extracts the `url` using `extractUploadUrl()`
   - Full Cloudinary URL is stored in the database

2. **When Loading:**
   - Database contains either:
     - Cloudinary URL (new uploads) ✅
     - Filename only (legacy data) ⚠️
   - Frontend preserves Cloudinary URLs as-is
   - Legacy filenames are converted to full paths when displaying

3. **When Saving:**
   - Cloudinary URLs are preserved exactly as stored
   - No extraction or modification of URLs
   - Legacy filenames remain as filenames

## Troubleshooting

### Issue: Image shows as filename instead of URL

**Cause:** The image was uploaded before Cloudinary integration, or the upload response wasn't processed correctly.

**Solution:**
1. Re-upload the image from the dashboard
2. The new upload will store the full Cloudinary URL
3. Save the model/category to persist the URL

### Issue: Image URL is inconsistent

**Cause:** Mixed data - some images have URLs, some have filenames.

**Solution:**
1. Check the database field value
2. If it's a filename, re-upload the image
3. If it's a URL but not working, check if the URL is valid in Cloudinary dashboard

### Issue: Can't see images in Cloudinary

**Possible causes:**
1. Wrong Cloudinary account
2. Images uploaded to different cloud name
3. Images were deleted from Cloudinary

**Solution:**
1. Verify Cloudinary credentials in backend `.env`
2. Check `CLOUDINARY_CLOUD_NAME` matches the URL
3. Check Media Library in Cloudinary dashboard

## Best Practices

1. **Always use Cloudinary URLs:**
   - Upload images through the dashboard
   - Don't manually enter filenames
   - Let the system handle URL extraction

2. **Verify Uploads:**
   - After uploading, check the input field shows the full URL
   - If it shows just a filename, re-upload

3. **Check Database:**
   - If images aren't displaying, check the database value
   - Should be a full Cloudinary URL, not just a filename

4. **Migration:**
   - Legacy images (filenames only) will still work
   - They're converted to full paths when displaying
   - Consider re-uploading for better performance
