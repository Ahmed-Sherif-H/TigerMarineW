/**
 * Simple utility to generate image paths from model names
 * Images are now served from frontend public folder (Netlify CDN)
 */

/**
 * Get the image folder path for a model (pointing to frontend public folder)
 */
export function getModelImagePath(modelName) {
  if (!modelName) return '/images/';
  
  // Map model names to folder names
  const modelFolderMap = {
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
  
  // Try to find in map first
  const folderName = modelFolderMap[modelName] || modelName;
  
  // Encode folder name for URL (spaces become %20)
  const encodedFolderName = encodeURIComponent(folderName);
  
  // Return the path pointing to frontend public folder
  return `/images/${encodedFolderName}/`;
}

/**
 * Generate full image path from model name and filename
 * Handles Cloudinary URLs (legacy), filenames, and local paths
 * Now serves from frontend public folder (Netlify CDN)
 */
export function getFullImagePath(modelName, filename) {
  if (!filename) return null;
  
  // If filename is already a full URL (Cloudinary or other), return as-is
  // This handles legacy Cloudinary URLs that might still be in the database
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // If it's already a relative path like /images/..., return as-is (already correct)
  if (filename.startsWith('/images/')) {
    return filename;
  }
  
  // Otherwise, treat as filename and build the path
  const basePath = getModelImagePath(modelName);
  // Remove any leading slashes from filename and encode spaces
  const cleanFilename = filename.replace(/^\//, '');
  const encodedFilename = encodeFilename(cleanFilename);
  
  const fullPath = `${basePath}${encodedFilename}`;
  
  // Debug logging in dev mode only
  if (import.meta.env.DEV) {
    console.log(`[Image Path] Model: ${modelName}, File: ${filename} → ${fullPath}`);
  }
  
  return fullPath;
}

/**
 * Get category image path (served from frontend public folder)
 */
export function getCategoryImagePath(categoryName, filename) {
  if (!filename) return null;
  
  // If it's already a full URL (Cloudinary legacy), return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // If it's already a relative path, return as-is
  if (filename.startsWith('/images/')) {
    return filename;
  }
  
  // Otherwise, treat as filename and build the path
  return `/images/categories/${categoryName}/${encodeFilename(filename)}`;
}

/**
 * Encode filename for URL (handles spaces and special chars)
 */
export function encodeFilename(filename) {
  if (!filename) return '';
  // Replace spaces with %20, but keep other characters as-is
  return filename.replace(/ /g, '%20');
}

