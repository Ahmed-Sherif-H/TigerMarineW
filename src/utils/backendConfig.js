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
  'Infinity 280': 'Infinity 280',
  'Striker 330': 'Striker 330'
};

/**
 * Extract just the filename from a path or filename
 * Handles: "/images/TopLine850/image.jpg" -> "image.jpg"
 *          "image.jpg" -> "image.jpg"
 */
export function extractFilename(pathOrFilename) {
  if (!pathOrFilename || typeof pathOrFilename !== 'string') {
    return '';
  }
  
  const trimmed = pathOrFilename.trim();
  if (!trimmed) return '';
  
  // If it contains a slash, extract the last part (filename)
  if (trimmed.includes('/')) {
    return trimmed.split('/').pop().trim();
  }
  
  // Otherwise, it's already just a filename
  return trimmed;
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
  
  return {
    ...modelData,
    // Extract filenames from main image fields
    imageFile: extractFilename(modelData.imageFile || ''),
    heroImageFile: extractFilename(modelData.heroImageFile || ''),
    contentImageFile: extractFilename(modelData.contentImageFile || ''),
    // Extract filenames from arrays
    galleryFiles: extractFilenames(modelData.galleryFiles || []),
    interiorFiles: extractFilenames(modelData.interiorFiles || []),
    videoFiles: extractFilenames(modelData.videoFiles || []),
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
    // Extract filenames from main image fields (API returns paths)
    imageFile: extractFilename(modelData.imageFile || ''),
    heroImageFile: extractFilename(modelData.heroImageFile || ''),
    contentImageFile: extractFilename(modelData.contentImageFile || ''),
    // Extract filenames from arrays
    galleryFiles: extractFilenames(modelData.galleryFiles || []),
    interiorFiles: extractFilenames(modelData.interiorFiles || []),
    videoFiles: extractFilenames(modelData.videoFiles || []),
  };
}

/**
 * Get folder name for a model
 */
export function getModelFolderName(modelName) {
  return MODEL_FOLDER_MAP[modelName] || modelName;
}

