# Category Images Backend Setup

## Issue
Category images uploaded through the Admin Dashboard are not persisting. This is likely because the backend needs to:

1. **Create folder structure** for category images
2. **Handle category uploads** correctly
3. **Save filenames** (not paths) to the database

## Required Backend Setup

### Folder Structure
The backend should create this folder structure when uploading category images:

```
backend/public/images/categories/
├── TopLine/
│   ├── thumbnail.jpg
│   └── hero.jpg
├── ProLine/
│   ├── thumbnail.jpg
│   └── hero.jpg
└── [CategoryName]/
    ├── [image-filename]
    └── [heroImage-filename]
```

### Backend Upload Route Check

The backend upload route (`backend/routes/upload.js`) should handle category uploads like this:

```javascript
// When folder === 'categories'
if (req.body.folder === 'categories' && req.body.categoryName) {
  const categoryName = req.body.categoryName;
  const uploadPath = path.join(__dirname, '../public/images/categories', categoryName);
  
  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  // Configure multer destination
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  
  // Return just the filename (not full path)
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
}
```

### Response Format
The backend should return:

```json
{
  "success": true,
  "filename": "image.jpg"  // Just filename, NOT "/images/categories/CategoryName/image.jpg"
}
```

### Database Storage
The backend should save **only the filename** to the database:

```javascript
// In categoriesService.js or categoriesController.js
category.image = extractFilename(uploadResult.filename); // Just "image.jpg"
category.heroImage = extractFilename(uploadResult.filename); // Just "hero.jpg"
```

## Frontend Expectations

The frontend expects:
- **Upload response**: `{ filename: "image.jpg" }` (just filename)
- **Database storage**: Just filename (e.g., `"image.jpg"`)
- **Path construction**: Frontend builds full path: `/images/categories/[CategoryName]/image.jpg`

## Testing

1. Upload a category image through Admin Dashboard
2. Check browser console for:
   - `[API] Upload successful:` - Should show `{ filename: "image.jpg" }`
   - `[AdminDashboard] Saving category data:` - Should show just filename
3. Check backend logs to verify:
   - Folder was created: `backend/public/images/categories/[CategoryName]/`
   - File was saved
   - Database was updated with just filename

## Current Frontend Code

The frontend is already:
- ✅ Sending `categoryName` in FormData
- ✅ Extracting filename from upload response
- ✅ Normalizing data before saving (extracting filenames from paths)
- ✅ Building correct paths for display

The issue is likely in the **backend** not creating folders or not saving filenames correctly.

