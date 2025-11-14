# Add videos back to Git for Netlify deployment

Write-Host "=== Add Videos Back to Git ===" -ForegroundColor Cyan
Write-Host ""

# Check video files
$videos = Get-ChildItem -Path public\images -Recurse -File -Include *.mp4,*.mov,*.MP4,*.MOV

if ($videos.Count -eq 0) {
    Write-Host "No video files found in public/images" -ForegroundColor Yellow
    exit 0
}

$totalSize = ($videos | Measure-Object -Property Length -Sum).Sum
$totalMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "Found $($videos.Count) video file(s)" -ForegroundColor Green
Write-Host "Total size: $totalMB MB" -ForegroundColor Green
Write-Host ""

if ($totalMB -gt 100) {
    Write-Host "WARNING: Total size is $totalMB MB" -ForegroundColor Yellow
    Write-Host "GitHub has a 100MB file size limit per file" -ForegroundColor Yellow
    Write-Host "Make sure no single file exceeds 100MB" -ForegroundColor Yellow
    Write-Host ""
}

# Show largest files
Write-Host "Largest video files:" -ForegroundColor Cyan
$videos | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $status = if ($_.Length -gt 100MB) { " [TOO LARGE!]" } elseif ($_.Length -gt 50MB) { " [Large]" } else { "" }
    Write-Host "  $($_.Name) - $sizeMB MB$status" -ForegroundColor $(if ($_.Length -gt 100MB) { "Red" } else { "Gray" })
}
Write-Host ""

# Check if any file is too large
$tooLarge = $videos | Where-Object { $_.Length -gt 100MB }
if ($tooLarge.Count -gt 0) {
    Write-Host "ERROR: These files exceed GitHub's 100MB limit:" -ForegroundColor Red
    foreach ($file in $tooLarge) {
        $sizeMB = [math]::Round($file.Length / 1MB, 2)
        Write-Host "  $($file.FullName) - $sizeMB MB" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "You need to compress these files first!" -ForegroundColor Yellow
    Write-Host "Use: .\optimize-videos.ps1" -ForegroundColor Yellow
    exit 1
}

# Remove video patterns from .gitignore
Write-Host "Updating .gitignore..." -ForegroundColor Yellow

$gitignorePath = ".gitignore"
$gitignoreContent = Get-Content $gitignorePath

# Remove video exclusion patterns
$newContent = $gitignoreContent | Where-Object {
    $_ -notmatch '^public/images/.*\.(mp4|mov|MP4|MOV)$' -and
    $_ -notmatch '^# Exclude all video files' -and
    $_ -notmatch '^public/images/\*\*/\*\.(mp4|mov|MP4|MOV)$' -and
    $_ -notmatch '^\*\.(mp4|mov|MP4|MOV)$'
}

# Keep the section marker but update it
$hasSection = $newContent | Where-Object { $_ -match "Large media files" }
if (-not $hasSection) {
    $newContent += ""
    $newContent += "# Large media files"
    $newContent += "# Videos are now included for Netlify deployment"
}

$newContent | Set-Content $gitignorePath -Encoding UTF8
Write-Host "Removed video exclusions from .gitignore" -ForegroundColor Green
Write-Host ""

# Add videos to Git
Write-Host "Adding videos to Git..." -ForegroundColor Yellow

$addedCount = 0
foreach ($video in $videos) {
    $relativePath = $video.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    git add $relativePath 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Added: $relativePath" -ForegroundColor Green
        $addedCount++
    } else {
        Write-Host "  Failed: $relativePath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Added $addedCount video file(s) to Git" -ForegroundColor Green
Write-Host ""

# Check repository size
Write-Host "Current repository size:" -ForegroundColor Cyan
git count-objects -vH
Write-Host ""

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Commit the changes:" -ForegroundColor Yellow
Write-Host "   git commit -m 'Add videos for Netlify deployment'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Netlify will automatically deploy with videos" -ForegroundColor Green
Write-Host ""

if ($totalMB -gt 500) {
    Write-Host "NOTE: Repository is now $totalMB MB" -ForegroundColor Yellow
    Write-Host "Consider using Netlify's Large Media or external CDN for production" -ForegroundColor Yellow
}

