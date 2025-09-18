$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $projectRoot

$configPath = Join-Path $projectRoot 'config.json'
$destDir = Join-Path $projectRoot 'assets/trusted-brands'
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

$json = Get-Content $configPath -Raw | ConvertFrom-Json

foreach ($b in $json.hero.trustedBrands) {
    $url = $b.logoUrl
    if ($null -ne $url -and $url -is [string] -and $url -match '^https?://') {
        $safe = ($b.name -replace '[^A-Za-z0-9]+','-').ToLower().Trim('-')
        $ct = $null
        try {
            $head = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -ErrorAction Stop
            $ct = $head.Headers['Content-Type']
        } catch {
            $ct = $null
        }
        $ext = '.png'
        if ($ct) {
            if ($ct -like 'image/jpeg*') { $ext = '.jpg' }
            elseif ($ct -like 'image/webp*') { $ext = '.webp' }
            elseif ($ct -like 'image/png*') { $ext = '.png' }
        } else {
            if ($url -match '\.jpe?g($|\?)') { $ext = '.jpg' }
            elseif ($url -match '\.webp($|\?)') { $ext = '.webp' }
            elseif ($url -match '\.png($|\?)') { $ext = '.png' }
        }
        $outfile = Join-Path $destDir ($safe + $ext)
        try {
            Invoke-WebRequest -Uri $url -OutFile $outfile -UseBasicParsing -ErrorAction Stop
            $relPath = Resolve-Path -Relative $outfile
            $b.logoUrl = ($relPath -replace '^\.\\','') -replace '\\','/'
            Write-Host ("Saved {0} -> {1}" -f $b.name, $b.logoUrl)
        } catch {
            Write-Warning ("Skipping {0}: {1}" -f $b.name, $_.Exception.Message)
        }
    }
}

($json | ConvertTo-Json -Depth 100) | Set-Content $configPath -Encoding UTF8
Write-Host 'Done.'


