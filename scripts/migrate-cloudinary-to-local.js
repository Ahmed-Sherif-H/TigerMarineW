/**
 * Migration Script: Convert Cloudinary URLs to Local Filenames
 * 
 * This script connects to your backend API and converts all Cloudinary URLs
 * in the database to local filenames.
 * 
 * Usage:
 *   1. Set BACKEND_URL environment variable or edit below
 *   2. Set ADMIN_EMAIL and ADMIN_PASSWORD (or use existing session)
 *   3. Run: node scripts/migrate-cloudinary-to-local.js
 * 
 * IMPORTANT: Backup your database before running this script!
 */

const API_BASE_URL = process.env.BACKEND_URL || 'https://tigermarinewbackend-production.up.railway.app/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Extract filename from Cloudinary URL
 * Example: https://res.cloudinary.com/.../v123/models/Open850/DJI_0202.jpg -> DJI_0202.jpg
 */
function extractFilenameFromCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  // If it's not a Cloudinary URL, return as-is
  if (!url.includes('cloudinary.com')) {
    return url;
  }
  
  // Extract filename from URL
  // Cloudinary URLs format: https://res.cloudinary.com/.../v123/folder/path/filename.jpg
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
  // Remove query parameters if any
  const cleanFilename = filename.split('?')[0];
  
  return cleanFilename;
}

/**
 * Check if a string is a Cloudinary URL
 */
function isCloudinaryUrl(str) {
  return str && typeof str === 'string' && str.includes('cloudinary.com');
}

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
 * Fetch all categories
 */
async function getAllCategories(token) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data || data;
}

/**
 * Update a category
 */
async function updateCategory(id, categoryData, token) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update category ${id}: ${error}`);
  }
  
  return await response.json();
}

/**
 * Migrate a single model
 */
function migrateModel(model) {
  const updates = {};
  let hasChanges = false;
  
  // Migrate imageFile
  if (isCloudinaryUrl(model.imageFile)) {
    updates.imageFile = extractFilenameFromCloudinaryUrl(model.imageFile);
    hasChanges = true;
    console.log(`  - imageFile: ${model.imageFile.substring(0, 50)}... → ${updates.imageFile}`);
  }
  
  // Migrate heroImageFile
  if (isCloudinaryUrl(model.heroImageFile)) {
    updates.heroImageFile = extractFilenameFromCloudinaryUrl(model.heroImageFile);
    hasChanges = true;
    console.log(`  - heroImageFile: ${model.heroImageFile.substring(0, 50)}... → ${updates.heroImageFile}`);
  }
  
  // Migrate contentImageFile
  if (isCloudinaryUrl(model.contentImageFile)) {
    updates.contentImageFile = extractFilenameFromCloudinaryUrl(model.contentImageFile);
    hasChanges = true;
    console.log(`  - contentImageFile: ${model.contentImageFile.substring(0, 50)}... → ${updates.contentImageFile}`);
  }
  
  // Migrate interiorMainImage
  if (isCloudinaryUrl(model.interiorMainImage)) {
    updates.interiorMainImage = extractFilenameFromCloudinaryUrl(model.interiorMainImage);
    hasChanges = true;
    console.log(`  - interiorMainImage: ${model.interiorMainImage.substring(0, 50)}... → ${updates.interiorMainImage}`);
  }
  
  // Migrate galleryFiles array
  if (Array.isArray(model.galleryFiles) && model.galleryFiles.length > 0) {
    const migratedGallery = model.galleryFiles.map(file => {
      const fileStr = typeof file === 'string' ? file : (file?.filename || file);
      if (isCloudinaryUrl(fileStr)) {
        hasChanges = true;
        return extractFilenameFromCloudinaryUrl(fileStr);
      }
      return fileStr;
    });
    if (hasChanges) {
      updates.galleryFiles = migratedGallery;
      console.log(`  - galleryFiles: ${model.galleryFiles.length} files migrated`);
    }
  }
  
  // Migrate interiorFiles array
  if (Array.isArray(model.interiorFiles) && model.interiorFiles.length > 0) {
    const migratedInterior = model.interiorFiles.map(file => {
      const fileStr = typeof file === 'string' ? file : (file?.filename || file);
      if (isCloudinaryUrl(fileStr)) {
        hasChanges = true;
        return extractFilenameFromCloudinaryUrl(fileStr);
      }
      return fileStr;
    });
    if (hasChanges) {
      updates.interiorFiles = migratedInterior;
      console.log(`  - interiorFiles: ${model.interiorFiles.length} files migrated`);
    }
  }
  
  // Migrate videoFiles array (preserve YouTube URLs)
  if (Array.isArray(model.videoFiles) && model.videoFiles.length > 0) {
    const migratedVideos = model.videoFiles.map(file => {
      const fileStr = typeof file === 'string' ? file : (file?.filename || file);
      // Skip YouTube URLs
      if (fileStr.includes('youtube.com') || fileStr.includes('youtu.be')) {
        return fileStr;
      }
      if (isCloudinaryUrl(fileStr)) {
        hasChanges = true;
        return extractFilenameFromCloudinaryUrl(fileStr);
      }
      return fileStr;
    });
    if (hasChanges) {
      updates.videoFiles = migratedVideos;
      console.log(`  - videoFiles: ${model.videoFiles.length} files migrated`);
    }
  }
  
  return { updates, hasChanges };
}

/**
 * Migrate a single category
 */
function migrateCategory(category) {
  const updates = {};
  let hasChanges = false;
  
  // Migrate image
  if (isCloudinaryUrl(category.image)) {
    updates.image = extractFilenameFromCloudinaryUrl(category.image);
    hasChanges = true;
    console.log(`  - image: ${category.image.substring(0, 50)}... → ${updates.image}`);
  }
  
  // Migrate heroImage
  if (isCloudinaryUrl(category.heroImage)) {
    updates.heroImage = extractFilenameFromCloudinaryUrl(category.heroImage);
    hasChanges = true;
    console.log(`  - heroImage: ${category.heroImage.substring(0, 50)}... → ${updates.heroImage}`);
  }
  
  return { updates, hasChanges };
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Cloudinary to Local Migration...\n');
  console.log(`Backend URL: ${API_BASE_URL}\n`);
  
  try {
    // Login
    console.log('📝 Logging in...');
    const token = await login();
    console.log('✅ Login successful\n');
    
    // Migrate Models
    console.log('📦 Fetching models...');
    const models = await getAllModels(token);
    console.log(`Found ${models.length} models\n`);
    
    let modelsUpdated = 0;
    for (const model of models) {
      console.log(`\n🔄 Migrating model: ${model.name} (ID: ${model.id})`);
      const { updates, hasChanges } = migrateModel(model);
      
      if (hasChanges) {
        await updateModel(model.id, updates, token);
        modelsUpdated++;
        console.log(`✅ Model ${model.name} updated`);
      } else {
        console.log(`⏭️  No Cloudinary URLs found, skipping`);
      }
    }
    
    console.log(`\n✅ Models migration complete: ${modelsUpdated}/${models.length} updated\n`);
    
    // Migrate Categories
    console.log('📁 Fetching categories...');
    const categories = await getAllCategories(token);
    console.log(`Found ${categories.length} categories\n`);
    
    let categoriesUpdated = 0;
    for (const category of categories) {
      console.log(`\n🔄 Migrating category: ${category.name} (ID: ${category.id})`);
      const { updates, hasChanges } = migrateCategory(category);
      
      if (hasChanges) {
        await updateCategory(category.id, updates, token);
        categoriesUpdated++;
        console.log(`✅ Category ${category.name} updated`);
      } else {
        console.log(`⏭️  No Cloudinary URLs found, skipping`);
      }
    }
    
    console.log(`\n✅ Categories migration complete: ${categoriesUpdated}/${categories.length} updated\n`);
    
    console.log('🎉 Migration complete!');
    console.log(`\nSummary:`);
    console.log(`  - Models updated: ${modelsUpdated}/${models.length}`);
    console.log(`  - Categories updated: ${categoriesUpdated}/${categories.length}`);
    console.log(`\n⚠️  IMPORTANT: Verify images load correctly on the frontend!`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrate().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

export { migrate, extractFilenameFromCloudinaryUrl, isCloudinaryUrl };
