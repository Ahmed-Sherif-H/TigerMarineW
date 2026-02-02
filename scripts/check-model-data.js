/**
 * Check Model Data Script
 * 
 * This script checks all models in the database and reports:
 * - Which models have specs
 * - Which models have standard features
 * - Which models have optional features
 * - Which models are missing data
 * 
 * Usage:
 *   node scripts/check-model-data.js
 * 
 * Or with credentials:
 *   BACKEND_URL="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." node scripts/check-model-data.js
 */

const API_BASE_URL = process.env.BACKEND_URL || 'https://tigermarinewbackend-production.up.railway.app/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

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
 * Fetch all models
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
 * Check a single model's data
 */
function checkModel(model) {
  const issues = [];
  const data = {
    id: model.id,
    name: model.name,
    hasSpecs: false,
    specsCount: 0,
    hasStandardFeatures: false,
    standardFeaturesCount: 0,
    hasOptionalFeatures: false,
    optionalFeaturesCount: 0,
    issues: []
  };
  
  // Check specs
  if (model.specs) {
    if (Array.isArray(model.specs)) {
      data.specsCount = model.specs.length;
      data.hasSpecs = model.specs.length > 0;
      if (model.specs.length === 0) {
        issues.push('Specs array is empty');
      }
    } else if (typeof model.specs === 'object') {
      data.specsCount = Object.keys(model.specs).length;
      data.hasSpecs = Object.keys(model.specs).length > 0;
      if (Object.keys(model.specs).length === 0) {
        issues.push('Specs object is empty');
      }
    }
  } else {
    issues.push('No specs field');
  }
  
  // Check standard features
  const standardFeatures = model.standardFeatures || model.features || [];
  if (Array.isArray(standardFeatures)) {
    data.standardFeaturesCount = standardFeatures.length;
    data.hasStandardFeatures = standardFeatures.length > 0;
    if (standardFeatures.length === 0) {
      issues.push('No standard features');
    }
  } else {
    issues.push('Standard features is not an array');
  }
  
  // Check optional features
  if (model.optionalFeatures) {
    if (Array.isArray(model.optionalFeatures)) {
      data.optionalFeaturesCount = model.optionalFeatures.length;
      data.hasOptionalFeatures = model.optionalFeatures.length > 0;
      if (model.optionalFeatures.length === 0) {
        issues.push('Optional features array is empty');
      }
    } else {
      issues.push('Optional features is not an array');
    }
  } else {
    issues.push('No optional features field');
  }
  
  data.issues = issues;
  return data;
}

/**
 * Main function
 */
async function checkAllModels() {
  console.log('🔍 Checking Model Data...\n');
  console.log(`Backend URL: ${API_BASE_URL}\n`);
  
  try {
    // Login
    console.log('📝 Logging in...');
    const token = await login();
    console.log('✅ Login successful\n');
    
    // Fetch models
    console.log('📦 Fetching models...');
    const models = await getAllModels(token);
    console.log(`Found ${models.length} models\n`);
    
    // Check each model
    const results = models.map(checkModel);
    
    // Summary
    console.log('='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total models: ${models.length}\n`);
    
    const withSpecs = results.filter(r => r.hasSpecs).length;
    const withStandardFeatures = results.filter(r => r.hasStandardFeatures).length;
    const withOptionalFeatures = results.filter(r => r.hasOptionalFeatures).length;
    const withIssues = results.filter(r => r.issues.length > 0).length;
    
    console.log(`✅ Models with specs: ${withSpecs}/${models.length}`);
    console.log(`✅ Models with standard features: ${withStandardFeatures}/${models.length}`);
    console.log(`✅ Models with optional features: ${withOptionalFeatures}/${models.length}`);
    console.log(`⚠️  Models with missing data: ${withIssues}/${models.length}\n`);
    
    // Detailed report
    console.log('='.repeat(80));
    console.log('DETAILED REPORT');
    console.log('='.repeat(80));
    console.log('');
    
    results.forEach(result => {
      const status = result.issues.length === 0 ? '✅' : '⚠️';
      console.log(`${status} ${result.name} (ID: ${result.id})`);
      console.log(`   Specs: ${result.hasSpecs ? `✅ ${result.specsCount}` : '❌ Missing'}`);
      console.log(`   Standard Features: ${result.hasStandardFeatures ? `✅ ${result.standardFeaturesCount}` : '❌ Missing'}`);
      console.log(`   Optional Features: ${result.hasOptionalFeatures ? `✅ ${result.optionalFeaturesCount}` : '❌ Missing'}`);
      
      if (result.issues.length > 0) {
        console.log(`   Issues:`);
        result.issues.forEach(issue => {
          console.log(`     - ${issue}`);
        });
      }
      console.log('');
    });
    
    // Models missing data
    const missingData = results.filter(r => r.issues.length > 0);
    if (missingData.length > 0) {
      console.log('='.repeat(80));
      console.log('MODELS MISSING DATA');
      console.log('='.repeat(80));
      missingData.forEach(result => {
        console.log(`\n${result.name} (ID: ${result.id}):`);
        result.issues.forEach(issue => {
          console.log(`  - ${issue}`);
        });
      });
    }
    
    // Export to JSON (optional)
    const exportData = {
      summary: {
        total: models.length,
        withSpecs,
        withStandardFeatures,
        withOptionalFeatures,
        withIssues
      },
      models: results
    };
    
    // Write to file if in Node.js environment
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(process.cwd(), 'model-data-check.json');
      fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
      console.log(`\n📄 Full report exported to: ${outputPath}`);
    }
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n❌ Check failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run check
if (typeof require !== 'undefined' && require.main === module) {
  checkAllModels().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { checkAllModels, checkModel };
