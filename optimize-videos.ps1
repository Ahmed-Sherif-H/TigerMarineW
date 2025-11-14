# Video Optimization Script for Windows
# Requires FFmpeg to be installed

param(
    [string]$InputPath = "public\images",
    [int]$Quality = 28,  # 18-32, lower = better quality but larger file. 28 is good balance
    [int]$MaxWidth = 1920,  # Max video width in pixels
    [switch]$DryRun = $false  # Preview without actually converting
)

Write-Host "=== Video Optimization Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if FFmpeg is installed
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
    Write-Host "ERROR: FFmpeg not found!" -ForegroundColor Red
    Write-Host "Please install FFmpeg:" -ForegroundColor Yellow
    Write-Host "  choco install ffmpeg" -ForegroundColor Yellow
    Write-Host "  OR download from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

Write-Host "FFmpeg found: $($ffmpeg.Source)" -ForegroundColor Green
Write-Host ""

# Find all video files
$videoFiles = Get-ChildItem -Path $InputPath -Recurse -Include *.mp4,*.mov,*.MP4,*.MOV

if ($videoFiles.Count -eq 0) {
    Write-Host "No video files found in $InputPath" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($videoFiles.Count) video file(s)" -ForegroundColor Cyan
Write-Host ""

# Create backup directory
$backupDir = "original-videos-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not $DryRun) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Backup directory created: $backupDir" -ForegroundColor Green
    Write-Host ""
}

$totalOriginalSize = 0
$totalNewSize = 0

foreach ($file in $videoFiles) {
    $originalSize = $file.Length
    $originalSizeMB = [math]::Round($originalSize / 1MB, 2)
    $totalOriginalSize += $originalSize
    
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    Write-Host "  Original size: $originalSizeMB MB" -ForegroundColor Gray
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would compress to ~$([math]::Round($originalSizeMB * 0.3, 2)) MB" -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    # Backup original
    $backupPath = Join-Path $backupDir $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "_")
    $backupDirPath = Split-Path $backupPath -Parent
    if (-not (Test-Path $backupDirPath)) {
        New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null
    }
    Copy-Item $file.FullName $backupPath -Force
    Write-Host "  Backed up to: $backupPath" -ForegroundColor Gray
    
    # Create temp output file
    $tempOutput = $file.FullName + ".tmp"
    
    # Build FFmpeg command
    $ffmpegArgs = @(
        "-i", "`"$($file.FullName)`"",
        "-vcodec", "libx264",
        "-crf", $Quality.ToString(),
        "-preset", "slow",
        "-vf", "scale=$MaxWidth:-1",
        "-acodec", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-y",
        "`"$tempOutput`""
    )
    
    Write-Host "  Compressing..." -ForegroundColor Gray
    
    # Run FFmpeg
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -PassThru -NoNewWindow
    
    if ($process.ExitCode -eq 0 -and (Test-Path $tempOutput)) {
        $newSize = (Get-Item $tempOutput).Length
        $newSizeMB = [math]::Round($newSize / 1MB, 2)
        $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
        $totalNewSize += $newSize
        
        Write-Host "  New size: $newSizeMB MB (saved $savings%)" -ForegroundColor Green
        
        # Replace original with compressed
        Remove-Item $file.FullName -Force
        Move-Item $tempOutput $file.FullName -Force
        Write-Host "  ✓ Optimized" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Compression failed" -ForegroundColor Red
        if (Test-Path $tempOutput) {
            Remove-Item $tempOutput -Force
        }
    }
    
    Write-Host ""
}

if (-not $DryRun) {
    $totalOriginalMB = [math]::Round($totalOriginalSize / 1MB, 2)
    $totalNewMB = [math]::Round($totalNewSize / 1MB, 2)
    $totalSavings = [math]::Round((1 - ($totalNewSize / $totalOriginalSize)) * 100, 1)
    
    Write-Host "=== Summary ===" -ForegroundColor Cyan
    Write-Host "Original total: $totalOriginalMB MB" -ForegroundColor Gray
    Write-Host "New total: $totalNewMB MB" -ForegroundColor Green
    Write-Host "Total savings: $totalSavings% ($([math]::Round(($totalOriginalSize - $totalNewSize) / 1MB, 2)) MB)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Original videos backed up to: $backupDir" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✓ Optimization complete!" -ForegroundColor Green
} else {
    Write-Host "=== Dry Run Complete ===" -ForegroundColor Cyan
    Write-Host "Run without -DryRun to actually compress videos" -ForegroundColor Yellow
}

