# Migration Script for Windows PowerShell
# Converts Cloudinary URLs to local filenames in database

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
$BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
$ADMIN_EMAIL = "your-admin@email.com"  # <-- CHANGE THIS
$ADMIN_PASSWORD = "your-password"       # <-- CHANGE THIS

# ============================================
# DO NOT EDIT BELOW THIS LINE
# ============================================

Write-Host "🚀 Starting Cloudinary to Local Migration..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Yellow
Write-Host ""

# Set environment variables for the Node.js script
$env:BACKEND_URL = $BACKEND_URL
$env:ADMIN_EMAIL = $ADMIN_EMAIL
$env:ADMIN_PASSWORD = $ADMIN_PASSWORD

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if the migration script exists
$scriptPath = "scripts/migrate-cloudinary-to-local.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Migration script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Running migration script..." -ForegroundColor Cyan
Write-Host ""

# Run the Node.js migration script
try {
    node $scriptPath
    Write-Host ""
    Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
