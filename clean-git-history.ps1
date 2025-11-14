# Script to remove large files from Git history
# This will rewrite Git history to remove large files

param(
    [int]$SizeLimitMB = 50,
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

Write-Host "=== Clean Large Files from Git History ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will rewrite Git history!" -ForegroundColor Red
Write-Host "Make sure you have a backup or are working on a branch!" -ForegroundColor Yellow
Write-Host ""

if (-not $Force -and -not $DryRun) {
    $response = Read-Host "Are you sure you want to continue? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Find large files in Git history
Write-Host "Scanning Git history for large files (>$SizeLimitMB MB)..." -ForegroundColor Yellow
Write-Host ""

# Get all blobs larger than limit
$largeBlobs = git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | 
    Where-Object { $_ -match '^blob' } | ForEach-Object {
        $parts = $_ -split '\s+', 4
        $size = [long]$parts[2]
        if ($size -gt ($SizeLimitMB * 1MB)) {
            [PSCustomObject]@{
                Hash = $parts[1]
                SizeMB = [math]::Round($size / 1MB, 2)
                Path = if ($parts.Length -gt 3) { $parts[3] } else { "unknown" }
            }
        }
    } | Sort-Object SizeMB -Descending

if ($largeBlobs.Count -eq 0) {
    Write-Host "No large files found in Git history!" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($largeBlobs.Count) large file(s) in Git history:" -ForegroundColor Cyan
Write-Host ""
foreach ($blob in $largeBlobs) {
    Write-Host "  $($blob.Path)" -ForegroundColor Yellow
    Write-Host "    Size: $($blob.SizeMB) MB" -ForegroundColor Gray
    Write-Host "    Hash: $($blob.Hash)" -ForegroundColor Gray
    Write-Host ""
}

$totalSizeMB = [math]::Round(($largeBlobs | Measure-Object -Property @{E={$_.SizeMB * 1MB}} -Sum).Sum / 1MB, 2)
Write-Host "Total size in history: $totalSizeMB MB" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "=== DRY RUN - No changes made ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To actually remove these files, run:" -ForegroundColor Cyan
    Write-Host "  .\clean-git-history.ps1 -Force" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use git filter-repo (recommended):" -ForegroundColor Cyan
    Write-Host "  pip install git-filter-repo" -ForegroundColor Gray
    Write-Host "  git filter-repo --path-glob '*.mp4' --invert-paths" -ForegroundColor Gray
    Write-Host "  git filter-repo --path-glob '*.mov' --invert-paths" -ForegroundColor Gray
    exit 0
}

Write-Host "Options to remove large files from history:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Use git filter-repo (Recommended - faster, safer)" -ForegroundColor Yellow
Write-Host "  1. Install: pip install git-filter-repo" -ForegroundColor Gray
Write-Host "  2. Remove videos: git filter-repo --path-glob '*.mp4' --invert-paths" -ForegroundColor Gray
Write-Host "  3. Remove MOV: git filter-repo --path-glob '*.mov' --invert-paths" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Use BFG Repo-Cleaner (Easier, but requires Java)" -ForegroundColor Yellow
Write-Host "  1. Download: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Gray
Write-Host "  2. Run: bfg --strip-blobs-bigger-than 50M" -ForegroundColor Gray
Write-Host "  3. Clean: git reflog expire --expire=now --all && git gc --prune=now --aggressive" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Manual git filter-branch (Slower, but built-in)" -ForegroundColor Yellow
Write-Host "  See: https://git-scm.com/docs/git-filter-branch" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Which option? (1/2/3/skip)"
if ($choice -eq "skip") {
    Write-Host "Skipped. Large files still in history." -ForegroundColor Yellow
    exit 0
}

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Using git filter-repo..." -ForegroundColor Cyan
    Write-Host "Make sure you have: pip install git-filter-repo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run these commands:" -ForegroundColor Cyan
    Write-Host "  git filter-repo --path-glob 'public/images/**/*.mp4' --invert-paths" -ForegroundColor Yellow
    Write-Host "  git filter-repo --path-glob 'public/images/**/*.mov' --invert-paths" -ForegroundColor Yellow
    Write-Host "  git filter-repo --path-glob 'public/images/**/*.MP4' --invert-paths" -ForegroundColor Yellow
    Write-Host "  git filter-repo --path-glob 'public/images/**/*.MOV' --invert-paths" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then force push: git push --force" -ForegroundColor Yellow
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Using BFG Repo-Cleaner..." -ForegroundColor Cyan
    Write-Host "Download from: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run these commands:" -ForegroundColor Cyan
    Write-Host "  java -jar bfg.jar --strip-blobs-bigger-than 50M" -ForegroundColor Yellow
    Write-Host "  git reflog expire --expire=now --all" -ForegroundColor Yellow
    Write-Host "  git gc --prune=now --aggressive" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then force push: git push --force" -ForegroundColor Yellow
} elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "Using git filter-branch (this may take a while)..." -ForegroundColor Cyan
    
    # Get unique paths
    $uniquePaths = $largeBlobs | Select-Object -ExpandProperty Path -Unique | Where-Object { $_ -match '\.(mp4|mov|MP4|MOV)$' }
    
    if ($uniquePaths.Count -gt 0) {
        Write-Host "Removing these file patterns from history..." -ForegroundColor Yellow
        foreach ($path in $uniquePaths) {
            Write-Host "  $path" -ForegroundColor Gray
        }
        Write-Host ""
        Write-Host "This will take a while. Run:" -ForegroundColor Yellow
        Write-Host "  git filter-branch --force --index-filter `"git rm --cached --ignore-unmatch $($uniquePaths -join ' ')`" --prune-empty --tag-name-filter cat -- --all" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Then clean up:" -ForegroundColor Yellow
        Write-Host "  git reflog expire --expire=now --all" -ForegroundColor Gray
        Write-Host "  git gc --prune=now --aggressive" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Important Notes ===" -ForegroundColor Cyan
Write-Host "1. This rewrites history - you'll need to force push" -ForegroundColor Yellow
Write-Host "2. Others will need to re-clone or reset their repos" -ForegroundColor Yellow
Write-Host "3. Make sure you have a backup!" -ForegroundColor Yellow
Write-Host "4. After cleaning, add files to .gitignore to prevent re-adding" -ForegroundColor Yellow

