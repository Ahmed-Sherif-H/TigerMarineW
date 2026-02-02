# Backend: Disable Cloudinary and Use Local Storage

## Overview

This guide explains how to update your backend to stop using Cloudinary and serve images from local storage instead.

## Step 1: Update Upload Handler

### Find Your Upload Route

Locate your upload route handler, typically in:
- `routes/upload.js`
- `routes/api.js`
- `controllers/uploadController.js`

### Current Code (Cloudinary)

Your current upload handler probably looks like this:

```javascript
const cloudinaryService = require('../services/cloudinaryService');
const multer = require('multer');

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    const { folder, modelName, categoryName, partName, subfolder } = req.body;
    const file = req.file;
    
    // Determine Cloudinary folder
    let cloudinaryFolder;
    if (folder === 'images' && modelName) {
      cloudinaryFolder = `images/${modelName}`;
      if (subfolder === 'Interior') {
        cloudinaryFolder = `images/${modelName}/Interior`;
      }
    } else if (folder === 'categories' && categoryName) {
      cloudinaryFolder = `categories/${categoryName}`;
    } else if (folder === 'events') {
      cloudinaryFolder = 'images/events';
    } else if (folder === 'customizer' && modelName && partName) {
      cloudinaryFolder = `customizer/${modelName}/${partName}`;
    }
    
    // Upload to Cloudinary
    const result = await cloudinaryService.uploadFile(
      file.buffer,
      cloudinaryFolder,
      file.originalname
    );
    
    res.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      path: result.secure_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Updated Code (Local Storage)

Replace with this:

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    const { folder, modelName, categoryName, partName, subfolder } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    // Determine local folder path
    let localFolder;
    if (folder === 'images' && modelName) {
      localFolder = path.join(__dirname, '../public/images', modelName);
      if (subfolder === 'Interior') {
        localFolder = path.join(localFolder, 'Interior');
      }
    } else if (folder === 'categories' && categoryName) {
      localFolder = path.join(__dirname, '../public/images/categories', categoryName);
    } else if (folder === 'events') {
      localFolder = path.join(__dirname, '../public/images/events');
    } else if (folder === 'customizer' && modelName && partName) {
      localFolder = path.join(__dirname, '../public/Customizer-images', modelName, partName);
    } else {
      return res.status(400).json({ error: 'Invalid folder configuration' });
    }
    
    // Create folder if it doesn't exist
    await fs.mkdir(localFolder, { recursive: true });
    
    // Generate unique filename (add timestamp to avoid conflicts)
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const filename = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(localFolder, filename);
    
    // Save file to disk
    await fs.writeFile(filePath, file.buffer);
    
    // Build URL path (relative to public folder)
    let urlPath;
    if (folder === 'images' && modelName) {
      urlPath = subfolder === 'Interior' 
        ? `/images/${modelName}/Interior/${filename}`
        : `/images/${modelName}/${filename}`;
    } else if (folder === 'categories' && categoryName) {
      urlPath = `/images/categories/${categoryName}/${filename}`;
    } else if (folder === 'events') {
      urlPath = `/images/events/${filename}`;
    } else if (folder === 'customizer' && modelName && partName) {
      urlPath = `/Customizer-images/${modelName}/${partName}/${filename}`;
    }
    
    res.json({
      success: true,
      url: urlPath,
      filename: filename,
      path: urlPath
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Update Multiple File Upload

If you have a multiple file upload route, update it similarly:

```javascript
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    const { folder, modelName, partName } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }
    
    // Determine local folder (same logic as single upload)
    let localFolder;
    // ... (same folder logic as above)
    
    await fs.mkdir(localFolder, { recursive: true });
    
    const uploadedFiles = [];
    
    for (const file of files) {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const filename = `${baseName}_${timestamp}${ext}`;
      const filePath = path.join(localFolder, filename);
      
      await fs.writeFile(filePath, file.buffer);
      
      // Build URL path
      let urlPath;
      // ... (same URL building logic as single upload)
      
      uploadedFiles.push({
        url: urlPath,
        filename: filename,
        path: urlPath
      });
    }
    
    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

## Step 2: Update Delete Handler

### Current Code (Cloudinary)

```javascript
router.delete('/delete', async (req, res) => {
  try {
    const { filePath, public_id } = req.body;
    
    // Delete from Cloudinary
    const idToDelete = public_id || cloudinaryService.extractPublicId(filePath);
    await cloudinaryService.deleteFile(idToDelete);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Updated Code (Local Storage)

```javascript
router.delete('/delete', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required' });
    }
    
    // Convert URL path to file system path
    // Example: /images/TopLine950/image.jpg -> public/images/TopLine950/image.jpg
    const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullPath = path.join(__dirname, '../public', relativePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete file
    await fs.unlink(fullPath);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

## Step 3: Ensure Static File Serving

Make sure your Express app serves static files from the `public` folder:

```javascript
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from public folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/Customizer-images', express.static(path.join(__dirname, 'public/Customizer-images')));

// ... rest of your app configuration
```

## Step 4: Remove Cloudinary Dependencies (Optional)

After migration is complete and verified:

1. **Remove Cloudinary package**:
   ```bash
   npm uninstall cloudinary
   ```

2. **Remove Cloudinary service file** (if exists):
   - Delete `services/cloudinaryService.js`

3. **Remove Cloudinary environment variables** from `.env`:
   ```
   # CLOUDINARY_CLOUD_NAME=...
   # CLOUDINARY_API_KEY=...
   # CLOUDINARY_API_SECRET=...
   ```

4. **Remove Cloudinary imports** from your code

## Step 5: Test Uploads

1. **Test single file upload**:
   - Go to Admin Dashboard
   - Upload a test image
   - Verify it saves to `backend/public/images/`
   - Verify it displays correctly on frontend

2. **Test multiple file upload**:
   - Upload multiple gallery images
   - Verify all save correctly

3. **Test file deletion**:
   - Delete a test image
   - Verify file is removed from disk

## Important Notes

1. **File Size Limits**: 
   - Update multer limits if needed
   - Consider compression for large images

2. **Folder Permissions**:
   - Ensure backend has write permissions to `public/images/`
   - On Railway/Render, this should work automatically

3. **Backup**:
   - Keep a backup of your database before migration
   - Keep downloaded Cloudinary images as backup

4. **Performance**:
   - Local storage is faster than Cloudinary
   - No bandwidth limits
   - No external API calls

## Troubleshooting

### Files not saving

- Check folder permissions
- Verify `public/images/` folder exists
- Check disk space on server

### Files not serving

- Verify static file middleware is configured
- Check file paths match URL paths
- Clear browser cache

### 404 errors

- Ensure files are in correct folder structure
- Check filename matches database entry exactly
- Verify static serving is working
