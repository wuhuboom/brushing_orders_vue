$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$nsgRoot = Split-Path -Parent $PSScriptRoot
$nsgLogo = [System.Drawing.Image]::FromFile((Join-Path $nsgRoot 'public/nsg16/logo.png'))
$nsgSizes = @(16, 32, 48, 64, 128, 256)
$nsgFrames = @()
try {
    foreach ($nsgSize in $nsgSizes) {
        $nsgBitmap = New-Object System.Drawing.Bitmap($nsgSize, $nsgSize)
        $nsgGraphics = [System.Drawing.Graphics]::FromImage($nsgBitmap)
        $nsgStream = New-Object System.IO.MemoryStream
        try {
            $nsgGraphics.Clear([System.Drawing.Color]::Transparent)
            $nsgGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $nsgGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $nsgScale = [Math]::Min($nsgSize / $nsgLogo.Width, $nsgSize / $nsgLogo.Height)
            $nsgWidth = [int][Math]::Round($nsgLogo.Width * $nsgScale)
            $nsgHeight = [int][Math]::Round($nsgLogo.Height * $nsgScale)
            $nsgGraphics.DrawImage($nsgLogo, [int](($nsgSize - $nsgWidth) / 2), [int](($nsgSize - $nsgHeight) / 2), $nsgWidth, $nsgHeight)
            $nsgBitmap.Save($nsgStream, [System.Drawing.Imaging.ImageFormat]::Png)
            $nsgFrames += ,$nsgStream.ToArray()
        } finally {
            $nsgStream.Dispose()
            $nsgGraphics.Dispose()
            $nsgBitmap.Dispose()
        }
    }
} finally { $nsgLogo.Dispose() }

# ICO directory with lossless PNG frames; keep the original logo's aspect ratio.
$nsgOutput = [System.IO.File]::Create((Join-Path $nsgRoot 'public/favicon.ico'))
$nsgWriter = New-Object System.IO.BinaryWriter($nsgOutput)
try {
    $nsgWriter.Write([uint16]0)
    $nsgWriter.Write([uint16]1)
    $nsgWriter.Write([uint16]$nsgSizes.Count)
    $nsgOffset = 6 + 16 * $nsgSizes.Count
    for ($nsgIndex = 0; $nsgIndex -lt $nsgSizes.Count; $nsgIndex++) {
        $nsgDimension = $nsgSizes[$nsgIndex] % 256
        $nsgWriter.Write([byte]$nsgDimension)
        $nsgWriter.Write([byte]$nsgDimension)
        $nsgWriter.Write([byte]0)
        $nsgWriter.Write([byte]0)
        $nsgWriter.Write([uint16]1)
        $nsgWriter.Write([uint16]32)
        $nsgWriter.Write([uint32]$nsgFrames[$nsgIndex].Length)
        $nsgWriter.Write([uint32]$nsgOffset)
        $nsgOffset += $nsgFrames[$nsgIndex].Length
    }
    foreach ($nsgFrame in $nsgFrames) { $nsgWriter.Write([byte[]]$nsgFrame) }
} finally {
    $nsgWriter.Dispose()
    $nsgOutput.Dispose()
}
Write-Output 'Generated NSG favicon: 16, 32, 48, 64, 128 and 256 px.'
