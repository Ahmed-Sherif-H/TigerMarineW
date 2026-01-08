# Backend Update Required: interiorMainImage Field

## Issue
The `interiorMainImage` field is not being saved/loaded because the backend database schema doesn't include it.

## Required Backend Changes

### 1. Update Prisma Schema

Add `interiorMainImage` field to the `Model` schema in `backend/prisma/schema.prisma`:

```prisma
model Model {
  id                Int      @id @default(autoincrement())
  name              String
  description       String?
  shortDescription  String?
  categoryId        Int
  imageFile         String?
  heroImageFile     String?
  contentImageFile  String?
  interiorMainImage String?  // ADD THIS LINE - for left interior image
  // ... other fields ...
  
  galleryImages     GalleryImage[]
  videoFiles        VideoFile[]
  interiorFiles     InteriorFile[]  // This is for the carousel
  // ... other relations ...
}
```

### 2. Run Migration

```bash
cd backend
npx prisma migrate dev --name add_interior_main_image
npx prisma generate
```

### 3. Update Backend Service

In `backend/services/modelsService.js`, ensure the `updateModel` and `createModel` functions handle `interiorMainImage`:

```javascript
// In updateModel function
const updateData = {
  // ... other fields ...
  interiorMainImage: extractFilename(modelData.interiorMainImage || ''),
  // ... rest of fields ...
};
```

### 4. Verify Backend Returns the Field

The backend should return `interiorMainImage` when fetching models. Check `backend/services/modelsService.js` in the `transformModel` function to ensure it includes:

```javascript
interiorMainImage: model.interiorMainImage || null,
```

## Testing

After updating the backend:

1. Upload a left interior image in Admin Dashboard
2. Save the model
3. Check browser console for:
   - `[AdminDashboard] Interior main image after normalization:` - Should show the filename
   - `[AdminDashboard] Saving model data:` - Should include `interiorMainImage`
   - `[ModelDetail] Interior main image path:` - Should show the full path after reload

4. Reload the model detail page - the left image should appear

## Current Status

- ✅ Frontend is ready (AdminDashboard, ModelDetail, transformModelData all updated)
- ✅ Frontend sends `interiorMainImage` in save requests
- ❌ Backend database schema needs `interiorMainImage` field
- ❌ Backend service needs to save/return `interiorMainImage`

