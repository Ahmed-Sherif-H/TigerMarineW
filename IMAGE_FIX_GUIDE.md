# Image Fix Guide

## Current Issues

1. **Model images broken** - Images not displaying in ModelDetail page
2. **Category images broken** - Category images not showing in Home and Categories pages
3. **No category image upload** - Can't upload category images from dashboard

## Solutions Implemented

### 1. Category Image Upload
- ✅ Added upload buttons for Category Image and Hero Image in AdminDashboard
- ✅ Category images upload to: `backend/public/images/categories/[CategoryName]/`
- ✅ Backend route updated to handle category uploads

### 2. Image Path Fixes
- ✅ Updated `transformModelData.js` to properly generate category image paths
- ✅ Added `getCategoryImagePath()` utility function
- ✅ Fixed filename encoding for spaces and special characters
- ✅ All images now point to backend URL correctly

### 3. Backend Static File Serving
- ✅ Backend serves images from `/images` which includes categories folder
- ✅ Category images accessible at: `https://tigermarinewbackend.onrender.com/images/categories/[CategoryName]/[filename]`

## Steps to Fix Broken Images

### Option 1: Re-upload Images (Recommended)

1. **For Model Images:**
   - Go to Admin Dashboard → Models tab
   - Select a model
   - Use Upload buttons for Image File, Hero Image, Content Image
   - Upload Gallery, Interior, and Video images
   - Click "Save Changes"

2. **For Category Images:**
   - Go to Admin Dashboard → Categories tab
   - Select a category
   - Use Upload buttons for Category Image and Hero Image
   - Click "Save Changes"

### Option 2: Fix Existing Images (If files already exist in backend)

If images already exist in `backend/public/images/`:

1. **Check folder structure:**
   ```
   backend/public/images/
   ├── TopLine950/
   ├── Open650/
   │   └── Interior/
   └── categories/
       ├── TopLine/
       ├── ProLine/
       └── ...
   ```

2. **Update database filenames:**
   - Go to Admin Dashboard
   - For each model/category, manually enter the correct filename
   - Click "Save Changes"

### Option 3: Delete and Re-upload (If images are corrupted)

1. **Delete images from backend:**
   - Access your Render backend
   - Delete images from `backend/public/images/` folders
   - Or use the Admin Dashboard to delete individual files (if delete functionality exists)

2. **Re-upload all images:**
   - Use Admin Dashboard upload buttons
   - Upload all images fresh
   - This ensures correct filenames in database

## Image Path Structure

### Model Images
- **Location:** `backend/public/images/[ModelName]/`
- **URL:** `https://tigermarinewbackend.onrender.com/images/[ModelName]/[filename]`
- **Interior:** `backend/public/images/[ModelName]/Interior/`
- **URL:** `https://tigermarinewbackend.onrender.com/images/[ModelName]/Interior/[filename]`

### Category Images
- **Location:** `backend/public/images/categories/[CategoryName]/`
- **URL:** `https://tigermarinewbackend.onrender.com/images/categories/[CategoryName]/[filename]`

### Customizer Images
- **Location:** `backend/public/Customizer-images/[ModelName]/[PartName]/`
- **URL:** `https://tigermarinewbackend.onrender.com/Customizer-images/[ModelName]/[PartName]/[filename]`

## Troubleshooting

### Images Still Not Showing

1. **Check browser console:**
   - Open DevTools → Network tab
   - Look for 404 errors on image requests
   - Check the actual URL being requested

2. **Verify backend URL:**
   - Ensure `VITE_API_URL` is set correctly in Netlify
   - Should be: `https://tigermarinewbackend.onrender.com/api`

3. **Check filename encoding:**
   - Filenames with spaces are encoded as `%20`
   - Special characters are URL-encoded
   - Verify filename in database matches actual file name

4. **Verify file exists:**
   - Check Render backend file system
   - Ensure file is in correct folder
   - Check file permissions

### Category Images Not Working

1. **Check category name:**
   - Category name in database must match folder name
   - Folder: `backend/public/images/categories/[CategoryName]/`
   - Database: `category.name` should match `[CategoryName]`

2. **Upload category images:**
   - Use Admin Dashboard → Categories tab
   - Select category → Upload images
   - Save changes

### Model Images Not Working

1. **Check model name mapping:**
   - Model name in database (e.g., "TL850") maps to folder (e.g., "TopLine850")
   - See `imagePathUtils.js` for mapping

2. **Verify filenames:**
   - Database `imageFile`, `heroImageFile`, `contentImageFile` should match actual filenames
   - Use Admin Dashboard to update if needed

## Best Practices

1. **Always use Admin Dashboard** to upload images
2. **Don't manually edit** filenames in database unless you know the exact filename
3. **Use descriptive filenames** when uploading
4. **Keep folder structure** consistent
5. **Test after upload** - check if images display correctly

