/**
 * Export Model Data Script
 * 
 * Exports all model data including:
 * - Specs
 * - Standard features
 * - Optional features
 * - All other model data
 * 
 * Usage:
 *   node scripts/export-model-data.js
 */

const API_BASE_URL = process.env.BACKEND_URL || 'https://tigermarinewbackend-production.up.railway.app/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function login() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${await response.text()}`);
  }
  
  const data = await response.json();
  return data.token || data.data?.token;
}

async function getAllModels(token) {
  const response = await fetch(`${API_BASE_URL}/models`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data || data;
}

async function exportData() {
  console.log('📦 Exporting Model Data...\n');
  
  try {
    console.log('📝 Logging in...');
    const token = await login();
    console.log('✅ Login successful\n');
    
    console.log('📦 Fetching models...');
    const models = await getAllModels(token);
    console.log(`Found ${models.length} models\n`);
    
    // Prepare export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalModels: models.length,
      models: models.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        shortDescription: model.shortDescription,
        specs: model.specs || {},
        standardFeatures: model.standardFeatures || model.features || [],
        optionalFeatures: model.optionalFeatures || [],
        // Include other fields you might need
        imageFile: model.imageFile,
        heroImageFile: model.heroImageFile,
        contentImageFile: model.contentImageFile,
        galleryFiles: model.galleryFiles || [],
        interiorFiles: model.interiorFiles || [],
        videoFiles: model.videoFiles || [],
        interiorMainImage: model.interiorMainImage,
        categoryId: model.categoryId,
      }))
    };
    
    // Write to file
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(process.cwd(), 'exported-models-data.json');
      fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
      console.log(`✅ Export complete!`);
      console.log(`📄 Data saved to: ${outputPath}`);
      console.log(`\nSummary:`);
      console.log(`  - Total models: ${models.length}`);
      console.log(`  - Models with specs: ${models.filter(m => m.specs && Object.keys(m.specs).length > 0).length}`);
      console.log(`  - Models with standard features: ${models.filter(m => (m.standardFeatures || m.features || []).length > 0).length}`);
      console.log(`  - Models with optional features: ${models.filter(m => (m.optionalFeatures || []).length > 0).length}`);
    } else {
      console.log(JSON.stringify(exportData, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  exportData();
}

export { exportData };
