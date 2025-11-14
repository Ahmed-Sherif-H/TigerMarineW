/**
 * Helper functions to automatically generate image paths based on folder structure
 * This file now imports from imageConfig.js for easier management
 * 
 * To add/edit image mappings, edit: src/data/imageConfig.js
 */

// Import image configuration
import {
  getModelImageFolder as getFolder,
  getSideMenuImage as getSideMenu,
  getCategoryImage as getCatImage,
  getCategoryHeroImage as getCatHero,
  encodeFilename,
  buildImagePath
} from './imageConfig';

/**
 * Get the folder path for a model's images
 * @param {string} modelName - The model name (e.g., "TL950")
 * @returns {string} - The folder path (e.g., "/images/TopLine950/")
 */
export const getModelImageFolder = getFolder;

/**
 * Get the first available image from a model's folder
 * Assumes the folder contains images - you can specify which one to use
 * @param {string} modelName - The model name
 * @param {string} fileName - Optional specific file name (e.g., "DJI_0058.jpg")
 * @returns {string} - The image path
 */
export const getModelImage = (modelName, fileName = null) => {
  const folder = getModelImageFolder(modelName);
  if (fileName) {
    return `${folder}${fileName}`;
  }
  // Return folder path - you can set a default image name
  return `${folder}`;
};

/**
 * Get the side menu preview image for a model
 * @param {string} modelName - The model name
 * @returns {string} - The side menu image path
 */
export const getSideMenuImage = getSideMenu;

/**
 * Get category image paths
 * Maps category names to their main display images
 * Can be overridden in models.js with category.image property
 */
export const getCategoryImage = (categoryName, customImage = null) => {
  if (customImage) {
    return customImage;
  }
  return getCatImage(categoryName);
};

/**
 * Get category hero image paths
 * Can be overridden in models.js with category.heroImage property
 */
export const getCategoryHeroImage = (categoryName, customHeroImage = null) => {
  if (customHeroImage) {
    return customHeroImage;
  }
  return getCatHero(categoryName);
};

/**
 * URL-encode filenames containing spaces or special characters
 * Ensures paths like "850TL - 1.jpg" load correctly in the browser
 */
export { encodeFilename, buildImagePath };
