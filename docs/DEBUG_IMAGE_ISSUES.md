# Debugging Image Issues

## Problem: Images Upload Successfully But Don't Show in Frontend

### Step 1: Check Browser Console

After uploading and saving, check the browser console for these logs:

1. **Upload Response:**
   ```
   [AdminDashboard] Upload result: {...}
   [AdminDashboard] Extracted filename: image.jpg
   ```

2. **Save Data:**
   ```
   [AdminDashboard] Saving model data: { galleryFiles: [...] }
   ```

3. **After Reload:**
   ```
   [AdminDashboard] Gallery files after normalization: [...]
   ```

### Step 2: Verify What's Being Saved

1. Open Admin Dashboard
2. Upload a gallery image
3. Check console for `[AdminDashboard] Extracted gallery filename:`
4. Verify the filename is just the filename (e.g., `image.jpg`), not a path
5. Click Save
6. Check console for `[AdminDashboard] Saving model data:` - verify `galleryFiles` array contains just filenames

### Step 3: Check Database vs Files

The issue might be:
- **Filenames in database don't match actual files on disk**
- **Case sensitivity** (e.g., `Image.jpg` vs `image.jpg`)
- **Spaces in filenames** not handled correctly

### Step 4: Verify Backend Response Format

The backend upload endpoint should return:
```json
{
  "success": true,
  "filename": "image.jpg"  // or "/images/Open650/image.jpg"
}
```

If it returns a full path, we extract just the filename. Check console logs to see what's returned.

### Step 5: Test Image Path Construction

After saving, the frontend constructs paths like:
- `https://tigermarinewbackend.onrender.com/images/Open650/image.jpg`

Verify:
1. The backend URL is correct
2. The model folder name matches (e.g., "Open650" not "OP650")
3. The filename matches exactly (case-sensitive)

### Common Issues:

1. **Filename Mismatch:**
   - Database has: `image.jpg`
   - File on disk: `Image.jpg` (capital I)
   - **Fix:** Ensure exact match (case-sensitive)

2. **Path vs Filename:**
   - Database has: `/images/Open650/image.jpg` (full path)
   - Should be: `image.jpg` (just filename)
   - **Fix:** Already handled by `extractFilename()`, but verify it's working

3. **Model Folder Name:**
   - Model name: `OP650`
   - Folder name: `Open650`
   - **Fix:** Check `MODEL_FOLDER_MAP` in `backendConfig.js`

### Quick Fix:

If images are broken after upload:

1. **Check the actual filename on disk:**
   - Go to `backend/public/images/[ModelFolder]/`
   - Note the exact filename (case, spaces, etc.)

2. **Manually enter the exact filename in Admin Dashboard:**
   - Select model
   - In gallery section, manually type the exact filename
   - Click Save

3. **Verify it works:**
   - Refresh the page
   - Check if image appears

### Don't Remove Images!

**Keep all images in the backend folders.** The issue is likely:
- Filename mismatch (case, spaces)
- Path construction issue
- Database not saving correctly

Use the console logs to identify which one.

