/**
 * Simple utility to generate image paths from model names
 * Images are now served from backend public folder
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = API_BASE_URL.replace('/api', ''); // Remove /api to get base backend URL

/**
 * Get the image folder path for a model (pointing to backend)
 */
export function getModelImagePath(modelName) {
  if (!modelName) return `${BACKEND_URL}/images/`;
  
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
  
  // Return the path pointing to backend
  return `${BACKEND_URL}/images/${folderName}/`;
}

/**
 * Generate full image path from model name and filename
 */
export function getFullImagePath(modelName, filename) {
  if (!filename) return null;
  
  // If filename is already a full path (starts with /images/ or http://), return as-is
  if (filename.startsWith('/images/') || filename.startsWith('http://') || filename.startsWith('https://')) {
    // If it's a relative path like /images/..., convert to full backend URL
    if (filename.startsWith('/images/')) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const BACKEND_URL = API_BASE_URL.replace('/api', '');
      return `${BACKEND_URL}${filename}`;
    }
    return filename; // Already a full URL
  }
  
  const basePath = getModelImagePath(modelName);
  // Remove any leading slashes from filename
  const cleanFilename = filename.replace(/^\//, '');
  
  const fullPath = `${basePath}${cleanFilename}`;
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log(`[Image Path] Model: ${modelName}, File: ${filename}, Path: ${fullPath}`);
  }
  
  return fullPath;
}

/**
 * Encode filename for URL (handles spaces and special chars)
 */
export function encodeFilename(filename) {
  if (!filename) return '';
  // Replace spaces with %20, but keep other characters as-is
  return filename.replace(/ /g, '%20');
}

