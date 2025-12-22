/**
 * Transform API model data to include proper image paths
 * This ensures compatibility with existing frontend components
 */

import { getModelImagePath, getFullImagePath, encodeFilename } from './imagePathUtils';

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
    console.log(`[Transform] Using fallback image for ${modelName}: ${fallbackFilename} → ${path}`);
    return path;
  };
  
  // Transform image files to full paths
  const transformed = {
    ...model,
    // Main images - generate full paths, use fallback if null
    image: model.imageFile ? (() => {
      const path = getFullImagePath(model.name, model.imageFile);
      console.log(`[Transform] Image: ${model.imageFile} → ${path}`);
      return path;
    })() : getFallbackImage(model.name),
    heroImage: model.heroImageFile ? (() => {
      const path = getFullImagePath(model.name, model.heroImageFile);
      console.log(`[Transform] HeroImage: ${model.heroImageFile} → ${path}`);
      return path;
    })() : getFallbackImage(model.name),
    contentImage: model.contentImageFile ? (() => {
      const path = getFullImagePath(model.name, model.contentImageFile);
      console.log(`[Transform] ContentImage: ${model.contentImageFile} → ${path}`);
      return path;
    })() : getFallbackImage(model.name),
    
    // Keep original filenames for admin
    imageFile: model.imageFile || '',
    heroImageFile: model.heroImageFile || '',
    contentImageFile: model.contentImageFile || '',
    
    // Transform arrays to full paths
    // Backend returns galleryFiles as array of strings already
    galleryFiles: (model.galleryFiles || []).map(file => {
      if (typeof file === 'string') return file;
      if (file && file.filename) return file.filename;
      return file;
    }),
    galleryImages: (model.galleryFiles || []).length > 0 
      ? (model.galleryFiles || []).map(file => {
          const filename = typeof file === 'string' ? file : (file?.filename || file);
          // getFullImagePath now handles both relative filenames and full paths
          const fullPath = getFullImagePath(model.name, filename);
          console.log(`[Transform] Gallery file: ${filename} → ${fullPath}`);
          return fullPath;
        })
      : [getFallbackImage(model.name)], // Use fallback if no gallery files
    
    videoFiles: (model.videoFiles || []).map(file => {
      if (typeof file === 'string') return file;
      if (file && file.filename) return file.filename;
      return file;
    }),
    videos: (model.videoFiles || []).map(file => {
      const filename = typeof file === 'string' ? file : (file?.filename || file);
      return getFullImagePath(model.name, filename);
    }),
    
    interiorFiles: (model.interiorFiles || []).map(file => {
      if (typeof file === 'string') return file;
      if (file && file.filename) return file.filename;
      return file;
    }),
    interiorImages: (model.interiorFiles || []).map(file => {
      const filename = typeof file === 'string' ? file : (file?.filename || file);
      const basePath = getModelImagePath(model.name);
      return `${basePath}Interior/${encodeFilename(filename)}`;
    }),
    
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
  
  return {
    ...category,
    models: categoryModels,
    // Category images - served from backend
    image: category.image || `${BACKEND_URL}/images/${category.name}/${category.name}.jpg`,
    heroImage: category.heroImage || category.image || `${BACKEND_URL}/images/${category.name}/${category.name}.jpg`,
  };
}

