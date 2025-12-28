# Image Management Guide

## Overview

Images are stored in the **backend** (`backend/public/images` and `backend/public/Customizer-images`). The frontend public folder images are **not used** in production - all images should be uploaded through the Admin Dashboard.

## Image Structure

### Backend Image Folders

```
backend/public/
├── images/
│   ├── TopLine950/
│   ├── TopLine850/
│   ├── Open650/
│   │   └── Interior/  (for interior images)
│   └── ...
└── Customizer-images/
    ├── Open650/
    │   ├── Base/
    │   ├── Tube/
    │   └── ...
    └── ...
```

## Using the Admin Dashboard

### Access
Navigate to: `https://tigermarineweb.netlify.app/admin`

### Uploading Images

1. **Select a Model** from the dropdown
2. **Wait for model data to load**

#### Main Images (Thumbnail, Hero, Content)
- Each has an **Upload** button next to the filename input
- Click **Upload** → Select image file → Automatically fills the filename
- Images are uploaded to: `backend/public/images/[ModelName]/`

#### Gallery Images
- Click **Upload Gallery Image** → Select one or multiple images
- Images are uploaded to: `backend/public/images/[ModelName]/`
- Filenames are automatically added to the gallery list

#### Interior Images
- Click **Upload Interior Image** → Select one or multiple images
- Images are uploaded to: `backend/public/images/[ModelName]/Interior/`
- Filenames are automatically added to the interior list

#### Video Files
- Click **Upload Video** → Select one or multiple video files
- Videos are uploaded to: `backend/public/images/[ModelName]/`
- Filenames are automatically added to the video list

### Manual Entry
- You can also manually type filenames in the input fields
- Use **Add Manually** button to add empty entries for gallery/interior/video lists

### Saving Changes
- After uploading images or editing data, click **Save Changes** at the bottom
- This updates the database with the new image filenames

## Image Paths

Images are served from the backend:
- Production: `https://tigermarinewbackend.onrender.com/images/[ModelName]/[filename]`
- The frontend automatically constructs these URLs

## Troubleshooting

### Images Not Showing
1. Check that the filename in the database matches the actual file name
2. Verify the image exists in the backend `public/images` folder
3. Check browser console for 404 errors
4. Ensure the model name matches the folder name exactly

### Upload Fails
1. Check file size (max 50MB)
2. Verify file type is allowed (jpg, png, gif, webp, mp4, mov, avi)
3. Check backend logs on Render for errors
4. Verify CORS settings allow uploads from Netlify

### Images in Wrong Location
- Make sure you're uploading to the correct section (Gallery vs Interior)
- Interior images go to `[ModelName]/Interior/` subfolder
- Gallery/Video images go directly to `[ModelName]/` folder

## Best Practices

1. **Use descriptive filenames**: `IMG_1234.jpg` → `TopLine850_Exterior_1.jpg`
2. **Optimize images** before uploading (compress large files)
3. **Keep consistent naming** across similar images
4. **Upload in batches** using the multiple file selection
5. **Save frequently** after making changes

## Migration from Frontend Public Folder

If you have images in `frontend/public/images`, you need to:
1. Copy them to `backend/public/images` (matching folder structure)
2. Update the database with correct filenames using the Admin Dashboard
3. Remove old images from frontend public folder (optional, for cleanup)

