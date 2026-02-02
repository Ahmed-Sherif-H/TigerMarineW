/**
 * Restore Model Data Script
 * 
 * Restores specs, standardFeatures, and optionalFeatures from exported JSON file
 * to the database.
 * 
 * Usage:
 *   node scripts/restore-model-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.BACKEND_URL || 'https://tigermarinewbackend-production.up.railway.app/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'tiger-marine-data-2026-02-01.json');

/**
 * Login to get admin token
 */
async function login() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${error}`);
  }
  
  const data = await response.json();
  return data.token || data.data?.token;
}

/**
 * Update a model
 */
async function updateModel(id, modelData, token) {
  const response = await fetch(`${API_BASE_URL}/models/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(modelData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update model ${id}: ${error}`);
  }
  
  return await response.json();
}

/**
 * Load exported data
 */
function loadExportedData() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Data file not found: ${DATA_FILE}`);
  }
  
  const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
  const data = JSON.parse(fileContent);
  
  if (!data.models || !Array.isArray(data.models)) {
    throw new Error('Invalid data format: expected { models: [...] }');
  }
  
  return data.models;
}

/**
 * Create a map of models by name for easy lookup
 */
function createModelMap(models) {
  const map = new Map();
  models.forEach(model => {
    // Use name as key (e.g., "Open750", "TopLine950")
    map.set(model.name, model);
  });
  return map;
}

/**
 * Fetch all models from database
 */
async function getAllModels(token) {
  const response = await fetch(`${API_BASE_URL}/models`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data || data;
}

/**
 * Restore data for a single model
 */
function prepareRestoreData(exportedModel, dbModel) {
  const updates = {};
  let hasChanges = false;
  
  // Restore specs
  if (exportedModel.specs && Object.keys(exportedModel.specs).length > 0) {
    updates.specs = exportedModel.specs;
    hasChanges = true;
    console.log(`  - Specs: ${Object.keys(exportedModel.specs).length} entries`);
  }
  
  // Restore standard features
  if (exportedModel.standardFeatures && Array.isArray(exportedModel.standardFeatures) && exportedModel.standardFeatures.length > 0) {
    updates.standardFeatures = exportedModel.standardFeatures;
    hasChanges = true;
    console.log(`  - Standard Features: ${exportedModel.standardFeatures.length} items`);
  }
  
  // Restore optional features
  if (exportedModel.optionalFeatures && Array.isArray(exportedModel.optionalFeatures) && exportedModel.optionalFeatures.length > 0) {
    updates.optionalFeatures = exportedModel.optionalFeatures;
    hasChanges = true;
    console.log(`  - Optional Features: ${exportedModel.optionalFeatures.length} items`);
  }
  
  return { updates, hasChanges };
}

/**
 * Main restore function
 */
async function restoreData() {
  console.log('🔄 Restoring Model Data...\n');
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Backend URL: ${API_BASE_URL}\n`);
  
  try {
    // Load exported data
    console.log('📂 Loading exported data...');
    const exportedModels = loadExportedData();
    console.log(`✅ Loaded ${exportedModels.length} models from export\n`);
    
    // Create map for easy lookup
    const exportedMap = createModelMap(exportedModels);
    
    // Login
    console.log('📝 Logging in...');
    const token = await login();
    console.log('✅ Login successful\n');
    
    // Fetch current models from database
    console.log('📦 Fetching models from database...');
    const dbModels = await getAllModels(token);
    console.log(`✅ Found ${dbModels.length} models in database\n`);
    
    // Restore data for each model
    let restored = 0;
    let skipped = 0;
    let notFound = 0;
    
    for (const dbModel of dbModels) {
      console.log(`\n🔄 Processing: ${dbModel.name} (ID: ${dbModel.id})`);
      
      // Find matching exported model
      const exportedModel = exportedMap.get(dbModel.name);
      
      if (!exportedModel) {
        console.log(`  ⚠️  No matching data found in export`);
        notFound++;
        continue;
      }
      
      // Prepare restore data
      const { updates, hasChanges } = prepareRestoreData(exportedModel, dbModel);
      
      if (!hasChanges) {
        console.log(`  ⏭️  No data to restore`);
        skipped++;
        continue;
      }
      
      // Update model in database
      console.log(`  💾 Updating database...`);
      await updateModel(dbModel.id, updates, token);
      restored++;
      console.log(`  ✅ Restored successfully`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('RESTORE SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total models in database: ${dbModels.length}`);
    console.log(`Total models in export: ${exportedModels.length}`);
    console.log(`✅ Restored: ${restored}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⚠️  Not found in export: ${notFound}`);
    console.log('\n✅ Restore complete!');
    console.log('\n⚠️  IMPORTANT: Verify the data in Admin Dashboard!');
    
  } catch (error) {
    console.error('\n❌ Restore failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run restore
restoreData().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
