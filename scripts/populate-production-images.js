/**
 * Populate Production Database with Image Filenames
 * 
 * This script connects to your production database and populates image filenames
 * Run this locally (it connects to production database via DATABASE_URL)
 * 
 * Usage:
 * 1. Set DATABASE_URL in your local .env to point to production database
 * 2. Run: node scripts/populate-production-images.js
 */

require('dotenv').config({ path: '../backend/.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs-extra');
const path = require('path');

const prisma = new PrismaClient();

// Model name to folder name mapping (must match backend)
const modelFolderMap = {
  'TL950': 'TopLine950',
  'TL850': 'TopLine850',
  'TL750': 'TopLine750',
  'TL650': 'TopLine650',
  'PL620': 'ProLine620',
  'PL550': 'ProLine550',
  'SL520': 'SportLine520',
  'SL480': 'SportLine480',
  'OP850': 'Open850',
  'OP750': 'Open750',
  'OP650': 'Open650',
  'ML38': 'MaxLine 38',
  'Infinity 280': 'Infinity 280',
  'Striker 330': 'Striker 330'
};

async function getModelFolderName(modelName) {
  return modelFolderMap[modelName] || modelName;
}

async function scanImageFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi'].includes(ext);
  });
}

async function populateImages() {
  console.log('🔍 Starting image population...\n');
  console.log('⚠️  WARNING: This will connect to PRODUCTION database!');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'NOT SET'}\n`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env file');
    console.error('   Set it to your production database URL');
    process.exit(1);
  }
  
  // Confirm production database
  if (!process.env.DATABASE_URL.includes('render.com') && !process.env.DATABASE_URL.includes('production')) {
    console.warn('⚠️  DATABASE_URL does not appear to be production database');
    console.warn('   Make sure you want to modify this database!\n');
  }
  
  try {
    // Get all models
    const models = await prisma.model.findMany({
      include: {
        galleryImages: true,
        interiorFiles: true,
        videoFiles: true
      }
    });
    
    console.log(`📊 Found ${models.length} models\n`);
    
    // Note: We can't scan Render's file system from local machine
    // So we'll use the Admin Dashboard approach instead
    console.log('❌ Cannot scan Render file system from local machine');
    console.log('\n✅ SOLUTION: Use Admin Dashboard instead!\n');
    console.log('1. Go to: https://tigermarineweb.netlify.app/admin');
    console.log('2. For each model:');
    console.log('   - Select model from dropdown');
    console.log('   - Upload images using upload buttons');
    console.log('   - Click "Save Changes"');
    console.log('\nThis automatically:');
    console.log('  - Uploads images to Render backend');
    console.log('  - Saves filenames to database');
    console.log('  - Makes images available immediately\n');
    
    // Alternative: Show what needs to be done
    console.log('📋 Models that need images:');
    models.forEach(model => {
      const hasImages = !!(model.imageFile || model.heroImageFile || model.contentImageFile || 
                          model.galleryImages.length > 0 || model.interiorFiles.length > 0);
      if (!hasImages) {
        console.log(`   ❌ ${model.name} - No images`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

populateImages();

