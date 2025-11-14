# Find large files that are tracked by Git

Write-Host "=== Finding Large Files Tracked by Git ===" -ForegroundColor Cyan
Write-Host ""

# Get all tracked files
$trackedFiles = git ls-files

Write-Host "Total tracked files: $($trackedFiles.Count)" -ForegroundColor Gray
Write-Host ""

# Check file sizes
$largeFiles = @()
foreach ($file in $trackedFiles) {
    if (Test-Path $file) {
        $fileInfo = Get-Item $file -ErrorAction SilentlyContinue
        if ($fileInfo -and $fileInfo.Length -gt 5MB) {
            $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
            $largeFiles += [PSCustomObject]@{
                Path = $file
                SizeMB = $sizeMB
            }
        }
    }
}

if ($largeFiles.Count -eq 0) {
    Write-Host "No large files (>5MB) found in tracked files" -ForegroundColor Green
} else {
    Write-Host "Found $($largeFiles.Count) large file(s) tracked by Git:" -ForegroundColor Yellow
    Write-Host ""
    
    $largeFiles = $largeFiles | Sort-Object SizeMB -Descending
    
    foreach ($file in $largeFiles) {
        Write-Host "  $($file.Path)" -ForegroundColor Yellow
        Write-Host "    Size: $($file.SizeMB) MB" -ForegroundColor Gray
        Write-Host ""
    }
    
    $totalSizeMB = [math]::Round(($largeFiles | Measure-Object -Property SizeMB -Sum).Sum, 2)
    Write-Host "Total size of large files: $totalSizeMB MB" -ForegroundColor Cyan
    Write-Host ""
    
    # Group by extension
    Write-Host "By file type:" -ForegroundColor Cyan
    $byType = $largeFiles | Group-Object { [System.IO.Path]::GetExtension($_.Path) } | Sort-Object Count -Descending
    foreach ($group in $byType) {
        $typeSize = [math]::Round(($group.Group | Measure-Object -Property SizeMB -Sum).Sum, 2)
        Write-Host "  $($group.Name): $($group.Count) files, $typeSize MB total" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Repository Size ===" -ForegroundColor Cyan
git count-objects -vH

