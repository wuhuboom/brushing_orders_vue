$ErrorActionPreference = 'Stop'
$nsgRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$nsgManifestPath = Join-Path $nsgRoot 'artifacts/resource-cleanup-20260906/audit-before.json'
$nsgAudit = Get-Content -LiteralPath $nsgManifestPath -Raw | ConvertFrom-Json
if ($nsgAudit.root -ne $nsgRoot) { throw 'Audit belongs to a different workspace.' }
$nsgAllowed = @('public', 'src/static', 'src/assets') | ForEach-Object {
    [System.IO.Path]::GetFullPath((Join-Path $nsgRoot $_)) + [System.IO.Path]::DirectorySeparatorChar
}

# Fail closed if a source file changed after the reference audit.
foreach ($nsgProperty in $nsgAudit.sourceHashes.PSObject.Properties) {
    $nsgSource = [System.IO.Path]::GetFullPath((Join-Path $nsgRoot $nsgProperty.Name))
    if (-not $nsgSource.StartsWith($nsgRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Source path escapes workspace.' }
    if ((Get-FileHash -LiteralPath $nsgSource -Algorithm SHA256).Hash -ne $nsgProperty.Value) { throw "Source changed since audit: $($nsgProperty.Name)" }
}
$nsgCandidates = @($nsgAudit.resources | Where-Object { $_.references.Count -eq 0 })
if (-not $nsgCandidates.Count) { throw 'No unreferenced files in audit.' }
$nsgValidated = foreach ($nsgResource in $nsgCandidates) {
    $nsgPath = [System.IO.Path]::GetFullPath((Join-Path $nsgRoot $nsgResource.file))
    if (-not ($nsgAllowed | Where-Object { $nsgPath.StartsWith($_, [System.StringComparison]::OrdinalIgnoreCase) })) { throw "Target outside approved directories: $nsgPath" }
    $nsgItem = Get-Item -LiteralPath $nsgPath -Force
    if ($nsgItem.PSIsContainer -or ($nsgItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint)) { throw "Not a regular file: $nsgPath" }
    if ((Get-FileHash -LiteralPath $nsgPath -Algorithm SHA256).Hash -ne $nsgResource.sha256) { throw "Resource changed since audit: $nsgPath" }
    [PSCustomObject]@{ File = $nsgResource.file; Source = $nsgPath; Sha256 = $nsgResource.sha256; Size = $nsgResource.size }
}

$nsgBackup = Join-Path ([System.IO.Path]::GetTempPath()) ('nsg-unused-assets-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $nsgBackup | Out-Null
foreach ($nsgResource in $nsgValidated) {
    $nsgDestination = [System.IO.Path]::GetFullPath((Join-Path $nsgBackup $nsgResource.File))
    if (-not $nsgDestination.StartsWith($nsgBackup + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Backup target escapes backup directory.' }
    New-Item -ItemType Directory -Path (Split-Path -Parent $nsgDestination) -Force | Out-Null
    Copy-Item -LiteralPath $nsgResource.Source -Destination $nsgDestination
    if ((Get-FileHash -LiteralPath $nsgDestination -Algorithm SHA256).Hash -ne $nsgResource.Sha256) { throw "Backup checksum mismatch: $nsgDestination" }
}
$nsgResult = [PSCustomObject]@{ Backup = $nsgBackup; Files = $nsgValidated; RemovedCount = 0; RemovedBytes = 0 }
$nsgResultPath = Join-Path $nsgRoot 'artifacts/resource-cleanup-20260906/cleanup-result.json'
[System.IO.File]::WriteAllText($nsgResultPath, ($nsgResult | ConvertTo-Json -Depth 8), [System.Text.UTF8Encoding]::new($false))

# Every target is an explicitly validated file, and every backup has been verified.
# No recursive deletion or wildcard deletion is used.
foreach ($nsgResource in $nsgValidated) {
    if ((Get-FileHash -LiteralPath $nsgResource.Source -Algorithm SHA256).Hash -ne $nsgResource.Sha256) { throw "File changed before deletion: $($nsgResource.Source)" }
    Remove-Item -LiteralPath $nsgResource.Source
    $nsgResult.RemovedCount++
    $nsgResult.RemovedBytes += $nsgResource.Size
    [System.IO.File]::WriteAllText($nsgResultPath, ($nsgResult | ConvertTo-Json -Depth 8), [System.Text.UTF8Encoding]::new($false))
}
Write-Output ($nsgResult | Select-Object Backup, RemovedCount, RemovedBytes | ConvertTo-Json)
