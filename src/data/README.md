# Models Data - Main File

## ✅ **`models.js` is THE Main File**

**All boat data is now in `models.js`** - this is where you add/edit categories and models.

## 🖼️ **Easy Image Management**

**New!** Image management is now super easy:
- **`imageConfig.js`** - Configure image folders and category images
- **`models.js`** - Just specify image filenames (paths auto-generated!)
- **See `HOW_TO_MANAGE_IMAGES.md`** for complete guide

When adding a new model, just specify:
- `imageFile` - Thumbnail for model cards
- `heroImageFile` - Hero section image
- `contentImageFile` - Image next to text (optional)
- `galleryFiles` - Array of gallery images (optional)

## 📁 **File Structure**

### `models.js` - **MAIN FILE** (Edit Here!)
- ✅ Contains **ALL** boat categories (inflatable + rigid)
- ✅ Contains helper functions for automatic image path generation
- ✅ Supports `standardFeatures` and `optionalFeatures`
- ✅ Contains other data (dealers, colors, fabrics, upcoming models)
- ✅ **This is where you add/edit everything!**

### `categoriesConfig.js` - **Backward Compatibility** (Don't Edit!)
- ✅ Just re-exports from `models.js`
- ✅ Maintains backward compatibility for existing code

## 🚤 **Boat Categories in `models.js`**

### Inflatable Boats (Categories 1-5)
1. **MaxLine** - Ultimate luxury and performance
2. **TopLine** - Premium comfort and technology
3. **ProLine** - Professional-grade performance
4. **SportLine** - High-performance adventure
5. **Open** - Open-deck connection

### Rigid Boats (Categories 6+)
6. **Infinity** - Premium rigid boats
7. **Striker** - Performance rigid boats
8. *(Add more categories here)*

## ✨ **How to Add a Boat**

### Step 1: Open `models.js`

### Step 2: Find the Category
- Inflatable boats: Categories 1-5
- Rigid boats: Categories 6+

### Step 3: Add to Models Array
```javascript
{
  name: "Model Name",
  description: "Full description",
  shortDescription: "Short tagline",
  imageFile: "image.jpg",  // Just filename - path auto-generated!
  heroImageFile: "hero.jpg",  // Just filename - path auto-generated!
  specs: {
    length: "9.5 m",
    beam: "3.2 m",
    // ... all specs from Excel
  },
  standardFeatures: [
    "Feature 1",
    "Feature 2",
    // ... all standard features from Excel
  ],
  optionalFeatures: [
    {
      name: "Optional Feature",
      description: "Description",
      category: "Category",
      price: "Price"
    }
    // ... all optional features from Excel
  ]
}
```

### Step 4: Save - Done! 🎉

## 📝 **Data Structure**

All boats use the same structure:
- `name` - Model name
- `description` - Full description
- `shortDescription` - Brief tagline
- `imageFile` - Main image filename (path auto-generated)
- `heroImageFile` - Hero image filename (path auto-generated)
- `specs` - All specifications
- `standardFeatures` - Included features
- `optionalFeatures` - Optional upgrades

## 🔄 **Exports from `models.js`**

- `allCategories` - All boat categories
- `inflatableBoats` - Inflatable boat categories (1-5)
- `boatsCategories` - Rigid boat categories (6+)
- `boatCategories` - Alias for inflatableBoats (backward compatibility)
- `allBoats` - Alias for allCategories
- `upcomingModels` - Coming soon models
- `dealers` - Dealer locations
- `colorOptions` - Color selection options
- `fabricOptions` - Fabric selection options

## 💡 **Key Points**

- ✅ **Edit boats in**: `models.js` (THIS FILE!)
- ✅ **All boats use**: Same structure and helper functions
- ✅ **Image paths**: Auto-generated (just use filenames)
- ✅ **Features**: Support standard and optional
- ✅ **One file**: Everything in `models.js`

## 📚 **See Also**

- `README_BOAT_DATA.md` - Detailed guide for adding boats from Excel
- `boatDataExample.js` - Complete examples
- `boatDataTemplate.js` - Data structure template
