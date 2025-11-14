# Script to exclude large files from Git
# Adds large files to .gitignore and removes them from Git tracking

param(
    [string]$Path = "public\images",
    [int]$SizeLimitMB = 50,  # Files larger than this will be excluded
    [switch]$DryRun = $false,
    [switch]$RemoveFromGit = $true  # Remove from Git tracking if already committed
)

Write-Host "=== Exclude Large Files from Git ===" -ForegroundColor Cyan
Write-Host ""

# Find large files
Write-Host "Scanning for files larger than $SizeLimitMB MB..." -ForegroundColor Yellow
$largeFiles = Get-ChildItem -Path $Path -Recurse -File | Where-Object {
    $_.Length -gt ($SizeLimitMB * 1MB)
}

if ($largeFiles.Count -eq 0) {
    Write-Host "No files found larger than $SizeLimitMB MB" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($largeFiles.Count) large file(s):" -ForegroundColor Cyan
Write-Host ""

# Display files
$filePatterns = @()
foreach ($file in $largeFiles) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    
    Write-Host "  $relativePath" -ForegroundColor Yellow
    Write-Host "    Size: $sizeMB MB" -ForegroundColor Gray
    
    # Create pattern for .gitignore
    # Use relative path from repo root
    $pattern = $relativePath
    $filePatterns += $pattern
    
    Write-Host ""
}

if ($DryRun) {
    Write-Host "=== DRY RUN - No changes made ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Would add to .gitignore:" -ForegroundColor Cyan
    foreach ($pattern in $filePatterns) {
        Write-Host "  $pattern" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Run without -DryRun to apply changes" -ForegroundColor Yellow
    exit 0
}

# Read current .gitignore
$gitignorePath = ".gitignore"
$gitignoreContent = @()

if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath
    Write-Host "Reading existing .gitignore..." -ForegroundColor Green
} else {
    Write-Host "Creating new .gitignore..." -ForegroundColor Green
}

# Check if section already exists
$sectionMarker = "# Large media files (excluded from Git)"
$sectionExists = $gitignoreContent -contains $sectionMarker

# Add section if it doesn't exist
if (-not $sectionExists) {
    $gitignoreContent += ""
    $gitignoreContent += $sectionMarker
    $gitignoreContent += "# Added automatically by exclude-large-files.ps1"
    $gitignoreContent += ""
}

# Add file patterns (avoid duplicates)
$addedCount = 0
foreach ($pattern in $filePatterns) {
    if ($gitignoreContent -notcontains $pattern) {
        $gitignoreContent += $pattern
        $addedCount++
        Write-Host "Added to .gitignore: $pattern" -ForegroundColor Green
    } else {
        Write-Host "Already in .gitignore: $pattern" -ForegroundColor Gray
    }
}

# Write .gitignore
$gitignoreContent | Set-Content $gitignorePath -Encoding UTF8
Write-Host ""
Write-Host "Updated .gitignore ($addedCount new entries)" -ForegroundColor Green
Write-Host ""

# Remove from Git tracking if requested
if ($RemoveFromGit) {
    Write-Host "Removing files from Git tracking..." -ForegroundColor Yellow
    
    $removedCount = 0
    foreach ($file in $largeFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
        
        # Check if file is tracked by Git
        git ls-files --error-unmatch $relativePath 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            # File is tracked, remove it
            git rm --cached $relativePath 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  Removed from Git: $relativePath" -ForegroundColor Green
                $removedCount++
            } else {
                Write-Host "  Failed to remove: $relativePath" -ForegroundColor Red
            }
        } else {
            Write-Host "  Not tracked: $relativePath" -ForegroundColor Gray
        }
    }
    
    if ($removedCount -gt 0) {
        Write-Host ""
        Write-Host "Removed $removedCount file(s) from Git tracking" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Review the changes: git status" -ForegroundColor Gray
        Write-Host "  2. Commit the .gitignore update:" -ForegroundColor Gray
        Write-Host "     git add .gitignore" -ForegroundColor Yellow
        Write-Host "     git commit -m 'Exclude large files from Git'" -ForegroundColor Yellow
        Write-Host "  3. Push to GitHub" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Note: Files are still on your disk, just not tracked by Git" -ForegroundColor Yellow
    } else {
        Write-Host "No files were tracked by Git" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Files excluded: $($largeFiles.Count)" -ForegroundColor Green
$totalSizeMB = [math]::Round(($largeFiles | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
Write-Host "Total size excluded: $totalSizeMB MB" -ForegroundColor Green
Write-Host ""
Write-Host "Done! You can now push to GitHub" -ForegroundColor Green

