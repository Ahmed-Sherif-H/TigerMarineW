/**
 * Centralized Backend Configuration and Utilities
 * All backend-related constants, mappings, and helper functions in one place
 */

// Model name to folder name mapping
export const MODEL_FOLDER_MAP = {
  'TL950': 'TopLine950',
  'TL850': 'TopLine850',
  'TL750': 'TopLine750',
  'TL650': 'TopLine650',
  'PL620': 'ProLine620',
  'PL550': 'ProLine550',
  'SL520': 'SportLine520',
  'SL480': 'SportLine480',
  'OP850': 'Open850',
  'OP750': 'Open750',
  'OP650': 'Open650',
  'ML38': 'MaxLine 38',
  'Infinity 280': 'Infinity 280'
};

/**
 * Extract just the filename from a path or filename
 * Handles: "/images/TopLine850/image.jpg" -> "image.jpg"
 *          "image.jpg" -> "image.jpg"
 *          Cloudinary URLs -> returns URL as-is (don't extract filename)
 */
export function extractFilename(pathOrFilename) {
  if (!pathOrFilename || typeof pathOrFilename !== 'string') {
    return '';
  }
  
  const trimmed = pathOrFilename.trim();
  if (!trimmed) return '';
  
  // If it's a Cloudinary URL or full URL, return it as-is (don't extract filename)
  if (trimmed.includes('cloudinary.com') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // If it contains a slash, extract the last part (filename)
  if (trimmed.includes('/')) {
    return trimmed.split('/').pop().trim();
  }
  
  // Otherwise, it's already just a filename
  return trimmed;
}

/**
 * Extract URL from upload response
 * Handles both old format { filename, path } and new format { url, public_id, filename }
 * Returns the URL if available, otherwise falls back to filename
 */
export function extractUploadUrl(uploadResponse) {
  if (!uploadResponse) return '';
  
  // New Cloudinary format: { url, public_id, filename }
  if (uploadResponse.url) {
    return uploadResponse.url;
  }
  
  // Old format: { filename, path }
  // If path is a Cloudinary URL, use it
  if (uploadResponse.path && (uploadResponse.path.includes('cloudinary.com') || uploadResponse.path.startsWith('http'))) {
    return uploadResponse.path;
  }
  
  // Fallback to filename (for backward compatibility with legacy data)
  return uploadResponse.filename || uploadResponse.path || '';
}

/**
 * Extract filenames from an array (handles mixed paths and filenames)
 */
export function extractFilenames(array) {
  if (!Array.isArray(array)) return [];
  
  return array
    .map(item => {
      // Handle string filenames/paths
      if (typeof item === 'string') {
        return extractFilename(item);
      }
      // Handle objects with filename property
      if (item && typeof item === 'object' && item.filename) {
        return extractFilename(item.filename);
      }
      // Handle objects with other properties
      if (item && typeof item === 'object') {
        return extractFilename(item.name || item.path || '');
      }
      return '';
    })
    .filter(Boolean); // Remove empty strings
}

/**
 * Normalize model data for saving to backend
 * Ensures all image fields contain only filenames (not paths)
 */
export function normalizeModelDataForSave(modelData) {
  if (!modelData || typeof modelData !== 'object') {
    return modelData;
  }
  
  // Convert features to standardFeatures (array of strings)
  // Handle both: array of strings and array of objects with 'feature' property
  let standardFeatures = [];
  if (modelData.features && Array.isArray(modelData.features)) {
    standardFeatures = modelData.features
      .map(feature => {
        // If it's a string, use it directly
        if (typeof feature === 'string') {
          return feature.trim();
        }
        // If it's an object, extract the 'feature' property
        if (typeof feature === 'object' && feature !== null) {
          return String(feature.feature || '').trim();
        }
        return '';
      })
      .filter(Boolean); // Remove empty strings
  } else if (modelData.standardFeatures && Array.isArray(modelData.standardFeatures)) {
    // If standardFeatures already exists, use it
    standardFeatures = modelData.standardFeatures
      .map(f => typeof f === 'string' ? f.trim() : String(f).trim())
      .filter(Boolean);
  }
  
  return {
    ...modelData,
    // Preserve Cloudinary URLs, extract filenames for legacy paths
    imageFile: modelData.imageFile || '',
    heroImageFile: modelData.heroImageFile || '',
    contentImageFile: modelData.contentImageFile || '',
    interiorMainImage: modelData.interiorMainImage || '',
    // Preserve Cloudinary URLs in arrays, extract filenames for legacy paths
    galleryFiles: (modelData.galleryFiles || []).map(file => {
      // If it's a Cloudinary URL, preserve it
      if (typeof file === 'string' && (file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
    interiorFiles: (modelData.interiorFiles || []).map(file => {
      if (typeof file === 'string' && (file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
    videoFiles: (modelData.videoFiles || []).map(file => {
      // Preserve YouTube URLs and Cloudinary URLs
      if (typeof file === 'string' && (file.includes('youtube.com') || file.includes('youtu.be') || file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
    // Convert features to standardFeatures format
    standardFeatures: standardFeatures,
    // Remove features field to avoid confusion (backend expects standardFeatures)
    features: undefined,
  };
}

/**
 * Normalize model data when loading from backend
 * Extracts filenames from paths returned by API
 */
export function normalizeModelDataForEdit(modelData) {
  if (!modelData || typeof modelData !== 'object') {
    return modelData;
  }
  
  return {
    ...modelData,
    // Preserve Cloudinary URLs, extract filenames for legacy paths
    // extractFilename() already handles this correctly
    imageFile: modelData.imageFile || '',
    heroImageFile: modelData.heroImageFile || '',
    contentImageFile: modelData.contentImageFile || '',
    interiorMainImage: modelData.interiorMainImage || '',
    // Preserve Cloudinary URLs in arrays, extract filenames for legacy paths
    galleryFiles: (modelData.galleryFiles || []).map(file => {
      // If it's a Cloudinary URL, preserve it
      if (typeof file === 'string' && (file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
    interiorFiles: (modelData.interiorFiles || []).map(file => {
      if (typeof file === 'string' && (file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
    videoFiles: (modelData.videoFiles || []).map(file => {
      // Preserve YouTube URLs and Cloudinary URLs
      if (typeof file === 'string' && (file.includes('youtube.com') || file.includes('youtu.be') || file.includes('cloudinary.com') || file.startsWith('http'))) {
        return file;
      }
      return extractFilename(file);
    }),
  };
}

/**
 * Normalize category data for saving to backend
 * Preserves Cloudinary URLs, extracts filenames only for legacy paths
 */
export function normalizeCategoryDataForSave(categoryData) {
  if (!categoryData || typeof categoryData !== 'object') {
    return categoryData;
  }
  
  return {
    ...categoryData,
    // Preserve Cloudinary URLs, extract filenames for legacy paths
    // extractFilename() already handles this correctly
    image: categoryData.image || '',
    heroImage: categoryData.heroImage || '',
  };
}

/**
 * Normalize category data when loading from backend
 * Preserves Cloudinary URLs, extracts filenames only for legacy paths
 */
export function normalizeCategoryDataForEdit(categoryData) {
  if (!categoryData || typeof categoryData !== 'object') {
    return categoryData;
  }
  
  return {
    ...categoryData,
    // Preserve Cloudinary URLs, extract filenames for legacy paths
    // extractFilename() already handles this correctly
    image: categoryData.image || '',
    heroImage: categoryData.heroImage || '',
  };
}

/**
 * Get folder name for a model
 */
export function getModelFolderName(modelName) {
  return MODEL_FOLDER_MAP[modelName] || modelName;
}

