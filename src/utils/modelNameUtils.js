/**
 * Model Name Utilities
 * Converts short model names (e.g., "TL850") to full display names (e.g., "TopLine 850")
 */

// Map of short model names to full display names
// Includes all possible variations to ensure correct mapping
const MODEL_NAME_MAP = {
  // TopLine variations
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
  'Topline 950': 'TopLine 950',
  'Topline 850': 'TopLine 850',
  'Topline 750': 'TopLine 750',
  'Topline 650': 'TopLine 650',
  
  // ProLine variations - CRITICAL: These must be correct
  'PL620': 'ProLine 620',
  'PL550': 'ProLine 550',
  'ProLine 620': 'ProLine 620',
  'ProLine 550': 'ProLine 550',
  'ProLine620': 'ProLine 620',
  'ProLine550': 'ProLine 550',
  'Proline 620': 'ProLine 620',
  'Proline 550': 'ProLine 550',
  'Proline620': 'ProLine 620',
  'Proline550': 'ProLine 550',
  
  // SportLine variations
  'SL520': 'SportLine 520',
  'SL480': 'SportLine 480',
  'SportLine 520': 'SportLine 520',
  'SportLine 480': 'SportLine 480',
  
  // Open variations
  'OP850': 'Open 850',
  'OP750': 'Open 750',
  'OP650': 'Open 650',
  'Open 850': 'Open 850',
  'Open 750': 'Open 750',
  'Open 650': 'Open 650',
  'Open850': 'Open 850',
  'Open750': 'Open 750',
  'Open650': 'Open 650',
  
  // MaxLine
  'ML38': 'MaxLine 38',
  'MaxLine 38': 'MaxLine 38',
  
  // Infinity
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
  
  // DIRECT MAPPING FIRST - Most reliable
  // Check exact matches first (case-sensitive)
  if (MODEL_NAME_MAP[normalizedName]) {
    return MODEL_NAME_MAP[normalizedName];
  }
  
  // Check case-insensitive matches
  const matchingKey = Object.keys(MODEL_NAME_MAP).find(
    key => key.toLowerCase() === normalizedName.toLowerCase()
  );
  if (matchingKey) {
    return MODEL_NAME_MAP[matchingKey];
  }
  
  // NUMBER-BASED DETECTION - For models with numbers (550, 620, 850, 650, etc.)
  // Extract number from model name
  const numberMatch = normalizedName.match(/\d+/);
  const number = numberMatch ? numberMatch[0] : '';
  
  if (number) {
    // ProLine models - check for 550 or 620
    if (number === '550' && (normalizedName.includes('ProLine') || normalizedName.includes('PL') || normalizedName.toLowerCase().includes('proline'))) {
      return 'ProLine 550';
    }
    if (number === '620' && (normalizedName.includes('ProLine') || normalizedName.includes('PL') || normalizedName.toLowerCase().includes('proline'))) {
      return 'ProLine 620';
    }
    
    // Open models - check for 650 or 850
    if (number === '650' && normalizedName.toLowerCase().includes('open')) {
      return 'Open 650';
    }
    if (number === '850' && normalizedName.toLowerCase().includes('open')) {
      return 'Open 850';
    }
    
    // TopLine models
    if (number === '750' && (normalizedName.includes('TopLine') || normalizedName.includes('TL') || normalizedName.toLowerCase().includes('topline'))) {
      return 'TopLine 750';
    }
    if (number === '850' && (normalizedName.includes('TopLine') || normalizedName.includes('TL') || normalizedName.toLowerCase().includes('topline'))) {
      return 'TopLine 850';
    }
    if (number === '950' && (normalizedName.includes('TopLine') || normalizedName.includes('TL') || normalizedName.toLowerCase().includes('topline'))) {
      return 'TopLine 950';
    }
  }
  
  // Use category if available to construct name
  const catName = category?.name || model.categoryName;
  if (catName && number) {
    return `${catName} ${number}`;
  }
  if (catName) {
    return getFullModelName(normalizedName, catName);
  }
  
  // Fallback: return normalized name
  return normalizedName;
}

/**
 * Extract numeric value from model name for sorting
 * @param {string} modelName - Model name (e.g., "TL950", "ProLine 620")
 * @returns {number} Numeric value, or 0 if no number found
 */
export function extractModelNumber(modelName) {
  if (!modelName) return 0;
  const match = modelName.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Sort models by their number in descending order (950 → 650)
 * Models without numbers will be sorted alphabetically at the end
 * @param {Array} models - Array of model objects
 * @returns {Array} Sorted array of models
 */
export function sortModelsByNumberDesc(models) {
  if (!models || !Array.isArray(models)) return models;
  
  return [...models].sort((a, b) => {
    const numA = extractModelNumber(a.name);
    const numB = extractModelNumber(b.name);
    
    // If both have numbers, sort descending (950 → 650)
    if (numA > 0 && numB > 0) {
      return numB - numA; // Descending order
    }
    
    // If only one has a number, prioritize it
    if (numA > 0) return -1;
    if (numB > 0) return 1;
    
    // If neither has a number, sort alphabetically
    return (a.name || '').localeCompare(b.name || '');
  });
}

