# Local Testing Script (PowerShell)
# Tests both frontend and backend locally

Write-Host "🧪 Testing Tiger Marine Locally" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if backend is running
Write-Host ""
Write-Host "1. Checking backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -ErrorAction Stop
    if ($backendResponse.Content -match '"status":"ok"') {
        Write-Host "✅ Backend is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend returned unexpected response" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Backend is not running" -ForegroundColor Red
    Write-Host "   Start backend: cd backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Check if frontend is running
Write-Host ""
Write-Host "2. Checking frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend returned status: $($frontendResponse.StatusCode)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Frontend is not running" -ForegroundColor Red
    Write-Host "   Start frontend: cd frontend && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test API endpoints
Write-Host ""
Write-Host "3. Testing API endpoints..." -ForegroundColor Yellow

# Test models endpoint
try {
    $modelsResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/models" -UseBasicParsing -ErrorAction Stop
    if ($modelsResponse.Content -match '"success":true') {
        Write-Host "✅ Models endpoint working" -ForegroundColor Green
    } else {
        Write-Host "❌ Models endpoint failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Models endpoint failed: $_" -ForegroundColor Red
}

# Test categories endpoint
try {
    $categoriesResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/categories" -UseBasicParsing -ErrorAction Stop
    if ($categoriesResponse.Content -match '"success":true') {
        Write-Host "✅ Categories endpoint working" -ForegroundColor Green
    } else {
        Write-Host "❌ Categories endpoint failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Categories endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Local testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend:  http://localhost:3001"
Write-Host "  Admin:    http://localhost:5173/admin"

