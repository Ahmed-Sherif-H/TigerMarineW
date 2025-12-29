# Populate Images Without Render Shell Access

## Problem
Render free tier doesn't provide shell access, so you can't run `npm run populate:images` directly.

## ✅ Solution: Use Admin Dashboard (Easiest)

### Step-by-Step:

1. **Go to Admin Dashboard:**
   ```
   https://tigermarineweb.netlify.app/admin
   ```

2. **For Each Model:**
   - Select model from dropdown
   - Wait for data to load
   - **Upload Images:**
     - Click "Upload" next to Image File
     - Click "Upload" next to Hero Image
     - Click "Upload" next to Content Image
     - Click "Upload Gallery Image" for multiple gallery images
     - Click "Upload Interior Image" for interior images
     - Click "Upload Video" for videos
   - **Click "Save Changes"** at the bottom
   - This saves filenames to database AND uploads files to Render

3. **Verify:**
   - Refresh the page
   - Images should now appear
   - Check production site - images should load

## Alternative: Manual Filename Entry

If images already exist on Render but database is empty:

1. **Go to Admin Dashboard**
2. **For each model:**
   - Select model
   - Manually type filenames in the input fields
   - Example: `850TL - 1.jpg` (exact filename from Render)
   - Click "Save Changes"

**How to find filenames:**
- Check your local `backend/public/images/` folder
- Filenames should match exactly (including spaces and case)

## Alternative: Use API Directly

If you have many models, you can use the API:

### Option 1: Browser Console

1. Open Admin Dashboard
2. Open browser console (F12)
3. Run this script:

```javascript
// Get all models
const models = await fetch('https://tigermarinewbackend.onrender.com/api/models').then(r => r.json());
console.log('Models:', models.data);

// For each model, you can update with filenames
// Example:
const updateModel = async (modelId, imageFile) => {
  const model = models.data.find(m => m.id === modelId);
  if (!model) return;
  
  const response = await fetch(`https://tigermarinewbackend.onrender.com/api/models/${modelId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...model,
      imageFile: imageFile // e.g., "850TL - 1.jpg"
    })
  });
  
  return response.json();
};

// Usage:
// await updateModel(1, '850TL - 1.jpg');
```

### Option 2: Postman/Insomnia

1. Get model: `GET https://tigermarinewbackend.onrender.com/api/models/1`
2. Update model: `PUT https://tigermarinewbackend.onrender.com/api/models/1`
   ```json
   {
     "imageFile": "850TL - 1.jpg",
     "heroImageFile": "850TL - 2.jpg",
     "contentImageFile": "850TL - 3.jpg"
   }
   ```

## Recommended Approach

**Use Admin Dashboard** - It's the easiest and safest:
- ✅ Uploads files directly to Render
- ✅ Saves filenames to database
- ✅ Works immediately
- ✅ No shell access needed
- ✅ Visual interface

## Quick Checklist

- [ ] Admin Dashboard accessible
- [ ] Can select models from dropdown
- [ ] Upload buttons work
- [ ] "Save Changes" button works
- [ ] Images appear after refresh
- [ ] Images load on production site

## Troubleshooting

### Upload Button Doesn't Work
- Check browser console for errors
- Verify backend is awake (not sleeping)
- Check CORS settings in Render

### Images Don't Persist
- Make sure you click "Save Changes"
- Check browser console for save errors
- Verify database connection in Render logs

### Can't Find Filenames
- Check local `backend/public/images/` folder
- Filenames must match exactly (case-sensitive)
- Include file extension (.jpg, .png, etc.)

