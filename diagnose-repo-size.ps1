# Diagnose why repository is 1.34GB

Write-Host "=== Repository Size Diagnosis ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Git count-objects
Write-Host "1. Git repository size:" -ForegroundColor Yellow
git count-objects -vH
Write-Host ""

# 2. Check number of commits
Write-Host "2. Number of commits:" -ForegroundColor Yellow
$commitCount = (git log --oneline --all).Count
Write-Host "   Commits: $commitCount" -ForegroundColor Gray
Write-Host ""

# 3. Check tracked files size
Write-Host "3. Size of tracked files on disk:" -ForegroundColor Yellow
$totalSize = 0
$fileCount = 0
git ls-files | ForEach-Object {
    if (Test-Path $_) {
        $fileInfo = Get-Item $_ -ErrorAction SilentlyContinue
        if ($fileInfo) {
            $totalSize += $fileInfo.Length
            $fileCount++
        }
    }
}
$totalMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "   Files: $fileCount" -ForegroundColor Gray
Write-Host "   Total size: $totalMB MB" -ForegroundColor Gray
Write-Host ""

# 4. Check Git objects size
Write-Host "4. Size of Git objects (history):" -ForegroundColor Yellow
$objects = git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)'
$blobSize = 0
$blobCount = 0
foreach ($obj in $objects) {
    if ($obj -match '^blob') {
        $parts = $obj -split '\s+'
        if ($parts.Length -ge 3) {
            $size = [long]$parts[2]
            $blobSize += $size
            $blobCount++
        }
    }
}
$blobMB = [math]::Round($blobSize / 1MB, 2)
Write-Host "   Blob objects: $blobCount" -ForegroundColor Gray
Write-Host "   Total blob size: $blobMB MB" -ForegroundColor Gray
Write-Host ""

# 5. Check for large blobs
Write-Host "5. Large objects in Git history (>10MB):" -ForegroundColor Yellow
$largeBlobs = git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | 
    Where-Object { $_ -match '^blob' } | ForEach-Object {
        $parts = $_ -split '\s+', 4
        $size = [long]$parts[2]
        if ($size -gt 10MB) {
            [PSCustomObject]@{
                Hash = $parts[1]
                SizeMB = [math]::Round($size / 1MB, 2)
                Path = if ($parts.Length -ge 4) { $parts[3] } else { "unknown" }
            }
        }
    } | Sort-Object SizeMB -Descending

if ($largeBlobs.Count -eq 0) {
    Write-Host "   No large objects found" -ForegroundColor Green
} else {
    Write-Host "   Found $($largeBlobs.Count) large object(s):" -ForegroundColor Red
    foreach ($blob in $largeBlobs | Select-Object -First 10) {
        Write-Host "     $($blob.Path) - $($blob.SizeMB) MB" -ForegroundColor Yellow
    }
    $largeTotal = [math]::Round(($largeBlobs | Measure-Object -Property @{E={$_.SizeMB * 1MB}} -Sum).Sum / 1MB, 2)
    Write-Host "   Total large objects: $largeTotal MB" -ForegroundColor Red
}
Write-Host ""

# 6. Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Tracked files on disk: $totalMB MB" -ForegroundColor Gray
Write-Host "Git objects (history): $blobMB MB" -ForegroundColor Gray
Write-Host "Git count-objects: 1.34 GiB" -ForegroundColor Gray
Write-Host ""

if ($blobMB -gt 500) {
    Write-Host "⚠️  PROBLEM: Large files still in Git history!" -ForegroundColor Red
    Write-Host "   You need to clean Git history (see FINAL_FIX.md)" -ForegroundColor Yellow
} elseif ($totalMB -gt 500) {
    Write-Host "⚠️  PROBLEM: Large files are being tracked!" -ForegroundColor Red
    Write-Host "   Check .gitignore and remove large files from Git" -ForegroundColor Yellow
} else {
    Write-Host "Files look reasonable" -ForegroundColor Green
    Write-Host "The 1.34GB might be from Git's internal storage" -ForegroundColor Gray
    Write-Host "Try: git gc --aggressive" -ForegroundColor Yellow
}

