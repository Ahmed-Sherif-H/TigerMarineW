# Backend Images Setup

## ✅ What's Been Done

### 1. **Backend Static File Server**
- Updated `server.js` to serve images from `backend/images/` folder
- Images are now accessible at: `http://localhost:3001/images/...`

### 2. **Frontend Image Path Utilities**
- Updated `src/utils/imagePathUtils.js` to point to backend URLs
- All image paths now use: `http://localhost:3001/images/...` instead of `/images/...`

### 3. **Data Transformation**
- Updated `transformModelData.js` to use backend URLs for all images
- Category images also point to backend

## 📁 Folder Structure

```
backend/
  ├── images/          ← Your images folder (NEW)
  │   ├── TopLine850/
  │   ├── TopLine950/
  │   ├── ProLine620/
  │   └── ... (all model folders)
  ├── server.js        ← Updated to serve images
  └── ...
```

## 🔧 How It Works

1. **Backend serves images**: Express static middleware serves files from `backend/images/`
2. **Frontend requests**: All image requests go to `http://localhost:3001/images/...`
3. **CORS**: Already configured to allow frontend origins

## 🚀 Testing

1. **Restart backend** (if not already running):
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify images are accessible**:
   - Visit: `http://localhost:3001/images/TopLine850/[any-image].jpg`
   - Should see the image

3. **Check frontend**:
   - Refresh browser (hard refresh: Ctrl+Shift+R)
   - Images should now load from backend

## 📝 Notes

- All model images should be in: `backend/images/[ModelFolder]/`
- Category images should be in: `backend/images/[CategoryName]/`
- The backend automatically serves these files
- No need to move images back to frontend

## ⚠️ Important

Make sure your `backend/images/` folder structure matches:
```
backend/images/
  ├── TopLine850/
  │   ├── image1.jpg
  │   ├── image2.jpg
  │   └── ...
  ├── TopLine950/
  ├── ProLine620/
  └── ...
```

If your folder names are different, update the `modelFolderMap` in `src/utils/imagePathUtils.js`


