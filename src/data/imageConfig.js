/**
 * Image Configuration - Easy Image Management
 * 
 * This file makes it super easy to manage images for models and categories.
 * Just specify the image filenames here, and the system handles the rest!
 * 
 * When adding a new model:
 * 1. Add the model name and its image folder name
 * 2. Add the side menu image filename
 * 3. That's it! The system auto-generates all paths.
 */

// ============================================================================
// MODEL IMAGE FOLDERS
// ============================================================================
// Maps model names to their folder names in /images
// When you add a new model, just add it here!
export const modelImageFolders = {
  // MaxLine
  'ML38': 'MaxLine 38',
  
  // TopLine
  'TL950': 'TopLine950',
  'TL850': 'TopLine850',
  'TL750': 'TopLine750',
  'TL650': 'TopLine650',
  
  // ProLine
  'PL620': 'ProLine620',
  'PL550': 'ProLine550',
  
  // SportLine
  'SL520': 'SportLine520',
  'SL480': 'SportLine480',
  
  // Open
  'OP850': 'Open850',
  'OP750': 'Open750',
  'OP650': 'Open650',
  
  // Rigid Boats
  'Infinity 280': 'Infinity280',
  
  // Add new models here:
  // 'NewModel': 'NewModelFolder',
};

// ============================================================================
// SIDE MENU IMAGES
// ============================================================================
// Maps model names to their side menu preview images in /images/SideMenu
export const sideMenuImages = {
  'ML38':  'MaxLine-38.webp',
  'TL950': 'TopLine-950.webp',
  'TL850': 'TopLine-850.webp',
  'TL750': 'TopLine-750.webp',
  'TL650': 'TopLine-650.webp',
  'PL620': 'ProLine-620.webp',
  'PL550': 'ProLine-550.webp',
  'SL520': 'SportLine-520.webp',
  'SL480': 'SportLine-480.webp',
  'OP850': 'Open-850.webp',
  'OP750': 'Open-750.webp',
  'OP650': 'Open-650.webp',
  'Infinity 280': 'Infinity-280.png',
  
  // Add new models here:
  // 'NewModel': 'NewModel-sideMenu.png',
};

// ============================================================================
// CATEGORY IMAGES
// ============================================================================
// Category display images (for category cards and pages)
export const categoryImages = {
  'MaxLine': '/images/Max-line.jpg',
  'TopLine': '/images/Max-line.jpg',
  'ProLine': '/images/ProLine550/DJI_0529.jpg',
  'SportLine': '/images/SportLine480/480SL1.jpg',
  'Open': '/images/Open750/IMG_0535.jpg',
  'Infinity': '/images/Max-line.jpg',
  
  // Add new categories here:
  // 'NewCategory': '/images/new-category.jpg',
};

// Category hero images (for category detail pages)
export const categoryHeroImages = {
  'MaxLine': '/images/Max-line2.jpg',
  'TopLine': '/images/Max-line2.jpg',
  'ProLine': '/images/Max-line2.jpg',
  'SportLine': '/images/SportLine520/DJI_0239.jpg',
  'Open': '/images/Max-line2.jpg',
  'Infinity': '/images/Max-line2.jpg',
  
  // Add new categories here:
  // 'NewCategory': '/images/new-category-hero.jpg',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the folder path for a model's images
 * @param {string} modelName - The model name (e.g., "TL950")
 * @returns {string} - The folder path (e.g., "/images/TopLine950/")
 */
export const getModelImageFolder = (modelName) => {
  const folderName = modelImageFolders[modelName];
  if (!folderName) {
    console.warn(`No folder mapping found for model: ${modelName}. Add it to imageConfig.js`);
    return '/images/'; // Fallback
  }
  // URL encode the folder path to handle spaces and special characters
  const encodedFolder = folderName.split('/').map(part => encodeURIComponent(part)).join('/');
  return `/images/${encodedFolder}/`;
};

/**
 * Get the side menu preview image for a model
 * @param {string} modelName - The model name
 * @returns {string} - The side menu image path
 */
export const getSideMenuImage = (modelName) => {
  const imageName = sideMenuImages[modelName] || 'sideMenu-NoBG.png';
  return `/images/SideMenu/${imageName}`;
};

/**
 * Get category image
 * @param {string} categoryName - The category name
 * @returns {string} - The category image path
 */
export const getCategoryImage = (categoryName) => {
  return categoryImages[categoryName] || '/images/Max-line.jpg';
};

/**
 * Get category hero image
 * @param {string} categoryName - The category name
 * @returns {string} - The category hero image path
 */
export const getCategoryHeroImage = (categoryName) => {
  return categoryHeroImages[categoryName] || '/images/Max-line2.jpg';
};

/**
 * URL-encode filenames containing spaces or special characters
 */
export const encodeFilename = (filename) => {
  if (typeof filename !== 'string') return filename;
  if (/[\s()&]/.test(filename)) {
    return encodeURIComponent(filename);
  }
  return filename;
};

/**
 * Build full image path from model folder and filename
 * @param {string} modelName - The model name
 * @param {string} filename - The image filename
 * @returns {string} - Full image path
 */
export const buildImagePath = (modelName, filename) => {
  if (!filename) return '';
  const folder = getModelImageFolder(modelName);
  return folder + encodeFilename(filename);
};

