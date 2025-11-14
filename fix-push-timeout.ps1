# Quick fix for push timeout - Remove large files from Git history
# This script helps you clean Git history to reduce push size

param(
    [switch]$DryRun = $false
)

Write-Host "=== Fix Push Timeout - Clean Git History ===" -ForegroundColor Cyan
Write-Host ""

# Check current repository size
Write-Host "Current repository size:" -ForegroundColor Yellow
git count-objects -vH
Write-Host ""

# Check if BFG is available
$bfgPath = Get-Command java -ErrorAction SilentlyContinue
$hasJava = $null -ne $bfgPath

# Check if git-filter-repo is available
$filterRepo = Get-Command git-filter-repo -ErrorAction SilentlyContinue
$hasFilterRepo = $null -ne $filterRepo

Write-Host "=== Solution Options ===" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Option 1: BFG Repo-Cleaner
Write-Host "Option 1: BFG Repo-Cleaner (Recommended - Easiest)" -ForegroundColor Green
if ($hasJava) {
    Write-Host "  ✓ Java is installed" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Steps:" -ForegroundColor Cyan
    Write-Host "  1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Gray
    Write-Host "  2. Place bfg.jar in this directory" -ForegroundColor Gray
    Write-Host "  3. Run these commands:" -ForegroundColor Gray
    Write-Host ""
    Write-Host "     java -jar bfg.jar --strip-blobs-bigger-than 50M" -ForegroundColor Yellow
    Write-Host "     git reflog expire --expire=now --all" -ForegroundColor Yellow
    Write-Host "     git gc --prune=now --aggressive" -ForegroundColor Yellow
    Write-Host "     git push --force" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ Java not found (needed for BFG)" -ForegroundColor Red
    Write-Host "    Install Java: https://www.java.com/download/" -ForegroundColor Gray
}
Write-Host ""

# Option 2: git-filter-repo
Write-Host "Option 2: git-filter-repo - Fast, requires Python" -ForegroundColor Green
if ($hasFilterRepo) {
    Write-Host "  ✓ git-filter-repo is installed" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Run these commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    git filter-repo --path-glob 'public/images/**/*.mp4' --invert-paths" -ForegroundColor Yellow
    Write-Host "    git filter-repo --path-glob 'public/images/**/*.mov' --invert-paths" -ForegroundColor Yellow
    Write-Host "    git filter-repo --path-glob 'public/images/**/*.MP4' --invert-paths" -ForegroundColor Yellow
    Write-Host "    git filter-repo --path-glob 'public/images/**/*.MOV' --invert-paths" -ForegroundColor Yellow
    Write-Host "    git reflog expire --expire=now --all" -ForegroundColor Yellow
    Write-Host "    git gc --prune=now --aggressive" -ForegroundColor Yellow
    Write-Host "    git push --force" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ git-filter-repo not installed" -ForegroundColor Red
    Write-Host "    Install: pip install git-filter-repo" -ForegroundColor Gray
}
Write-Host ""

# Option 3: Start fresh (nuclear option)
Write-Host "Option 3: Start Fresh (No history, fastest)" -ForegroundColor Green
Write-Host "  ⚠️  This removes ALL Git history!" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Run these commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "    git checkout --orphan temp-main" -ForegroundColor Yellow
Write-Host "    git add ." -ForegroundColor Yellow
Write-Host "    git commit -m 'Initial commit - optimized media files'" -ForegroundColor Yellow
Write-Host "    git branch -D main" -ForegroundColor Yellow
Write-Host "    git branch -m main" -ForegroundColor Yellow
Write-Host "    git push -f origin main" -ForegroundColor Yellow
Write-Host ""

# Option 4: Manual git filter-branch
Write-Host "Option 4: Manual git filter-branch (Built-in, slower)" -ForegroundColor Green
Write-Host "  Run these commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "    git filter-branch --force --index-filter `"git rm --cached --ignore-unmatch public/images/**/*.mp4 public/images/**/*.mov public/images/**/*.MP4 public/images/**/*.MOV`" --prune-empty --tag-name-filter cat -- --all" -ForegroundColor Yellow
Write-Host "    git reflog expire --expire=now --all" -ForegroundColor Yellow
Write-Host "    git gc --prune=now --aggressive" -ForegroundColor Yellow
Write-Host "    git push --force" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== Recommendation ===" -ForegroundColor Cyan
if ($hasJava) {
    Write-Host "Use Option 1 (BFG) - It's the easiest and fastest" -ForegroundColor Green
} elseif ($hasFilterRepo) {
    Write-Host "Use Option 2 (git-filter-repo) - You already have it installed" -ForegroundColor Green
} else {
    Write-Host "Use Option 3 (Start Fresh) - Quickest if you don't need history" -ForegroundColor Green
    Write-Host "OR install Java and use Option 1 (BFG)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== After Cleaning ===" -ForegroundColor Cyan
Write-Host "1. Check new size: git count-objects -vH" -ForegroundColor Gray
Write-Host "2. Should be < 200 MB (currently 1.28 GiB)" -ForegroundColor Gray
Write-Host "3. Push should work without timeout" -ForegroundColor Gray
Write-Host ""

if (-not $DryRun) {
    Write-Host "⚠️  WARNING: All options will rewrite Git history!" -ForegroundColor Red
    Write-Host "   Make sure you have a backup or are working on a branch" -ForegroundColor Yellow
    Write-Host "   Others will need to re-clone after you force push" -ForegroundColor Yellow
}

