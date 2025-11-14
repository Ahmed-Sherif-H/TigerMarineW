# List all video files with their folder paths

$videos = Get-ChildItem -Path public\images -Recurse -File -Include *.mp4,*.mov,*.MP4,*.MOV

Write-Host "=== Video Files Found ===" -ForegroundColor Cyan
Write-Host ""

foreach ($video in $videos) {
    $folder = $video.Directory.Name
    $name = $video.Name
    $relativePath = $video.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    Write-Host "$folder\$name" -ForegroundColor Yellow
    Write-Host "  Full path: $relativePath" -ForegroundColor Gray
    Write-Host ""
}

