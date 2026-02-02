# Check Model Data Script for Windows PowerShell
# Checks all models for missing specs, features, and optional features

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
$BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
$ADMIN_EMAIL = "your-admin@email.com"  # <-- CHANGE THIS
$ADMIN_PASSWORD = "your-password"       # <-- CHANGE THIS

# ============================================
# DO NOT EDIT BELOW THIS LINE
# ============================================

Write-Host "🔍 Checking Model Data..." -ForegroundColor Cyan
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

# Check if the script exists
$scriptPath = "scripts/check-model-data.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Running check script..." -ForegroundColor Cyan
Write-Host ""

# Run the Node.js script
try {
    node $scriptPath
    Write-Host ""
    Write-Host "✅ Check completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Check the output above for details." -ForegroundColor Yellow
    Write-Host "📄 Full report saved to: model-data-check.json" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Check failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
