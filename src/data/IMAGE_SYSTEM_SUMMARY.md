# Image Management System - Summary

## What Changed?

Image management is now **much easier**! Instead of manually building paths everywhere, you just:

1. **Configure folders** in `imageConfig.js` (one time per model)
2. **Specify filenames** in `models.js` (when adding models)
3. **System auto-generates** all paths!

---

## New Files

### `imageConfig.js` - Image Configuration
- **Purpose**: Central place to configure image folders and category images
- **When to edit**: When adding a new model or category
- **What to add**:
  - Model folder mapping (`modelImageFolders`)
  - Side menu image mapping (`sideMenuImages`)
  - Category images (`categoryImages`, `categoryHeroImages`)

### `HOW_TO_MANAGE_IMAGES.md` - Complete Guide
- **Purpose**: Step-by-step guide for managing images
- **When to read**: When adding new models or categories

---

## Image Types for Models

| Property | Used For | Required? |
|----------|----------|-----------|
| `imageFile` | Thumbnail in model cards | ✅ Yes |
| `heroImageFile` | Hero section on model detail page | ⚠️ Falls back to `imageFile` |
| `contentImageFile` | Images next to text content | ⚠️ Falls back to `imageFile` |
| `galleryFiles` | Image carousel/gallery | ❌ Optional |

---

## Quick Example

### Before (Old Way):
```javascript
// Had to manually build paths
image: `/images/TopLine950/${encodeFilename("DJI_0150.jpg")}`,
heroImage: `/images/TopLine950/${encodeFilename("DJI_0247.jpg")}`,
```

### After (New Way):
```javascript
// Just specify filenames!
imageFile: "DJI_0150.jpg",
heroImageFile: "DJI_0247.jpg",
contentImageFile: "DJI_0150.jpg",
galleryFiles: ["img1.jpg", "img2.jpg", "img3.jpg"]
```

**The system automatically:**
- ✅ Finds the correct folder based on model name
- ✅ Handles spaces and special characters
- ✅ Generates full paths
- ✅ Provides fallbacks if images not specified

---

## Benefits

1. **Easier to add models** - Just specify filenames
2. **Centralized config** - All image mappings in one place
3. **Auto path generation** - No manual path building
4. **Better organization** - Clear separation of concerns
5. **Easy to update** - Change folder structure in one place
6. **✨ Automatic sync** - Category images in `imageConfig.js` automatically sync to all categories!

---

## File Structure

```
src/data/
  ├── imageConfig.js          ← Configure image folders & category images
  ├── imageHelpers.js         ← Helper functions (uses imageConfig.js)
  ├── models.js               ← Specify image filenames here
  ├── HOW_TO_MANAGE_IMAGES.md ← Complete guide
  └── IMAGE_SYSTEM_SUMMARY.md ← This file
```

---

## Next Steps

1. **Read** `HOW_TO_MANAGE_IMAGES.md` for detailed instructions
2. **Check** `imageConfig.js` to see current mappings
3. **Look at** examples in `models.js` (see ML38 model)
4. **Add** your new models using the new system!

---

## Questions?

- **Where do I add image folder mappings?** → `imageConfig.js`
- **Where do I specify image filenames?** → `models.js` (in `createModel()`)
- **How do I add a new model?** → See `HOW_TO_MANAGE_IMAGES.md`
- **How do I change category images?** → Edit `imageConfig.js` - it automatically syncs! ✨
- **Can I override a category image?** → Yes, add `image` property in `models.js` for that specific category

