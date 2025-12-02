# PowerShell script to list all interior images for each model
# This outputs the interiorFiles arrays that you can copy into models.js

$imagesBasePath = "public/images"

# Get model folder mappings from imageConfig.js
$imageConfigContent = Get-Content "src/data/imageConfig.js" -Raw
$modelFolders = @{}

# Extract model folder mappings
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

Write-Host "`n=== INTERIOR FILES ARRAYS FOR models.js ===`n" -ForegroundColor Green

# Process each model
foreach ($modelName in $modelFolders.Keys | Sort-Object) {
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
            Write-Host "// For model: $modelName" -ForegroundColor Cyan
            Write-Host "interiorFiles: ["
            foreach ($file in $imageFiles) {
                Write-Host "  `"$file`","
            }
            Write-Host "],`n"
        }
    }
}

Write-Host "`nCopy the arrays above and add them to each model in models.js" -ForegroundColor Yellow
Write-Host "Add them after videoFiles or section2Description`n" -ForegroundColor Yellow

