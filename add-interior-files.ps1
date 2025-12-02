# PowerShell script to automatically add interiorFiles to models.js
# This version uses a simpler line-by-line approach

$modelsFile = "src/data/models.js"
$imagesBasePath = "public/images"

# Read the models.js file as lines
$lines = Get-Content $modelsFile

# Get model folder mappings
$imageConfigContent = Get-Content "src/data/imageConfig.js" -Raw
$modelFolders = @{}

if ($imageConfigContent -match "export const modelImageFolders = \{([^}]+)\}") {
    $foldersBlock = $matches[1]
    $foldersBlock -split "`n" | ForEach-Object {
        if ($_ -match "'([^']+)':\s*'([^']+)'") {
            $modelFolders[$matches[1]] = $matches[2]
        }
    }
}

$newLines = @()
$i = 0
$modelsToUpdate = @{}

# First pass: collect interior files for each model
foreach ($modelName in $modelFolders.Keys) {
    $folderName = $modelFolders[$modelName]
    $modelPath = Join-Path $imagesBasePath $folderName
    $interiorPath = Join-Path $modelPath "Interior"
    
    if (Test-Path $interiorPath) {
        $imageFiles = Get-ChildItem -Path $interiorPath -File | 
            Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$' } |
            Sort-Object Name |
            ForEach-Object { $_.Name }
        
        if ($imageFiles.Count -gt 0) {
            $modelsToUpdate[$modelName] = $imageFiles
            Write-Host "Prepared $($imageFiles.Count) interior images for $modelName" -ForegroundColor Cyan
        }
    }
}

# Second pass: process lines and insert interiorFiles
while ($i -lt $lines.Count) {
    $line = $lines[$i]
    $newLines += $line
    
    # Check if this line contains a model name we need to update
    foreach ($modelName in $modelsToUpdate.Keys) {
        if ($line -match "name:\s*`"$([regex]::Escape($modelName))`"") {
            # Found the model, look ahead for insertion point
            $j = $i + 1
            $foundInsertionPoint = $false
            
            while ($j -lt $lines.Count -and -not $foundInsertionPoint) {
                $nextLine = $lines[$j]
                
                # Check if interiorFiles already exists
                if ($nextLine -match "interiorFiles:") {
                    # Skip existing interiorFiles block
                    while ($j -lt $lines.Count -and $lines[$j] -notmatch "^\s*\],?\s*$") {
                        $j++
                    }
                    $i = $j
                    $foundInsertionPoint = $true
                    Write-Host "  Skipped existing interiorFiles for $modelName" -ForegroundColor Yellow
                    break
                }
                
                # Insert after videoFiles
                if ($nextLine -match "videoFiles:\s*\[") {
                    # Find the end of videoFiles array
                    while ($j -lt $lines.Count -and $lines[$j] -notmatch "^\s*\],?\s*$") {
                        $j++
                    }
                    # Add interiorFiles after videoFiles
                    $newLines += "        interiorFiles: ["
                    foreach ($file in $modelsToUpdate[$modelName]) {
                        $newLines += "          `"$file`","
                    }
                    $newLines += "        ],"
                    $i = $j
                    $foundInsertionPoint = $true
                    Write-Host "  Added interiorFiles for $modelName" -ForegroundColor Green
                    break
                }
                
                # Insert after section2Description
                if ($nextLine -match "section2Description:") {
                    # Find the end of section2Description (next comma or closing)
                    while ($j -lt $lines.Count -and $lines[$j] -notmatch ",\s*$") {
                        $j++
                    }
                    # Add interiorFiles after section2Description
                    $newLines += "        interiorFiles: ["
                    foreach ($file in $modelsToUpdate[$modelName]) {
                        $newLines += "          `"$file`","
                    }
                    $newLines += "        ],"
                    $i = $j
                    $foundInsertionPoint = $true
                    Write-Host "  Added interiorFiles for $modelName" -ForegroundColor Green
                    break
                }
                
                $j++
            }
            
            if (-not $foundInsertionPoint) {
                Write-Host "  Could not find insertion point for $modelName" -ForegroundColor Red
            }
            
            break
        }
    }
    
    $i++
}

# Write the updated content
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Resolve-Path $modelsFile), $newLines, $utf8NoBom)

Write-Host "`nDone! Updated models.js with interiorFiles arrays." -ForegroundColor Green
Write-Host "Please review the changes before committing." -ForegroundColor Yellow

