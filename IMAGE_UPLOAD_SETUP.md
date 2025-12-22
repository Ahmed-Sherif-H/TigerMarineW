# Image Upload Setup - Complete Guide

## ✅ What's Been Done

### 1. **Backend Setup**
- ✅ Updated `server.js` to serve images from `backend/public/images/` and `backend/public/Customizer-images/`
- ✅ Created upload route at `/api/upload` with endpoints:
  - `POST /api/upload/single` - Upload single file
  - `POST /api/upload/multiple` - Upload multiple files
  - `GET /api/upload/list` - List files in a folder
  - `DELETE /api/upload/delete` - Delete a file

### 2. **Frontend Setup**
- ✅ Updated `imagePathUtils.js` to use backend URLs (`http://localhost:3001/images/...`)
- ✅ Updated `transformModelData.js` to use backend URLs for categories
- ✅ Added upload methods to `api.js` service
- ✅ Created `ImageUpload.jsx` component for easy file uploads

## 📁 Folder Structure

```
backend/
  └── public/
      ├── images/
      │   ├── TopLine850/
      │   ├── TopLine950/
      │   └── ... (all model folders)
      └── Customizer-images/
          ├── TL850/
          │   ├── base/
          │   ├── deck floor/
          │   └── ...
          └── ...
```

## 🚀 How to Add Upload to AdminDashboard

### Step 1: Import the component
Add to `src/pages/AdminDashboard.jsx`:
```jsx
import ImageUpload from '../components/ImageUpload';
```

### Step 2: Add upload handlers
Add these functions in the AdminDashboard component:
```jsx
const handleImageUpload = (field, filename) => {
  updateField(field, filename);
};

const handleGalleryUpload = (filenames) => {
  setEditedData(prev => ({
    ...prev,
    galleryFiles: [...(prev.galleryFiles || []), ...filenames]
  }));
};

const handleVideoUpload = (filenames) => {
  setEditedData(prev => ({
    ...prev,
    videoFiles: [...(prev.videoFiles || []), ...filenames]
  }));
};

const handleInteriorUpload = (filenames) => {
  setEditedData(prev => ({
    ...prev,
    interiorFiles: [...(prev.interiorFiles || []), ...filenames]
  }));
};
```

### Step 3: Add upload components in the form
Replace the text input fields with ImageUpload components:

**For single images:**
```jsx
<ImageUpload
  label="Main Image"
  currentValue={editedData.imageFile}
  onUpload={(filename) => handleImageUpload('imageFile', filename)}
  folder="images"
  modelName={editedData.name}
/>

<ImageUpload
  label="Hero Image"
  currentValue={editedData.heroImageFile}
  onUpload={(filename) => handleImageUpload('heroImageFile', filename)}
  folder="images"
  modelName={editedData.name}
/>

<ImageUpload
  label="Content Image"
  currentValue={editedData.contentImageFile}
  onUpload={(filename) => handleImageUpload('contentImageFile', filename)}
  folder="images"
  modelName={editedData.name}
/>
```

**For multiple files:**
```jsx
<ImageUpload
  label="Gallery Images"
  currentValue={editedData.galleryFiles?.join(', ')}
  onUpload={handleGalleryUpload}
  folder="images"
  modelName={editedData.name}
  multiple={true}
/>

<ImageUpload
  label="Video Files"
  currentValue={editedData.videoFiles?.join(', ')}
  onUpload={handleVideoUpload}
  folder="images"
  modelName={editedData.name}
  accept="video/*"
  multiple={true}
/>

<ImageUpload
  label="Interior Images"
  currentValue={editedData.interiorFiles?.join(', ')}
  onUpload={handleInteriorUpload}
  folder="images"
  modelName={editedData.name}
  multiple={true}
/>
```

## 🔧 Testing

1. **Restart backend** (if needed):
   ```bash
   cd backend
   npm run dev
   ```

2. **Test image serving**:
   - Visit: `http://localhost:3001/images/TopLine850/[any-image].jpg`
   - Should see the image

3. **Test upload**:
   - Go to AdminDashboard
   - Select a model or create new one
   - Use the upload buttons to upload images
   - Images will be saved to `backend/public/images/[ModelName]/`

## 📝 Notes

- **File size limit**: 50MB per file
- **Allowed types**: jpg, jpeg, png, gif, webp, mp4, mov, avi
- **Folder structure**: Automatically created if it doesn't exist
- **Model name required**: Upload is disabled until model name is saved

## 🎯 Next Steps

1. Add the ImageUpload component to AdminDashboard (see instructions above)
2. Test uploading images
3. Verify images appear on frontend pages
4. Add delete functionality if needed


