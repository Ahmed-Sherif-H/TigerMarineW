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
  
  // Try direct mapping first
  if (MODEL_NAME_MAP[model.name]) {
    return MODEL_NAME_MAP[model.name];
  }
  
  // Use category if available
  const catName = category?.name || model.categoryName;
  if (catName) {
    return getFullModelName(model.name, catName);
  }
  
  // Fallback
  return model.name;
}

