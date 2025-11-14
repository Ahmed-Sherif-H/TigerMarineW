# Unified Boat Data Structure

## ✅ **All Boat Data in One Place!**

All boat data (inflatable and rigid) is now consolidated in **`categoriesConfig.js`**.

## 📁 **File Structure**

### `categoriesConfig.js` - **MAIN FILE** (Edit Here!)
- ✅ Contains **ALL** boat categories (inflatable + rigid)
- ✅ Uses helper functions for automatic image path generation
- ✅ Supports `standardFeatures` and `optionalFeatures`
- ✅ Easy to add/edit boats

### `models.js` - **Export File** (Don't Edit!)
- ✅ Just re-exports data from `categoriesConfig.js`
- ✅ Contains other data (dealers, colors, fabrics, upcoming models)
- ✅ Maintains backward compatibility

## 🚤 **Boat Categories**

### Inflatable Boats (Categories 1-5)
1. **MaxLine** - Ultimate luxury and performance
2. **TopLine** - Premium comfort and technology
3. **ProLine** - Professional-grade performance
4. **SportLine** - High-performance adventure
5. **Open** - Open-deck connection

### Rigid Boats (Categories 6+)
6. **Infinity** - Premium rigid boats
7. **Striker** - Performance rigid boats
8. *(Add more rigid boat categories here)*

## ✨ **Benefits of Unified Structure**

1. **One Place to Edit** - All boats in `categoriesConfig.js`
2. **Consistent Structure** - Same format for all boats
3. **Auto Image Paths** - Helper functions generate paths automatically
4. **Standard + Optional Features** - Full support for both
5. **Easy to Add** - Just add to the appropriate category

## 📝 **How to Add a Boat**

### Step 1: Open `categoriesConfig.js`

### Step 2: Find the Category
- Inflatable boats: Categories 1-5
- Rigid boats: Categories 6+

### Step 3: Add to Models Array
```javascript
{
  name: "Model Name",
  description: "Full description",
  shortDescription: "Short tagline",
  imageFile: "image.jpg",  // Just filename!
  heroImageFile: "hero.jpg",  // Just filename!
  specs: {
    length: "9.5 m",
    beam: "3.2 m",
    // ... all specs from Excel
  },
  standardFeatures: [
    "Feature 1",
    "Feature 2",
    // ... all standard features
  ],
  optionalFeatures: [
    {
      name: "Optional Feature",
      description: "Description",
      category: "Category",
      price: "Price"
    }
    // ... all optional features
  ]
}
```

### Step 4: Save - Done! 🎉

## 🔄 **Exports**

From `categoriesConfig.js`:
- `inflatableBoats` - Categories 1-5
- `boatsCategories` - Categories 6+
- `allBoats` - All categories

From `models.js`:
- Re-exports everything from `categoriesConfig.js`
- Also exports: `dealers`, `colorOptions`, `fabricOptions`, `upcomingModels`

## 💡 **Key Points**

- ✅ **Edit boats in**: `categoriesConfig.js`
- ✅ **All boats use**: Same structure and helper functions
- ✅ **Image paths**: Auto-generated (just use filenames)
- ✅ **Features**: Support standard and optional
- ✅ **Backward compatible**: Old code still works

## 📚 **See Also**

- `README_BOAT_DATA.md` - Detailed guide for adding boats
- `boatDataExample.js` - Complete examples
- `boatDataTemplate.js` - Data structure template

