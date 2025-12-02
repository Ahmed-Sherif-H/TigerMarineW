# PowerShell script to automatically generate interiorFiles arrays for all models
# This script scans the Interior subfolders and updates models.js

$modelsFile = "src/data/models.js"
$imagesBasePath = "public/images"

# Read the models.js file
$content = Get-Content $modelsFile -Raw

# Get model folder mappings from imageConfig.js
$imageConfigContent = Get-Content "src/data/imageConfig.js" -Raw
$modelFolders = @{}

# Extract model folder mappings (e.g., 'OP650': 'Open650')
if ($imageConfigContent -match "export const modelImageFolders = \{([^}]+)\}") {
    $foldersBlock = $matches[1]
    $foldersBlock -split "`n" | ForEach-Object {
        if ($_ -match "'([^']+)':\s*'([^']+)'") {
            $modelName = $matches[1]
            $folderName = $matches[2]
            $modelFolders[$modelName] = $folderName
        }
    }
}

Write-Host "Found $($modelFolders.Count) models to process" -ForegroundColor Green

# Process each model
foreach ($modelName in $modelFolders.Keys) {
    $folderName = $modelFolders[$modelName]
    $modelPath = Join-Path $imagesBasePath $folderName
    $interiorPath = Join-Path $modelPath "Interior"
    
    if (Test-Path $interiorPath) {
        # Get all image files from Interior folder
        $imageFiles = Get-ChildItem -Path $interiorPath -File | 
            Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$' } |
            Sort-Object Name |
            ForEach-Object { $_.Name }
        
        if ($imageFiles.Count -gt 0) {
            Write-Host "Found $($imageFiles.Count) interior images for $modelName" -ForegroundColor Cyan
            
            # Create the interiorFiles array string
            $interiorFilesList = $imageFiles | ForEach-Object { "          `"$_`"," }
            $interiorFilesArray = "`n        interiorFiles: [`n" + ($interiorFilesList -join "`n") + "`n        ],"
            
            # Remove trailing comma from last item
            $interiorFilesArray = $interiorFilesArray -replace ',(\s*\])', '$1'
            
            # Escape model name for regex
            $escapedModelName = [regex]::Escape($modelName)
            
            # Check if interiorFiles already exists for this model
            $existingPattern = "name:\s*`"$escapedModelName`"[^}]*?interiorFiles:\s*\["
            if ($content -match $existingPattern) {
                # Replace existing interiorFiles - find the full interiorFiles block
                $replacePattern = "(name:\s*`"$escapedModelName`"[^}]*?)interiorFiles:\s*\[[^\]]+\],?"
                $newContent = $content -replace $replacePattern, "`$1$interiorFilesArray"
                if ($newContent -ne $content) {
                    $content = $newContent
                    Write-Host "  Updated interiorFiles for $modelName" -ForegroundColor Yellow
                } else {
                    Write-Host "  Could not update interiorFiles for $modelName" -ForegroundColor Red
                }
            } else {
                # Add interiorFiles - try to insert after videoFiles
                $insertAfterVideoPattern = "(name:\s*`"$escapedModelName`"[^}]*?videoFiles:\s*\[[^\]]+\],?)"
                if ($content -match $insertAfterVideoPattern) {
                    $content = $content -replace $insertAfterVideoPattern, "`$1$interiorFilesArray"
                    Write-Host "  Added interiorFiles for $modelName (after videoFiles)" -ForegroundColor Green
                } else {
                    # Try to insert after section2Description
                    $insertAfterDescPattern = "(name:\s*`"$escapedModelName`"[^}]*?section2Description:\s*`"[^`"]+`",?)"
                    if ($content -match $insertAfterDescPattern) {
                        $content = $content -replace $insertAfterDescPattern, "`$1$interiorFilesArray"
                        Write-Host "  Added interiorFiles for $modelName (after section2Description)" -ForegroundColor Green
                    } else {
                        Write-Host "  Could not find insertion point for $modelName" -ForegroundColor Red
                    }
                }
            }
        } else {
            Write-Host "No interior images found for $modelName" -ForegroundColor Gray
        }
    } else {
        Write-Host "Interior folder not found for $modelName" -ForegroundColor Gray
    }
}

# Write the updated content back to models.js
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Resolve-Path $modelsFile), $content, $utf8NoBom)

Write-Host "`nDone! Updated models.js with interiorFiles arrays." -ForegroundColor Green
Write-Host "Please review the changes before committing." -ForegroundColor Yellow
