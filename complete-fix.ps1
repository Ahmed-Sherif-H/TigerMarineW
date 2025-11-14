# Complete fix: Remove videos from Git AND clean history
# This will solve the 1.34GB issue

Write-Host "=== Complete Fix for 1.34GB Repository ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove all videos from Git tracking
Write-Host "Step 1: Removing videos from Git tracking..." -ForegroundColor Yellow

$trackedVideos = git ls-files | Select-String -Pattern "\.(mp4|mov|MP4|MOV)$"

if ($trackedVideos.Count -gt 0) {
    Write-Host "Found $($trackedVideos.Count) video files to remove" -ForegroundColor Gray
    
    foreach ($file in $trackedVideos) {
        git rm --cached $file 2>&1 | Out-Null
        Write-Host "  Removed: $file" -ForegroundColor Green
    }
} else {
    Write-Host "No videos tracked" -ForegroundColor Gray
}

# Step 2: Update .gitignore
Write-Host ""
Write-Host "Step 2: Updating .gitignore..." -ForegroundColor Yellow

$gitignorePath = ".gitignore"
$gitignoreContent = @()

if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath
}

# Remove old video entries and add comprehensive patterns
$gitignoreContent = $gitignoreContent | Where-Object { 
    $_ -notmatch '^public/images/.*\.(mp4|mov|MP4|MOV)$'
}

# Add comprehensive video exclusion
if ($gitignoreContent -notcontains "# Exclude all video files") {
    $gitignoreContent += ""
    $gitignoreContent += "# Exclude all video files"
    $gitignoreContent += "public/images/**/*.mp4"
    $gitignoreContent += "public/images/**/*.mov"
    $gitignoreContent += "public/images/**/*.MP4"
    $gitignoreContent += "public/images/**/*.MOV"
    $gitignoreContent += "*.mp4"
    $gitignoreContent += "*.mov"
    $gitignoreContent += "*.MP4"
    $gitignoreContent += "*.MOV"
}

$gitignoreContent | Set-Content $gitignorePath -Encoding UTF8
Write-Host "Updated .gitignore" -ForegroundColor Green

# Step 3: Check current size
Write-Host ""
Write-Host "Step 3: Current repository size:" -ForegroundColor Yellow
git count-objects -vH
Write-Host ""

# Step 4: Explain history cleaning
Write-Host "=== IMPORTANT ===" -ForegroundColor Red
Write-Host "Videos are still in Git HISTORY (that's why it's 1.34GB)" -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to clean history. Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option A: Start Fresh (Easiest - removes all history)" -ForegroundColor Green
Write-Host "  git checkout --orphan clean-main" -ForegroundColor Gray
Write-Host "  git add ." -ForegroundColor Gray
Write-Host "  git commit -m 'Initial commit - optimized files'" -ForegroundColor Gray
Write-Host "  git branch -D main" -ForegroundColor Gray
Write-Host "  git branch -m main" -ForegroundColor Gray
Write-Host "  git push -f origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "Option B: Use BFG to clean history (Keeps history, removes large files)" -ForegroundColor Green
Write-Host "  1. Download: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Gray
Write-Host "  2. java -jar bfg.jar --strip-blobs-bigger-than 10M" -ForegroundColor Gray
Write-Host "  3. git reflog expire --expire=now --all" -ForegroundColor Gray
Write-Host "  4. git gc --prune=now --aggressive" -ForegroundColor Gray
Write-Host "  5. git push --force" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Commit current changes:" -ForegroundColor Yellow
Write-Host "   git add .gitignore" -ForegroundColor Gray
Write-Host "   git commit -m 'Remove videos from Git'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Choose Option A or B above to clean history" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. After cleaning, check size again:" -ForegroundColor Yellow
Write-Host "   git count-objects -vH" -ForegroundColor Gray
Write-Host "   (Should be < 200 MB)" -ForegroundColor Gray
Write-Host ""

