<#
.SYNOPSIS
    Package BlinkQR extension files into a release .zip archive.
.DESCRIPTION
    Reads the version from manifest.json, copies only the files required
    for the browser extension into a temporary staging directory, and creates
    dist/BlinkQR-v<version>.zip ready for GitHub Releases or Chrome Web Store.
#>

$ErrorActionPreference = "Stop"

$RootDir = $PSScriptRoot
$ManifestPath = Join-Path $RootDir "manifest.json"

if (-not (Test-Path $ManifestPath)) {
    Write-Error "manifest.json not found in $RootDir"
    exit 1
}

$Manifest = Get-Content $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$Version = $Manifest.version
$AppName = $Manifest.name

if ([string]::IsNullOrWhiteSpace($Version)) {
    Write-Error "Version not found in manifest.json"
    exit 1
}

$DistDir = Join-Path $RootDir "dist"
$StagingDir = Join-Path $DistDir "$AppName-v$Version"
$ZipPath = Join-Path $DistDir "$AppName-v$Version.zip"

# Clean previous build artifacts for this version
if (Test-Path $StagingDir) {
    Remove-Item $StagingDir -Recurse -Force
}
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

New-Item -ItemType Directory -Path $StagingDir -Force | Out-Null

# Only include files/folders needed by the extension
$IncludeItems = @(
    "manifest.json",
    "background.js",
    "content.js",
    "content.css",
    "popup.html",
    "popup.js",
    "popup.css",
    "LICENSE",
    "icons",
    "libs"
)

foreach ($Item in $IncludeItems) {
    $SourcePath = Join-Path $RootDir $Item
    if (Test-Path $SourcePath) {
        Copy-Item -Path $SourcePath -Destination $StagingDir -Recurse -Force
    } else {
        Write-Warning "Skipping missing item: $Item"
    }
}

# Create zip with files at archive root (ready for Load unpacked / Web Store)
Compress-Archive -Path "$StagingDir\*" -DestinationPath $ZipPath -Force

# Remove staging folder
Remove-Item $StagingDir -Recurse -Force

$ZipSizeKB = [math]::Round((Get-Item $ZipPath).Length / 1KB, 2)
Write-Host "Release package created: $ZipPath ($ZipSizeKB KB)" -ForegroundColor Green
