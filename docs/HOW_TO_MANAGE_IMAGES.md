# How to Manage Images - Easy Guide

This guide explains how to easily manage images for models and categories when adding new products.

## Quick Overview

When you add a new model or category, you just need to:
1. **Add image folder mapping** in `src/data/imageConfig.js`
2. **Specify image filenames** in `src/data/models.js`
3. **Place images** in the correct folders

That's it! The system automatically generates all image paths.

---

## Image Types Explained

### For Models:

1. **Thumbnail Image** (`imageFile`)
   - Used in: Model cards on the "All Models" page
   - Example: `"IMG_3213.jpg"`

2. **Hero Image** (`heroImageFile`)
   - Used in: Full-screen hero section at the top of model detail page
   - Example: `"DJI_0247.jpg"`

3. **Content Image** (`contentImageFile`)
   - Used in: Images next to text content on model detail page
   - Example: `"DJI_0150.jpg"`

4. **Gallery Images** (`galleryFiles`)
   - Used in: Image carousel/gallery on model detail page
   - Example: `["image1.jpg", "image2.jpg", "image3.jpg"]`

5. **Side Menu Image** (auto-generated)
   - Used in: Side menu preview when hovering over model name
   - Configured in: `src/data/imageConfig.js` → `sideMenuImages`

### For Categories:

1. **Category Image** (`image`)
   - Used in: Category cards on home page and category listing pages
   - Configured in: `src/data/imageConfig.js` → `categoryImages`

2. **Category Hero Image** (`heroImage`)
   - Used in: Hero section on category detail pages
   - Configured in: `src/data/imageConfig.js` → `categoryHeroImages`

---

## Step-by-Step: Adding Images for a New Model

### Step 1: Add Model Folder Mapping

Open `src/data/imageConfig.js` and add your model to `modelImageFolders`:

```javascript
export const modelImageFolders = {
  // ... existing models ...
  
  // Add your new model here:
  'NewModel': 'NewModelFolder',  // Model name → folder name in /images
};
```

**Example:**
```javascript
'TL950': 'TopLine950',  // Model "TL950" uses folder "/images/TopLine950/"
```

### Step 2: Add Side Menu Image

In the same file, add to `sideMenuImages`:

```javascript
export const sideMenuImages = {
  // ... existing models ...
  
  // Add your new model here:
  'NewModel': 'NewModel-sideMenu.png',  // Image in /images/SideMenu/
};
```

### Step 3: Specify Image Files in models.js

Open `src/data/models.js` and when creating your model, specify the image files:

```javascript
createModel('NewModel', {
  // ... other model data ...
  
  // Image files (just filenames, paths auto-generated!)
  imageFile: "thumbnail.jpg",           // For model cards
  heroImageFile: "hero-image.jpg",      // For hero section
  contentImageFile: "content-image.jpg", // For images next to text
  galleryFiles: [                       // For gallery carousel
    "gallery1.jpg",
    "gallery2.jpg",
    "gallery3.jpg"
  ],
  
  // ... rest of model data ...
})
```

**Important:** Just use filenames! The system automatically:
- Finds the correct folder based on model name
- Handles spaces and special characters
- Generates full paths

### Step 4: Place Images in Folder

Place your images in the correct folder structure:

```
public/
  images/
    NewModelFolder/          ← Your model's folder
      thumbnail.jpg
      hero-image.jpg
      content-image.jpg
      gallery1.jpg
      gallery2.jpg
      gallery3.jpg
    SideMenu/
      NewModel-sideMenu.png   ← Side menu preview
```

---

## Step-by-Step: Adding Images for a New Category

### Step 1: Add Category Images (AUTOMATIC SYNC!)

**✨ NEW: Images automatically sync from `imageConfig.js`!**

Open `src/data/imageConfig.js` and add to `categoryImages` and `categoryHeroImages`:

```javascript
export const categoryImages = {
  // ... existing categories ...
  
  'NewCategory': '/images/new-category.jpg',
};

export const categoryHeroImages = {
  // ... existing categories ...
  
  'NewCategory': '/images/new-category-hero.jpg',
};
```

**That's it!** The system automatically uses these images for the category. No need to edit `models.js`!

### Step 2: Place Category Images

Place your images in `public/images/`:

```
public/
  images/
    new-category.jpg        ← Category card image
    new-category-hero.jpg   ← Category hero image
```

### How Automatic Sync Works

The system uses this priority order:
1. **Explicit `image` in `models.js`** (if you want to override)
2. **Image from `imageConfig.js`** ← **Source of truth!**
3. Fallback to first model's image (only if not in config)

**To change a category image:** Just edit `imageConfig.js` and it automatically updates everywhere!

---

## Image File Naming Tips

1. **Use descriptive names**: `hero-main.jpg`, `interior-shot.jpg`
2. **Avoid spaces if possible**: Use `-` or `_` instead
3. **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
4. **Case sensitive**: `Image.jpg` ≠ `image.jpg` (be consistent!)

---

## Examples

### Example 1: Adding a Simple Model

```javascript
// In imageConfig.js
modelImageFolders: {
  'SL480': 'SportLine480',
}
sideMenuImages: {
  'SL480': 'SportLine-480.png',
}

// In models.js
createModel('SL480', {
  imageFile: "SL480-main.jpg",
  heroImageFile: "SL480-hero.jpg",
  // ... other data ...
})
```

### Example 2: Adding a Model with Gallery

```javascript
createModel('TL950', {
  imageFile: "DJI_0150.jpg",
  heroImageFile: "DJI_0247.jpg",
  contentImageFile: "DJI_0150.jpg",
  galleryFiles: [
    "DJI_0150.jpg",
    "DJI_0247.jpg",
    "interior-1.jpg",
    "interior-2.jpg",
    "exterior-1.jpg"
  ],
  // ... other data ...
})
```

### Example 3: Using Same Image for Multiple Purposes

If you want to use the same image for thumbnail, hero, and content:

```javascript
createModel('ML38', {
  imageFile: "IMG_3213.jpg",  // This will be used for all if others not specified
  // heroImageFile and contentImageFile will fallback to imageFile
  // ... other data ...
})
```

---

## Troubleshooting

### Image Not Showing?

1. **Check folder name**: Make sure it matches in `imageConfig.js`
2. **Check filename**: Make sure it matches exactly (case-sensitive!)
3. **Check file location**: Image should be in `public/images/[ModelFolder]/`
4. **Check browser console**: Look for 404 errors

### Image Path Has Spaces?

The system automatically handles spaces and special characters, but if you have issues:
- Use `encodeFilename()` helper function
- Or rename files to remove spaces

### Want to Override Default Image?

**Option 1: Edit `imageConfig.js`** (Recommended - changes everywhere automatically)
```javascript
export const categoryImages = {
  'MaxLine': '/images/custom-category.jpg',  // Change here
  // ...
};
```

**Option 2: Override in `models.js`** (Only if you need category-specific override)
```javascript
createCategory({
  name: "MaxLine",
  image: "/images/custom-category.jpg",  // Overrides imageConfig.js
  heroImage: "/images/custom-hero.jpg",  // Overrides imageConfig.js
  // ... other data ...
})
```

**Note:** Changes in `imageConfig.js` automatically sync to all categories. Only use `models.js` override if you need a specific category to use a different image.

---

## Quick Reference

| Image Type | Property | Used In | Config File |
|------------|----------|---------|-------------|
| Thumbnail | `imageFile` | Model cards | `models.js` |
| Hero | `heroImageFile` | Model detail hero | `models.js` |
| Content | `contentImageFile` | Text sections | `models.js` |
| Gallery | `galleryFiles` | Image carousel | `models.js` |
| Side Menu | - | Side menu preview | `imageConfig.js` |
| Category | `image` | Category cards | `imageConfig.js` |
| Category Hero | `heroImage` | Category detail | `imageConfig.js` |

---

## Need Help?

- Check `src/data/imageConfig.js` for all image mappings
- Check `src/data/models.js` for model image examples
- Check `src/data/imageHelpers.js` for helper functions

