/**
 * Simple utility to generate image paths from model names
 * Images are now served from backend public folder
 */

// Get backend URL dynamically (not at module load time)
function getBackendUrl() {
  // Try multiple ways to get the API URL
  let API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // If not set, use fallback
  if (!API_BASE_URL || API_BASE_URL === 'undefined' || API_BASE_URL === '') {
    API_BASE_URL = 'http://localhost:3001/api';
    if (import.meta.env.DEV) {
      console.warn(`[getBackendUrl] ⚠️ VITE_API_URL not set, using fallback: ${API_BASE_URL}`);
    }
  }
  
  // Remove /api to get base backend URL
  // Handle both cases: URL ending with /api or /api/
  let backendUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  
  // Log in both dev and production for debugging image issues
  console.log(`[getBackendUrl] VITE_API_URL from env:`, import.meta.env.VITE_API_URL);
  console.log(`[getBackendUrl] API_BASE_URL: ${API_BASE_URL}`);
  console.log(`[getBackendUrl] Backend URL (for images): ${backendUrl}`);
  
  // Ensure we have a valid URL
  if (!backendUrl || backendUrl === 'undefined' || !backendUrl.startsWith('http')) {
    if (import.meta.env.DEV) {
      console.error(`[getBackendUrl] ❌ Invalid backend URL: ${backendUrl}`);
      console.error(`[getBackendUrl] Falling back to: http://localhost:3001`);
    }
    return 'http://localhost:3001';
  }
  
  return backendUrl;
}

/**
 * Get the image folder path for a model (pointing to backend)
 */
export function getModelImagePath(modelName) {
  let BACKEND_URL = getBackendUrl();
  
  // Validate BACKEND_URL - use fallback if invalid
  if (!BACKEND_URL || !BACKEND_URL.startsWith('http')) {
    if (import.meta.env.DEV) {
      console.error(`[getModelImagePath] ❌ Invalid BACKEND_URL: ${BACKEND_URL}`);
      console.error(`[getModelImagePath] Using fallback: http://localhost:3001`);
    }
    BACKEND_URL = 'http://localhost:3001';
  }
  
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
  
  // Encode folder name for URL (spaces become %20)
  const encodedFolderName = encodeURIComponent(folderName);
  
  // Return the path pointing to backend
  return `${BACKEND_URL}/images/${encodedFolderName}/`;
}

/**
 * Generate full image path from model name and filename
 * Handles Cloudinary URLs, legacy filenames, and local paths
 */
export function getFullImagePath(modelName, filename) {
  if (!filename) return null;
  
  // If filename is already a full URL (Cloudinary or other), return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Use getBackendUrl() to ensure consistency
  let BACKEND_URL = getBackendUrl();
  
  // Validate BACKEND_URL - use fallback if invalid
  if (!BACKEND_URL || !BACKEND_URL.startsWith('http')) {
    if (import.meta.env.DEV) {
      console.error(`[getFullImagePath] ❌ Invalid BACKEND_URL: ${BACKEND_URL}`);
      console.error(`[getFullImagePath] Using fallback: http://localhost:3001`);
    }
    BACKEND_URL = 'http://localhost:3001';
  }
  
  // If it's a relative path like /images/..., convert to full backend URL
  // Need to encode the path parts (folder names with spaces)
  if (filename.startsWith('/images/')) {
    // Split the path and encode each part
    const parts = filename.split('/').filter(Boolean);
    if (parts.length >= 3) {
      // /images/Folder Name/image.jpg -> encode folder name
      const encodedParts = parts.map((part, index) => {
        // Encode folder names (not the 'images' part, and not the filename which will be encoded separately)
        if (index === 0 || index === parts.length - 1) {
          // 'images' and filename - encode filename but not 'images'
          return index === parts.length - 1 ? encodeFilename(part) : part;
        }
        // Folder names - encode with encodeURIComponent to handle spaces
        return encodeURIComponent(part);
      });
      return `${BACKEND_URL}/${encodedParts.join('/')}`;
    }
    // Fallback: just encode the whole path
    return `${BACKEND_URL}${encodeURI(filename)}`;
  }
  
  // Otherwise, treat as filename and build the path
  const basePath = getModelImagePath(modelName);
  // Remove any leading slashes from filename and encode spaces
  const cleanFilename = filename.replace(/^\//, '');
  const encodedFilename = encodeFilename(cleanFilename);
  
  const fullPath = `${basePath}${encodedFilename}`;
  
  // Debug logging - always log errors, log details in dev
  const hasUnencodedSpace = fullPath.includes('MaxLine 38') || fullPath.includes('Infinity 280');
  const hasEncodedSpace = fullPath.includes('MaxLine%2038') || fullPath.includes('Infinity%20280');
  const isRelative = fullPath.startsWith('/');
  const isAbsolute = fullPath.startsWith('http://') || fullPath.startsWith('https://');
  
  // Always log errors, even in production
  if (isRelative || (hasUnencodedSpace && !hasEncodedSpace)) {
    console.error(`[Image Path] ❌ ERROR: Model: ${modelName}, File: ${filename}`);
    console.error(`[Image Path] Generated path: ${fullPath}`);
    console.error(`[Image Path] Is relative: ${isRelative}, Is absolute: ${isAbsolute}`);
    console.error(`[Image Path] Has unencoded space: ${hasUnencodedSpace}`);
    console.error(`[Image Path] Backend URL: ${getBackendUrl()}`);
    console.error(`[Image Path] VITE_API_URL: ${import.meta.env.VITE_API_URL || 'NOT SET'}`);
  } else if (import.meta.env.DEV) {
    console.log(`[Image Path] Model: ${modelName}, File: ${filename}`);
    console.log(`[Image Path] Generated path: ${fullPath}`);
    console.log(`[Image Path] Is absolute: ${isAbsolute}`);
  }
  
  return fullPath;
}

/**
 * Get category image path
 */
export function getCategoryImagePath(categoryName, filename) {
  if (!filename) return null;
  
  const BACKEND_URL = getBackendUrl();
  
  // If it's already a full URL, return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // If it's a path starting with /images/, convert to backend URL
  if (filename.startsWith('/images/')) {
    return `${BACKEND_URL}${filename}`;
  }
  
  // Otherwise, treat as filename and build the path
  return `${BACKEND_URL}/images/categories/${categoryName}/${encodeFilename(filename)}`;
}

/**
 * Encode filename for URL (handles spaces and special chars)
 */
export function encodeFilename(filename) {
  if (!filename) return '';
  // Replace spaces with %20, but keep other characters as-is
  return filename.replace(/ /g, '%20');
}

