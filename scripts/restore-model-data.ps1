# Restore Model Data Script for Windows PowerShell
# Restores specs, standardFeatures, and optionalFeatures from exported JSON

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================
$BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
$ADMIN_EMAIL = "admin@tigermarine.com"  # <-- CHANGE THIS
$ADMIN_PASSWORD = "admin123"      # <-- CHANGE THIS

# ============================================
# DO NOT EDIT BELOW THIS LINE
# ============================================

Write-Host "Restoring Model Data..." -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:BACKEND_URL = $BACKEND_URL
$env:ADMIN_EMAIL = $ADMIN_EMAIL
$env:ADMIN_PASSWORD = $ADMIN_PASSWORD

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if data file exists
$dataFile = "tiger-marine-data-2026-02-01.json"
if (-not (Test-Path $dataFile)) {
    Write-Host "[ERROR] Data file not found: $dataFile" -ForegroundColor Red
    Write-Host "Please ensure the exported JSON file is in the root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Data file found: $dataFile" -ForegroundColor Green
Write-Host ""

# Check if the script exists
$scriptPath = "scripts/restore-model-data.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "[ERROR] Script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Running restore script..." -ForegroundColor Cyan
Write-Host ""

# Run the Node.js script
try {
    node $scriptPath
    Write-Host ""
    Write-Host "[OK] Restore completed!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[ERROR] Restore failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
