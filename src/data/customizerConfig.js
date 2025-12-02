/**
 * Customizer Configuration
 * Maps model names to their customizer folder names
 */

// Map model names to their customizer folder names
export const customizerFolders = {
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
  
  // Add more models as needed
};

// Customizer part names (matching folder names)
// Note: Folder names may vary (e.g., "Deck Floor" vs "Deck floor", "Upholestry" vs "Upholstery")
export const customizerParts = [
  { key: 'base', label: 'Base', folder: 'Base', folderVariants: ['Base'] },
  { key: 'deckFloor', label: 'Deck Floor', folder: 'Deck Floor', folderVariants: ['Deck Floor', 'Deck floor'] },
  { key: 'fiberglass', label: 'Fiberglass', folder: 'Fiberglass', folderVariants: ['Fiberglass'] },
  { key: 'sideFender', label: 'Side Fender', folder: 'Side Fender', folderVariants: ['Side Fender', 'Side fender'] },
  { key: 'tube', label: 'Tube', folder: 'Tube', folderVariants: ['Tube'] },
  { key: 'tubeDecoration', label: 'Tube Decoration', folder: 'Tube decoration', folderVariants: ['Tube decoration', 'Tube Decoration'] },
  { key: 'upholestry', label: 'Upholstery', folder: 'Upholestry', folderVariants: ['Upholestry', 'Upholstery'] }
];

/**
 * Get customizer folder path for a model
 */
export const getCustomizerFolder = (modelName) => {
  const folder = customizerFolders[modelName];
  if (!folder) return null;
  return `/Customizer-images/${folder}`;
};

/**
 * Get base image path for a model
 */
export const getBaseImage = (modelName) => {
  const folder = getCustomizerFolder(modelName);
  if (!folder) return null;
  return `${folder}/Base/Boat - Base.webp`;
};

/**
 * Get image path for a specific part and color
 * Handles naming inconsistencies (Beige/Baige, Gray/Grey, etc.)
 */
export const getPartImage = (modelName, partKey, colorName) => {
  const folder = getCustomizerFolder(modelName);
  if (!folder) return null;
  
  const part = customizerParts.find(p => p.key === partKey);
  if (!part) return null;
  
  // Handle color name variations
  // For Baige (typo), try both Baige and Beige
  // For Gray, files use "Gray" (not "Grey")
  let filename = '';
  
  if (partKey === 'base') {
    filename = 'Boat - Base.webp';
  } else if (partKey === 'deckFloor') {
    filename = `deck floor - ${colorName}.webp`;
  } else if (partKey === 'fiberglass') {
    // Files use "Gray" not "Grey"
    filename = `Fiberglass - ${colorName}.webp`;
  } else if (partKey === 'sideFender') {
    filename = `Fender - ${colorName}.webp`;
  } else if (partKey === 'tube') {
    filename = `Tube - ${colorName}.webp`;
  } else if (partKey === 'tubeDecoration') {
    filename = `Tube decoration - ${colorName}.webp`;
  } else if (partKey === 'upholestry') {
    // Folder is "Upholestry" (typo), files use "Upholestry - [Color].webp"
    // Handle Baige typo - try both Baige and Beige
    if (colorName === 'Baige') {
      // Try Baige first (as it appears in some folders)
      filename = `Upholestry - Baige.webp`;
    } else {
      filename = `Upholestry - ${colorName}.webp`;
    }
  }
  
  // Use the folder name from config (which is "Upholestry" for upholstery)
  return `${folder}/${part.folder}/${filename}`;
};

