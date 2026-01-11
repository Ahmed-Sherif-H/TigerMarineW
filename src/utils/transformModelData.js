/**
 * Transform API model data to include proper image paths
 * This ensures compatibility with existing frontend components
 */

import { getModelImagePath, getFullImagePath, encodeFilename } from './imagePathUtils';
import { isYouTubeUrl } from './youtubeUtils';

/**
 * Transform a single model from API format to frontend format
 */
export function transformModel(model) {
  if (!model) return null;

  const modelFolder = getModelImagePath(model.name);
  
  // Helper to get fallback image path when database doesn't have filename
  const getFallbackImage = (modelName) => {
    // Map model names to likely first image filenames based on actual folder structure
    // Note: Actual filenames may have spaces like "850TL - 1.jpg"
    const fallbackMap = {
      'TL850': '850TL - 1.jpg',  // Actual filename has spaces
      'TL750': '750TL - 1.jpg',
      'TL650': '650TL - 1.jpg',
      'TL950': '950TL - 1.jpg',
      'PL620': '620PL - 1.jpg',
      'PL550': '550PL - 1.jpg',
      'SL520': '520SL - 1.jpg',
      'SL480': '480SL - 1.jpg',
      'OP850': '850OP - 1.jpg',
      'OP750': '750OP - 1.jpg',
      'OP650': '650OP - 1.jpg',
      'ML38': 'ML38 - 1.jpg',
    };
    const fallbackFilename = fallbackMap[modelName] || `${modelName} - 1.jpg`;
    const path = getFullImagePath(modelName, fallbackFilename);
    if (import.meta.env.DEV) {
      console.log(`[Transform] Using fallback image for ${modelName}: ${fallbackFilename} → ${path}`);
    }
    return path;
  };
  
  // Transform image files to full paths
  const transformed = {
    ...model,
    // Main images - generate full paths, use fallback if null
    // Extract filename from path if backend returns full path
    image: model.imageFile ? (() => {
      let filename = model.imageFile;
      // If it's a path like "/images/Open650/image.jpg", extract just "image.jpg"
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] Image: ${model.imageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    heroImage: model.heroImageFile ? (() => {
      let filename = model.heroImageFile;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] HeroImage: ${model.heroImageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    contentImage: model.contentImageFile ? (() => {
      let filename = model.contentImageFile;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ContentImage: ${model.contentImageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    
    // Keep original filenames for admin
    imageFile: model.imageFile || '',
    heroImageFile: model.heroImageFile || '',
    contentImageFile: model.contentImageFile || '',
    // Transform interiorMainImage to full path (in Interior subfolder)
    interiorMainImage: (model.interiorMainImage && model.interiorMainImage.trim() !== '') ? (() => {
      let filename = model.interiorMainImage;
      // Extract filename from path if backend returns full path
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      // Build path with Interior subfolder
      // Use getModelImagePath to get base path, then add Interior/ and filename
      const modelFolder = getModelImagePath(model.name); // Returns: ${BACKEND_URL}/images/${encodedFolderName}/
      const encodedFilename = encodeFilename(filename);
      const fullPath = modelFolder + 'Interior/' + encodedFilename;
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ InteriorMainImage: ${model.interiorMainImage} → ${filename} → ${fullPath}`);
      }
      return fullPath;
    })() : (() => {
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ⚠️ No interiorMainImage for model ${model.name}. Value:`, model.interiorMainImage);
      }
      return null;
    })(),
    
    // Transform arrays - extract filenames first, then build paths
    // Backend may return full paths like "/images/Open650/image.jpg" or just "image.jpg"
    galleryFiles: (model.galleryFiles || []).map(file => {
      if (typeof file === 'string') {
        // Extract filename from path if it's a path
        if (file.includes('/')) {
          return file.split('/').pop();
        }
        return file;
      }
      if (file && file.filename) {
        const f = file.filename;
        return f.includes('/') ? f.split('/').pop() : f;
      }
      return file;
    }),
    galleryImages: (model.galleryFiles || []).length > 0 
      ? (model.galleryFiles || []).map(file => {
          // Extract filename from path if needed
          let filename = typeof file === 'string' ? file : (file?.filename || file);
          // If it's a path like "/images/Open650/image.jpg", extract just "image.jpg"
          if (filename.includes('/')) {
            filename = filename.split('/').pop();
          }
          // Now build the full path from just the filename
          const fullPath = getFullImagePath(model.name, filename);
          // Only log in development
          if (import.meta.env.DEV) {
            console.log(`[Transform] Gallery file: ${filename} → ${fullPath}`);
          }
          return fullPath;
        })
      : [getFallbackImage(model.name)], // Use fallback if no gallery files
    
    videoFiles: (model.videoFiles || []).map(file => {
      const videoValue = typeof file === 'string' ? file : (file?.filename || file);
      // If it's a YouTube URL, preserve it as-is
      if (isYouTubeUrl(videoValue)) {
        return videoValue;
      }
      // For local files, extract filename from path if it's a path
      if (typeof file === 'string') {
        if (file.includes('/')) {
          return file.split('/').pop();
        }
        return file;
      }
      if (file && file.filename) {
        const f = file.filename;
        return f.includes('/') ? f.split('/').pop() : f;
      }
      return file;
    }),
    videos: (model.videoFiles || []).map(file => {
      let filename = typeof file === 'string' ? file : (file?.filename || file);
      
      // If it's a YouTube URL, return it as-is (don't convert to file path)
      if (isYouTubeUrl(filename)) {
        return filename;
      }
      
      // For local video files, extract filename from path if it's a path
      if (filename && filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      // Build full path for local videos only
      return getFullImagePath(model.name, filename);
    }),
    
    interiorFiles: (model.interiorFiles || []).map(file => {
      if (typeof file === 'string') {
        // Extract filename from path if it's a path
        if (file.includes('/')) {
          return file.split('/').pop();
        }
        return file;
      }
      if (file && file.filename) {
        const f = file.filename;
        return f.includes('/') ? f.split('/').pop() : f;
      }
      return file;
    }),
    interiorImages: (model.interiorFiles || []).map(file => {
      let filename = typeof file === 'string' ? file : (file?.filename || file);
      if (!filename) return null;
      // Extract filename from path if it's a path
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const BACKEND_URL = API_BASE_URL.replace('/api', '');
      const basePath = getModelImagePath(model.name);
      return `${basePath}Interior/${encodeFilename(filename)}`;
    }).filter(Boolean),
    
    // Transform specs from array to object if needed
    specs: model.specs 
      ? (Array.isArray(model.specs) 
          ? model.specs.reduce((acc, spec) => {
              acc[spec.key] = spec.value;
              return acc;
            }, {})
          : model.specs)
      : {},
    
    // Transform features - handle both array of strings and array of objects
    features: (model.standardFeatures || model.features || []).map(f => 
      typeof f === 'string' ? f : (f?.feature || f)
    ),
    standardFeatures: (model.standardFeatures || model.features || []).map(f => 
      typeof f === 'string' ? f : (f?.feature || f)
    ),
    
    // Optional features - handle both formats
    optionalFeatures: (model.optionalFeatures || []).map(f => {
      if (typeof f === 'string') {
        return { name: f, description: '', category: '', price: '' };
      }
      return {
        name: f.name || '',
        description: f.description || '',
        category: f.category || '',
        price: f.price || ''
      };
    }),
  };

  return transformed;
}

/**
 * Transform an array of models
 */
export function transformModels(models) {
  return models.map(transformModel);
}

/**
 * Transform category with models
 */
export function transformCategory(category, models) {
  const categoryModels = models
    .filter(m => m.categoryId === category.id)
    .map(transformModel);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  
  // Helper to get category image path
  const getCategoryImagePath = (filename) => {
    if (!filename) return null;
    
    // If it's already a full URL, return as-is
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    // If it's a path starting with /images/, extract filename first, then build path
    if (filename.startsWith('/images/')) {
      // Extract just the filename from the path
      const extractedFilename = filename.split('/').pop();
      // Build path using category name
      return `${BACKEND_URL}/images/categories/${category.name}/${encodeFilename(extractedFilename)}`;
    }
    
    // Otherwise, treat as filename and build the path
    return `${BACKEND_URL}/images/categories/${category.name}/${encodeFilename(filename)}`;
  };
  
  // Extract filenames from paths if backend returns paths
  const categoryImage = category.image ? (() => {
    let filename = category.image;
    // If it's a path, extract just the filename
    if (filename.includes('/')) {
      filename = filename.split('/').pop();
    }
    return getCategoryImagePath(filename);
  })() : `${BACKEND_URL}/images/categories/${category.name}/${category.name}.jpg`;
  
  const categoryHeroImage = category.heroImage ? (() => {
    let filename = category.heroImage;
    // If it's a path, extract just the filename
    if (filename.includes('/')) {
      filename = filename.split('/').pop();
    }
    return getCategoryImagePath(filename);
  })() : categoryImage;
  
  return {
    ...category,
    models: categoryModels,
    // Category images - extract filenames from paths if needed
    image: categoryImage,
    heroImage: categoryHeroImage,
  };
}

