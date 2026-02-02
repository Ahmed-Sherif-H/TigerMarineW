# Export Model Data Script for Windows PowerShell

$BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
$ADMIN_EMAIL = "your-admin@email.com"  # <-- CHANGE THIS
$ADMIN_PASSWORD = "your-password"       # <-- CHANGE THIS

Write-Host "📦 Exporting Model Data..." -ForegroundColor Cyan
Write-Host ""

$env:BACKEND_URL = $BACKEND_URL
$env:ADMIN_EMAIL = $ADMIN_EMAIL
$env:ADMIN_PASSWORD = $ADMIN_PASSWORD

try {
    node scripts/export-model-data.js
} catch {
    Write-Host "❌ Export failed!" -ForegroundColor Red
    exit 1
}
