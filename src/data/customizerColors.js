/**
 * Customizer Colors Configuration
 * Lists available colors for each part type across all models
 * Colors are extracted from the actual filenames in Customizer-images folders
 */

// Common colors found across all models
export const availableColorsByPart = {
  deckFloor: ['Beige', 'Black', 'Brown', 'Gray', 'White'],
  fiberglass: ['Black', 'Gray', 'White', 'Dark Gray'],
  sideFender: ['Black', 'Gray'],
  tube: ['Black', 'Dark Gray', 'Light Gray', 'White'],
  tubeDecoration: ['Black', 'Dark Gray', 'Light Gray', 'Navy Blue', 'White'],
  upholestry: ['Beige', 'Black', 'Brown', 'Dark Red', 'Gray', 'White', 'Baige'] // Note: Baige is a typo in some folders
};

/**
 * Get available colors for a specific part
 */
export const getAvailableColors = (partKey) => {
  return availableColorsByPart[partKey] || [];
};

/**
 * Check if a color exists for a part (by trying to construct the filename)
 */
export const colorExists = (partKey, colorName) => {
  const colors = getAvailableColors(partKey);
  return colors.includes(colorName);
};

