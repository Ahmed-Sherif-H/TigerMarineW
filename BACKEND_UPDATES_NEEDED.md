# Backend Updates Needed for Events and Cloudinary

## Summary

The backend upload route (`backend/routes/upload.js`) needs to be updated to:
1. ✅ Use Cloudinary instead of local filesystem (already has `cloudinaryService.js`)
2. ✅ Handle the 'events' folder for event image uploads
3. ✅ Return Cloudinary URLs in the response format

## Required Changes

### 1. Update `backend/routes/upload.js`

**Current Issue:**
- Uses `multer.diskStorage` (saves to local filesystem)
- Doesn't handle 'events' folder
- Returns local file paths instead of Cloudinary URLs

**Required Changes:**

#### A. Change from `diskStorage` to `memoryStorage`

```javascript
// OLD (current):
const storage = multer.diskStorage({
  destination: async (req, file, cb) => { ... },
  filename: (req, file, cb) => { ... }
});

// NEW (needed):
const storage = multer.memoryStorage();
```

#### B. Add CloudinaryService import

```javascript
const cloudinaryService = require('../services/cloudinaryService');
```

#### C. Update upload handler to use Cloudinary

In the `/single` route handler, replace the file saving logic with Cloudinary upload:

```javascript
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    const folder = req.body?.folder;
    const modelName = req.body?.modelName;
    const categoryName = req.body?.categoryName;
    const subfolder = req.body?.subfolder;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    // Determine Cloudinary folder path
    let cloudinaryFolder;
    
    if (folder === 'images' && modelName === 'events') {
      // Events folder
      cloudinaryFolder = 'images/events';
    } else if (folder === 'images' && modelName) {
      // Model images
      const folderName = getModelFolderName(modelName);
      cloudinaryFolder = subfolder === 'Interior' 
        ? `models/${folderName}/Interior`
        : `models/${folderName}`;
    } else if (folder === 'categories' && categoryName) {
      // Category images
      cloudinaryFolder = `categories/${categoryName}`;
    } else if (folder === 'customizer' && modelName && req.body?.partName) {
      // Customizer images
      cloudinaryFolder = `customizer/${modelName}/${req.body.partName}`;
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid folder configuration' 
      });
    }

    // Upload to Cloudinary
    const result = await cloudinaryService.uploadFile(
      req.file.buffer,
      cloudinaryFolder,
      req.file.originalname
    );

    // Return Cloudinary URL
    res.json({
      success: true,
      url: result.secure_url, // Full Cloudinary URL
      public_id: result.public_id,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});
```

#### D. Update multiple upload handler similarly

```javascript
router.post('/multiple', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No files uploaded' 
      });
    }

    // Determine Cloudinary folder (same logic as single upload)
    const folder = req.body?.folder;
    const modelName = req.body?.modelName;
    // ... (same folder logic)

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => 
      cloudinaryService.uploadFile(
        file.buffer,
        cloudinaryFolder,
        file.originalname
      )
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      files: results.map((result, index) => ({
        url: result.secure_url,
        public_id: result.public_id,
        filename: req.files[index].originalname
      }))
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});
```

### 2. Update Delete Route for Cloudinary

```javascript
router.delete('/delete', async (req, res) => {
  try {
    const { url, public_id } = req.body;
    
    if (!url && !public_id) {
      return res.status(400).json({ 
        success: false,
        error: 'URL or public_id is required' 
      });
    }

    // Extract public_id from URL if needed
    const idToDelete = public_id || cloudinaryService.extractPublicId(url);
    
    if (!idToDelete) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid Cloudinary URL or public_id' 
      });
    }

    await cloudinaryService.deleteFile(idToDelete);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});
```

## Environment Variables

Make sure these are set in Railway:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Testing After Update

1. **Test Event Upload:**
   - Upload an event image from dashboard
   - Should return Cloudinary URL
   - Should appear in `images/events/` folder in Cloudinary

2. **Test Model Upload:**
   - Upload a model image
   - Should return Cloudinary URL
   - Should appear in `models/[ModelName]/` folder

3. **Test Category Upload:**
   - Upload a category image
   - Should return Cloudinary URL
   - Should appear in `categories/[CategoryName]/` folder

## Notes

- The `cloudinaryService.js` already exists and is configured
- The frontend is already updated to handle Cloudinary URLs
- After updating, all new uploads will go to Cloudinary
- Legacy filenames in database will still work (frontend handles them)
