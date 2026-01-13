/**
 * Model Name Utilities
 * Converts short model names (e.g., "TL850") to full display names (e.g., "TopLine 850")
 */

// Map of short model names to full display names
const MODEL_NAME_MAP = {
  'TL950': 'TopLine 950',
  'TL850': 'TopLine 850',
  'TL750': 'TopLine 750',
  'TL650': 'TopLine 650',
  'TopLine 950': 'TopLine 950',
  'TopLine 850': 'TopLine 850',
  'TopLine 750': 'TopLine 750',
  'TopLine 650': 'TopLine 650',
  'TopLine950': 'TopLine 950',
  'TopLine850': 'TopLine 850',
  'TopLine750': 'TopLine 750',
  'TopLine650': 'TopLine 650',
  'PL620': 'ProLine 620',
  'PL550': 'ProLine 550',
  'SL520': 'SportLine 520',
  'SL480': 'SportLine 480',
  'OP850': 'Open 850',
  'OP750': 'Open 750',
  'OP650': 'Open 650',
  'ML38': 'MaxLine 38',
  'Infinity 280': 'Infinity 280'
};

/**
 * Get the full display name for a model
 * @param {string} shortName - Short model name (e.g., "TL850")
 * @param {string} categoryName - Optional category name to use as fallback
 * @returns {string} Full display name (e.g., "TopLine 850")
 */
export function getFullModelName(shortName, categoryName = null) {
  if (!shortName) return '';
  
  // Check if it's already in the map
  if (MODEL_NAME_MAP[shortName]) {
    return MODEL_NAME_MAP[shortName];
  }
  
  // If category name is provided, try to construct it
  if (categoryName) {
    // Extract number from model name (e.g., "TL850" -> "850")
    const numberMatch = shortName.match(/\d+/);
    const number = numberMatch ? numberMatch[0] : '';
    
    if (number) {
      return `${categoryName} ${number}`;
    }
    return `${categoryName} ${shortName}`;
  }
  
  // Fallback: return the short name as-is
  return shortName;
}

/**
 * Get full model name from model object (uses category if available)
 * @param {object} model - Model object with name and optional categoryId/categoryName
 * @param {object} category - Optional category object
 * @returns {string} Full display name
 */
export function getModelDisplayName(model, category = null) {
  if (!model || !model.name) return '';
  
  // Normalize model name for matching (trim whitespace, handle variations)
  const normalizedName = model.name.trim();
  
  // Try direct mapping first (case-sensitive)
  if (MODEL_NAME_MAP[normalizedName]) {
    return MODEL_NAME_MAP[normalizedName];
  }
  
  // Try case-insensitive matching
  const matchingKey = Object.keys(MODEL_NAME_MAP).find(
    key => key.toLowerCase() === normalizedName.toLowerCase()
  );
  if (matchingKey) {
    return MODEL_NAME_MAP[matchingKey];
  }
  
  // Special handling for TL750 - ensure it shows "TopLine 750" not "TopLine 850"
  if (normalizedName === 'TL750' || normalizedName.toLowerCase() === 'tl750') {
    return 'TopLine 750';
  }
  
  // Special handling for TL850 - ensure it shows "TopLine 850" not "TopLine 950"
  if (normalizedName === 'TL850' || normalizedName.toLowerCase() === 'tl850') {
    return 'TopLine 850';
  }
  
  // Special handling for TL950 - ensure it shows "TopLine 950"
  if (normalizedName === 'TL950' || normalizedName.toLowerCase() === 'tl950') {
    return 'TopLine 950';
  }
  
  // Use category if available
  const catName = category?.name || model.categoryName;
  if (catName) {
    return getFullModelName(normalizedName, catName);
  }
  
  // Fallback
  return normalizedName;
}

