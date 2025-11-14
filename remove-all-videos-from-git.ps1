# Remove ALL video files from Git tracking
# This will remove videos from Git but keep them on disk

Write-Host "=== Remove All Videos from Git ===" -ForegroundColor Cyan
Write-Host ""

# Find all video files tracked by Git
$trackedVideos = git ls-files | Select-String -Pattern "\.(mp4|mov|MP4|MOV)$"

if ($trackedVideos.Count -eq 0) {
    Write-Host "No video files are tracked by Git" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($trackedVideos.Count) video file(s) tracked by Git:" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $trackedVideos) {
    Write-Host "  $file" -ForegroundColor Gray
}

Write-Host ""
$response = Read-Host "Remove these files from Git tracking? (yes/no)"
if ($response -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Removing files from Git tracking..." -ForegroundColor Cyan

$removedCount = 0
foreach ($file in $trackedVideos) {
    git rm --cached $file 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Removed: $file" -ForegroundColor Green
        $removedCount++
    } else {
        Write-Host "  Failed: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Removed $removedCount file(s) from Git tracking" -ForegroundColor Green
Write-Host ""

# Update .gitignore to exclude ALL videos
Write-Host "Updating .gitignore to exclude all videos..." -ForegroundColor Cyan

$gitignorePath = ".gitignore"
$gitignoreContent = @()

if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath
}

# Check if video patterns already exist
$hasVideoPatterns = $gitignoreContent | Where-Object { 
    $_ -match '\.(mp4|mov|MP4|MOV)' -or 
    $_ -match 'public/images.*\.(mp4|mov|MP4|MOV)'
}

if (-not $hasVideoPatterns) {
    # Add video exclusion patterns
    $gitignoreContent += ""
    $gitignoreContent += "# Exclude all video files"
    $gitignoreContent += "public/images/**/*.mp4"
    $gitignoreContent += "public/images/**/*.mov"
    $gitignoreContent += "public/images/**/*.MP4"
    $gitignoreContent += "public/images/**/*.MOV"
    
    $gitignoreContent | Set-Content $gitignorePath -Encoding UTF8
    Write-Host "Added video patterns to .gitignore" -ForegroundColor Green
} else {
    Write-Host "Video patterns already in .gitignore" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Commit the changes:" -ForegroundColor Yellow
Write-Host "   git add .gitignore" -ForegroundColor Gray
Write-Host "   git commit -m 'Remove video files from Git tracking'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check repository size:" -ForegroundColor Yellow
Write-Host "   git count-objects -vH" -ForegroundColor Gray
Write-Host ""
Write-Host "3. If still large, you need to clean history (see SIMPLE_FIX.md)" -ForegroundColor Yellow
Write-Host ""

