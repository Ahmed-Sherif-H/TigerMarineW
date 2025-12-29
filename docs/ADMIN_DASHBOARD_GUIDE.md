# Admin Dashboard - Complete Guide

## Access

**Production:** https://tigermarineweb.netlify.app/admin  
**Local:** http://localhost:5173/admin

## Uploading Images (Step-by-Step)

### For Each Model:

1. **Select Model**
   - Open dropdown at top
   - Choose a model (e.g., "TL850")
   - Wait for data to load

2. **Upload Main Images**
   - **Image File (Thumbnail):**
     - Click "Upload" button next to "Image filename" field
     - Select image file
     - Filename auto-fills
   
   - **Hero Image:**
     - Click "Upload" button next to "Hero image filename"
     - Select image file
     - Filename auto-fills
   
   - **Content Image:**
     - Click "Upload" button next to "Content image filename"
     - Select image file
     - Filename auto-fills

3. **Upload Gallery Images**
   - Click "Upload Gallery Image" button
   - Select one or multiple images
   - Filenames automatically added to list
   - Can add more or remove unwanted ones

4. **Upload Interior Images**
   - Click "Upload Interior Image" button
   - Select one or multiple images
   - These go to `[ModelName]/Interior/` folder
   - Filenames automatically added

5. **Upload Videos**
   - Click "Upload Video" button
   - Select video files
   - Filenames automatically added

6. **Save Changes**
   - Scroll to bottom
   - Click "Save Changes" button
   - Wait for success message
   - **Important:** Must click Save or changes are lost!

7. **Verify**
   - Refresh the page
   - Images should persist
   - Check production site - images should load

## Manual Filename Entry

If images already exist on Render but database is empty:

1. **Find Filenames**
   - Check local `backend/public/images/[ModelName]/` folder
   - Note exact filenames (case-sensitive, including spaces)
   - Example: `850TL - 1.jpg` (note the spaces)

2. **Enter in Admin Dashboard**
   - Select model
   - Type filename in input field
   - Example: `850TL - 1.jpg`
   - Click "Save Changes"

3. **For Multiple Images**
   - Gallery: Click "Add Manually" → Type filename → Repeat
   - Interior: Click "Add Manually" → Type filename → Repeat
   - Videos: Click "Add Manually" → Type filename → Repeat

## Tips

### ✅ Do:
- Upload images one model at a time
- Click "Save Changes" after each model
- Use descriptive filenames
- Verify images after saving

### ❌ Don't:
- Forget to click "Save Changes"
- Use full paths (just filenames)
- Upload without selecting a model first
- Close page before saving

## Troubleshooting

### Upload Button Grayed Out
- Make sure model is selected
- Wait for model data to load
- Check browser console for errors

### Upload Fails
- Check file size (max 50MB)
- Verify file type is allowed
- Check backend is awake (not sleeping)
- Wait 30-60 seconds if backend just woke up

### Images Don't Persist
- **Did you click "Save Changes"?** (Most common issue!)
- Check for error messages
- Verify database connection
- Check browser console for errors

### Can't See Uploaded Images
- Refresh the page
- Check image URLs in browser console
- Verify filenames match exactly
- Check Render backend logs

## Quick Workflow

```
For each model:
1. Select model → Wait for load
2. Upload Image File → Auto-fills
3. Upload Hero Image → Auto-fills
4. Upload Content Image → Auto-fills
5. Upload Gallery Images → Auto-adds to list
6. Upload Interior Images → Auto-adds to list
7. Upload Videos → Auto-adds to list
8. Click "Save Changes" → Wait for success
9. Refresh → Verify images persist
10. Check production site → Images should load
```

## Time Estimate

- **Per model:** 2-5 minutes
- **All models:** 30-60 minutes (depending on number of images)

## Best Practice

1. Start with one model to test
2. Verify it works on production
3. Then do remaining models
4. Save frequently
5. Verify as you go

