# Model Images & Content Guide - Complete Reference

This guide explains how to easily manage **ALL** images and text content for each model in one place.

## 📍 Where to Edit Images & Text

**All model images and text content are specified in `src/data/models.js`** when creating a model.

## 🖼️ All Image Types for Models

When adding or editing a model, you can specify these image properties:

### 1. **Thumbnail Image** (`imageFile`)
- **Used in**: Model cards on "All Models" page
- **Example**: `imageFile: "IMG_3213.jpg"`

### 2. **Hero Image** (`heroImageFile`)
- **Used in**: Full-screen hero section at top of model detail page
- **Example**: `heroImageFile: "DJI_0247.jpg"`

### 3. **Content Image** (`contentImageFile`)
- **Used in**: Images next to text in sections 4 and 6
- **Example**: `contentImageFile: "DJI_0150.jpg"`

### 4. **Gallery Images** (`galleryFiles`)
- **Used in**: Full-width image carousel (section 5) and High Quality Fabrics carousel
- **Example**: `galleryFiles: ["img1.jpg", "img2.jpg", "img3.jpg"]`

### 5. **Video Files** (`videoFiles`)
- **Used in**: Video section (section 3)
- **Example**: `videoFiles: ["video.mp4", "video2.mp4"]`

### 6. **Fabric Left Image** (`fabricLeftImageFile`)
- **Used in**: Small left image in High Quality Fabrics section
- **Example**: `fabricLeftImageFile: "interior-left.jpg"`
- **Optional**: Falls back to hero image if not specified

### 7. **Fabric Right Image** (`fabricRightImageFile`)
- **Used in**: Large right image in High Quality Fabrics section (carousel)
- **Example**: `fabricRightImageFile: "interior-right.jpg"`
- **Optional**: Falls back to content image or gallery images if not specified

### 8. **Optional Feature Images**
- **Used in**: "Elevate Your Experience" section (section 7)
- **Specified in**: Each optional feature object
- **Example**: 
  ```javascript
  optionalFeatures: [
    {
      name: "Premium Audio System",
      description: "High-end sound system",
      image: "audio-system.jpg",  // ← Just filename, path auto-generated!
      price: "Contact for pricing"
    }
  ]
  ```

## 📝 Text Content Properties

### Section 2 Text (Model Name & Description)
- **`section2Title`**: Custom title for the centered section (optional)
  - **Example**: `section2Title: "TopLine 850"`
  - **Fallback**: Auto-generated from category name + model number (e.g., "TopLine 850")
  
- **`section2Description`**: Custom paragraph text for section 2 (optional)
  - **Example**: `section2Description: "The TopLine 850 represents the perfect balance..."`  
  - **Fallback**: Uses `description` or `shortDescription` if not provided

## 📝 Complete Example

Here's a complete example of a model with all image types and text content:

```javascript
createModel('TL950', {
  // Basic info
  description: "The ultimate expression of luxury...",
  shortDescription: "Premium inflatable designed...",
  
  // ALL IMAGES - Just specify filenames!
  imageFile: "DJI_0150.jpg",                    // Thumbnail
  heroImageFile: "DJI_0247.jpg",                // Hero section
  contentImageFile: "DJI_0150.jpg",             // Content images
  galleryFiles: [                                // Gallery carousel
    "DJI_0150.jpg",
    "DJI_0247.jpg",
    "interior-1.jpg",
    "interior-2.jpg",
    "exterior-1.jpg"
  ],
  videoFiles: ["video.mp4"],                    // Videos
  fabricLeftImageFile: "interior-left.jpg",      // Fabric section left
  fabricRightImageFile: "interior-right.jpg",   // Fabric section right
  
  // Section 2 Text (optional - auto-generated if not provided)
  section2Title: "TopLine 950",                  // Custom title for section 2
  section2Description: "The TopLine 950 represents the perfect balance of luxury, performance, and versatility. Designed for discerning boaters who demand the finest in inflatable craftsmanship, this model combines cutting-edge technology with timeless elegance.", // Custom description for section 2
  
  // Specs
  specs: {
    length: "9.5 m",
    // ... other specs
  },
  
  // Features
  standardFeatures: [
    "Premium inflatable construction",
    // ... more features
  ],
  
  // Optional features with images
  optionalFeatures: [
    {
      name: "Premium Audio System",
      description: "High-end sound system with waterproof speakers",
      image: "audio-system.jpg",  // ← Image for this feature
      category: "Entertainment",
      price: "Contact for pricing"
    },
    {
      name: "Advanced Navigation Suite",
      description: "GPS, chartplotter, radar, and autopilot",
      image: "navigation-suite.jpg",  // ← Image for this feature
      category: "Navigation",
      price: "Contact for pricing"
    }
  ],
  
  // ... other model data
})
```

## 🎯 Image Path Rules

1. **Just use filenames** - The system automatically:
   - Finds the correct folder based on model name
   - Handles spaces and special characters
   - Generates full paths

2. **Image locations**:
   - All images go in: `public/images/[ModelFolder]/`
   - Videos go in: `public/images/[ModelFolder]/`
   - Side menu images go in: `public/images/SideMenu/`

3. **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.mp4`, `.mov`, `.webm`

## 🔄 Automatic Fallbacks

The system has smart fallbacks:
- If `heroImageFile` not specified → uses `imageFile`
- If `contentImageFile` not specified → uses `imageFile`
- If `fabricLeftImageFile` not specified → uses `heroImage`
- If `fabricRightImageFile` not specified → uses gallery images or `contentImage`
- If `videoFiles` not specified → tries `video.mp4` in model folder

## 📂 Folder Structure Example

```
public/
  images/
    TopLine950/              ← Model folder (auto-mapped from model name)
      DJI_0150.jpg          ← Thumbnail
      DJI_0247.jpg          ← Hero image
      interior-1.jpg        ← Gallery images
      interior-2.jpg
      video.mp4             ← Video
      interior-left.jpg      ← Fabric left image
      interior-right.jpg     ← Fabric right image
      audio-system.jpg       ← Optional feature image
    SideMenu/
      TopLine-950.png       ← Side menu preview
```

## ✨ Quick Tips

1. **Add new images**: Just add the filename to the appropriate property in `models.js`
2. **Change images**: Update the filename in `models.js` - paths auto-update!
3. **Add gallery images**: Add more filenames to the `galleryFiles` array
4. **Add videos**: Add video filenames to the `videoFiles` array
5. **Optional feature images**: Add `image: "filename.jpg"` to any optional feature object
6. **Customize section 2 text**: Add `section2Title` and `section2Description` to customize the centered title and paragraph

## 🚀 Adding a New Model

1. **Add folder mapping** in `imageConfig.js`:
   ```javascript
   'NewModel': 'NewModelFolder',
   ```

2. **Add side menu image** in `imageConfig.js`:
   ```javascript
   'NewModel': 'NewModel-sideMenu.png',
   ```

3. **Specify all images** in `models.js`:
   ```javascript
   createModel('NewModel', {
     imageFile: "thumbnail.jpg",
     heroImageFile: "hero.jpg",
     contentImageFile: "content.jpg",
     galleryFiles: ["gallery1.jpg", "gallery2.jpg"],
     videoFiles: ["video.mp4"],
     fabricLeftImageFile: "fabric-left.jpg",
     fabricRightImageFile: "fabric-right.jpg",
     // ... rest of model data
   })
   ```

4. **Place images** in `public/images/NewModelFolder/`

That's it! All images are now dynamic and easy to manage! 🎉

