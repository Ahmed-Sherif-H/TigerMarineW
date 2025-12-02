/**
 * Color Name to Hex Code Mapping
 * Maps color names from filenames to actual hex color codes for display
 */

export const colorNameToHex = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Gray': '#808080',
  'Dark Gray': '#404040',
  'Light Gray': '#C0C0C0',
  'Navy Blue': '#000080',
  'Beige': '#F5F5DC',
  'Brown': '#8B4513',
  'Dark Red': '#8B0000',
  'Baige': '#F5F5DC' // Typo variant
};

/**
 * Get hex color for a color name
 */
export const getColorHex = (colorName) => {
  return colorNameToHex[colorName] || '#CCCCCC'; // Default gray if not found
};

