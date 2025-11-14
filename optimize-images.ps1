# Image Optimization Script for Windows
# Uses ImageMagick or provides instructions for other tools

param(
    [string]$InputPath = "public\images",
    [int]$Quality = 85,  # JPEG quality (1-100)
    [int]$MaxWidth = 1920,  # Max image width
    [switch]$DryRun = $false
)

Write-Host "=== Image Optimization Script ===" -ForegroundColor Cyan
Write-Host ""

# Check for ImageMagick
$magick = Get-Command magick -ErrorAction SilentlyContinue
$hasImageMagick = $null -ne $magick

if (-not $hasImageMagick) {
    Write-Host "ImageMagick not found. Options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install ImageMagick" -ForegroundColor Cyan
    Write-Host "  choco install imagemagick" -ForegroundColor Gray
    Write-Host "  OR download from: https://imagemagick.org/script/download.php" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use online tools" -ForegroundColor Cyan
    Write-Host "  - TinyPNG: https://tinypng.com/" -ForegroundColor Gray
    Write-Host "  - Squoosh: https://squoosh.app/" -ForegroundColor Gray
    Write-Host "  - ImageOptim: https://imageoptim.com/ (Mac)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3: Use Node.js Sharp (if you have Node.js)" -ForegroundColor Cyan
    Write-Host "  npm install -g sharp-cli" -ForegroundColor Gray
    Write-Host "  sharp-cli -i public/images -o public/images-optimized" -ForegroundColor Gray
    Write-Host ""
    
    if (-not $DryRun) {
        Write-Host "Skipping image optimization. Please use one of the options above." -ForegroundColor Yellow
        exit 0
    }
}

# Find all image files
$imageFiles = Get-ChildItem -Path $InputPath -Recurse -Include *.jpg,*.jpeg,*.JPG,*.JPEG,*.png,*.PNG | Where-Object {
    $_.Length -gt 500KB  # Only optimize files larger than 500KB
}

if ($imageFiles.Count -eq 0) {
    Write-Host "No large image files found (all under 500KB)" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($imageFiles.Count) large image file(s) (>500KB)" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    $totalSize = ($imageFiles | Measure-Object -Property Length -Sum).Sum
    $totalMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "Total size to optimize: $totalMB MB" -ForegroundColor Yellow
    Write-Host "Estimated savings: ~$([math]::Round($totalMB * 0.4, 2)) MB (40%)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run without -DryRun to optimize" -ForegroundColor Yellow
    exit 0
}

# Create backup
$backupDir = "original-images-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Backup directory: $backupDir" -ForegroundColor Green
Write-Host ""

$totalOriginalSize = 0
$totalNewSize = 0

foreach ($file in $imageFiles) {
    $originalSize = $file.Length
    $originalSizeKB = [math]::Round($originalSize / 1KB, 2)
    $totalOriginalSize += $originalSize
    
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    Write-Host "  Original: $originalSizeKB KB" -ForegroundColor Gray
    
    if ($hasImageMagick) {
        # Backup
        $backupPath = Join-Path $backupDir $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "_")
        $backupDirPath = Split-Path $backupPath -Parent
        if (-not (Test-Path $backupDirPath)) {
            New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null
        }
        Copy-Item $file.FullName $backupPath -Force
        
        # Optimize with ImageMagick
        $tempOutput = $file.FullName + ".tmp"
        $magickArgs = @(
            "`"$($file.FullName)`"",
            "-resize", "${MaxWidth}x>",
            "-quality", $Quality.ToString(),
            "-strip",
            "`"$tempOutput`""
        )
        
        $process = Start-Process -FilePath "magick" -ArgumentList $magickArgs -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0 -and (Test-Path $tempOutput)) {
            $newSize = (Get-Item $tempOutput).Length
            $newSizeKB = [math]::Round($newSize / 1KB, 2)
            $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
            $totalNewSize += $newSize
            
            Write-Host "  New: $newSizeKB KB (saved $savings%)" -ForegroundColor Green
            
            Remove-Item $file.FullName -Force
            Move-Item $tempOutput $file.FullName -Force
        } else {
            Write-Host "  ✗ Optimization failed" -ForegroundColor Red
            if (Test-Path $tempOutput) {
                Remove-Item $tempOutput -Force
            }
        }
    }
    
    Write-Host ""
}

if ($hasImageMagick) {
    $totalOriginalMB = [math]::Round($totalOriginalSize / 1MB, 2)
    $totalNewMB = [math]::Round($totalNewSize / 1MB, 2)
    $totalSavings = [math]::Round((1 - ($totalNewSize / $totalOriginalSize)) * 100, 1)
    
    Write-Host "=== Summary ===" -ForegroundColor Cyan
    Write-Host "Original: $totalOriginalMB MB" -ForegroundColor Gray
    Write-Host "New: $totalNewMB MB" -ForegroundColor Green
    Write-Host "Savings: $totalSavings% ($([math]::Round(($totalOriginalSize - $totalNewSize) / 1MB, 2)) MB)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backups in: $backupDir" -ForegroundColor Yellow
}

