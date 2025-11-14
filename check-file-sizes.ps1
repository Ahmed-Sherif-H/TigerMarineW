# Check file sizes in public/images directory
Write-Host "Checking file sizes in public/images..." -ForegroundColor Cyan
Write-Host ""

# Find all files
$allFiles = Get-ChildItem -Path "public\images" -Recurse -File

# Check for files > 50MB
$largeFiles = $allFiles | Where-Object { $_.Length -gt 50MB }
if ($largeFiles) {
    Write-Host "WARNING: Files larger than 50MB found:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.FullName) - $sizeMB MB" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Check for files > 100MB (GitHub limit)
$tooLargeFiles = $allFiles | Where-Object { $_.Length -gt 100MB }
if ($tooLargeFiles) {
    Write-Host "ERROR: Files larger than 100MB (GitHub limit):" -ForegroundColor Red
    $tooLargeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.FullName) - $sizeMB MB" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "These files will cause push to FAIL!" -ForegroundColor Red
    Write-Host ""
}

# Show video files
Write-Host "Video files found:" -ForegroundColor Cyan
$videoFiles = $allFiles | Where-Object { $_.Extension -match '\.(mp4|mov|MP4|MOV)$' }
if ($videoFiles) {
    $videoFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        $status = if ($_.Length -gt 100MB) { " [TOO LARGE!]" } elseif ($_.Length -gt 50MB) { " [Large]" } else { "" }
        Write-Host "  $($_.Name) - $sizeMB MB$status"
    }
} else {
    Write-Host "  No video files found"
}
Write-Host ""

# Total size
$totalSize = ($allFiles | Measure-Object -Property Length -Sum).Sum
$totalMB = [math]::Round($totalSize / 1MB, 2)
$totalGB = [math]::Round($totalSize / 1GB, 2)

Write-Host "Total size: $totalMB MB ($totalGB GB)" -ForegroundColor Cyan
Write-Host ""

# Recommendations
if ($tooLargeFiles) {
    Write-Host "RECOMMENDATION: Use Git LFS or exclude these files from Git" -ForegroundColor Yellow
} elseif ($totalSize -gt 1GB) {
    Write-Host "RECOMMENDATION: Repository is large. Consider using Git LFS for videos." -ForegroundColor Yellow
} elseif ($largeFiles) {
    Write-Host "RECOMMENDATION: Consider using Git LFS for large files to speed up pushes." -ForegroundColor Yellow
} else {
    Write-Host "Status: All files are within reasonable limits. Push should work fine." -ForegroundColor Green
}

