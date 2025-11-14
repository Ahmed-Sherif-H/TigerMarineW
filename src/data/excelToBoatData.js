/**
 * Excel to Boat Data Converter
 * 
 * This utility helps convert Excel/CSV data into the boat data format.
 * 
 * Usage:
 * 1. Export your Excel file to CSV
 * 2. Parse the CSV data
 * 3. Use the functions below to convert to the boat data structure
 */

/**
 * Converts a CSV row to boat specs object
 * @param {Object} row - CSV row object with column headers as keys
 * @returns {Object} Specs object
 */
export const csvRowToSpecs = (row) => {
  return {
    length: row['Length'] || row['length'] || '',
    beam: row['Beam'] || row['beam'] || '',
    draft: row['Draft'] || row['draft'] || '',
    engine: row['Engine'] || row['engine'] || '',
    fuelCapacity: row['Fuel Capacity'] || row['fuelCapacity'] || '',
    waterCapacity: row['Water Capacity'] || row['waterCapacity'] || '',
    maxSpeed: row['Max Speed'] || row['maxSpeed'] || '',
    cruisingSpeed: row['Cruising Speed'] || row['cruisingSpeed'] || '',
    capacity: row['Capacity'] || row['capacity'] || '',
    // Add any additional specs from your Excel
    weight: row['Weight'] || row['weight'] || '',
    material: row['Material'] || row['material'] || '',
  };
};

/**
 * Converts comma-separated features string to array
 * @param {String} featuresString - Comma-separated features
 * @returns {Array} Array of feature strings
 */
export const parseStandardFeatures = (featuresString) => {
  if (!featuresString) return [];
  return featuresString
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0);
};

/**
 * Converts optional features from Excel format to structured format
 * @param {Array} rows - Array of CSV rows with optional features
 * @returns {Array} Array of optional feature objects
 */
export const parseOptionalFeatures = (rows) => {
  return rows
    .filter(row => row['Optional Feature Name'] || row['optionalFeatureName'])
    .map(row => ({
      name: row['Optional Feature Name'] || row['optionalFeatureName'] || '',
      description: row['Optional Feature Description'] || row['optionalFeatureDescription'] || '',
      category: row['Optional Feature Category'] || row['optionalFeatureCategory'] || 'General',
      price: row['Optional Feature Price'] || row['optionalFeaturePrice'] || 'Optional'
    }));
};

/**
 * Groups optional features by category
 * @param {Array} optionalFeatures - Array of optional feature objects
 * @returns {Object} Object with categories as keys and features as values
 */
export const groupFeaturesByCategory = (optionalFeatures) => {
  return optionalFeatures.reduce((acc, feature) => {
    const category = feature.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {});
};

/**
 * Converts a complete CSV row to boat model object
 * @param {Object} row - CSV row with all boat data
 * @param {String} modelName - Model name (e.g., "TL950")
 * @returns {Object} Complete boat model object
 */
export const csvRowToBoatModel = (row, modelName) => {
  return {
    name: modelName || row['Model Name'] || row['modelName'],
    description: row['Description'] || row['description'] || '',
    shortDescription: row['Short Description'] || row['shortDescription'] || '',
    imageFile: row['Image File'] || row['imageFile'] || '',
    heroImageFile: row['Hero Image File'] || row['heroImageFile'] || '',
    specs: csvRowToSpecs(row),
    standardFeatures: parseStandardFeatures(
      row['Standard Features'] || row['standardFeatures'] || ''
    ),
    // Optional features would need to be parsed from separate rows
    // or from a JSON column in Excel
  };
};

/**
 * Example: How to use with CSV data
 * 
 * import Papa from 'papaparse'; // npm install papaparse
 * 
 * const convertExcelToBoatData = (csvText) => {
 *   const parsed = Papa.parse(csvText, { header: true });
 *   const boats = parsed.data.map(row => csvRowToBoatModel(row));
 *   return boats;
 * };
 */

/**
 * Alternative: Direct JSON structure for easy manual entry
 * This is easier if you want to manually add boats without Excel conversion
 */
export const createBoatModel = ({
  name,
  description,
  shortDescription,
  imageFile,
  heroImageFile,
  specs,
  standardFeatures,
  optionalFeatures
}) => {
  return {
    name,
    description,
    shortDescription,
    imageFile,
    heroImageFile,
    specs: {
      length: specs.length || '',
      beam: specs.beam || '',
      draft: specs.draft || '',
      engine: specs.engine || '',
      fuelCapacity: specs.fuelCapacity || '',
      waterCapacity: specs.waterCapacity || '',
      maxSpeed: specs.maxSpeed || '',
      cruisingSpeed: specs.cruisingSpeed || '',
      capacity: specs.capacity || '',
      ...specs // Include any additional specs
    },
    standardFeatures: standardFeatures || [],
    optionalFeatures: optionalFeatures || [],
    optionalFeaturesByCategory: groupFeaturesByCategory(optionalFeatures || [])
  };
};

