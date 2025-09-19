# Download thumbnails from NY Studios website
$baseUrl = "https://thevinzo1.github.io/nystudios/"
$outputDir = "assets/thumbnails"

# Create directory if it doesn't exist
if (-not (Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Download each client logo
foreach ($i in 1..5) {
    $fileName = "client$i-logo.png"
    $url = $baseUrl + "assets/" + $fileName
    $outputPath = Join-Path -Path $outputDir -ChildPath $fileName
    
    Invoke-WebRequest -Uri $url -OutFile $outputPath
    Write-Host "Downloaded $fileName"
}

# Update config.json with new thumbnails
$configPath = "config.json"
$config = Get-Content $configPath | ConvertFrom-Json

# Create new thumbnails array
$newThumbnails = @()
foreach ($i in 1..5) {
    $newThumbnails += @{
        category = "thumbnails"
        imageUrl = "assets/thumbnails/client$i-logo.png"
        title = "Client Thumbnail $i"
        description = "Professional thumbnail design"
    }
}

# Update the graphics section
$config.graphics = $newThumbnails

# Save updated config
$config | ConvertTo-Json -Depth 10 | Set-Content $configPath
Write-Host "Updated config.json with new thumbnails"

Write-Host "All thumbnails downloaded to $outputDir and config updated"