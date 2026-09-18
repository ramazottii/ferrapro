Add-Type -AssemblyName System.Drawing

$cream = [System.Drawing.Color]::FromArgb(245, 241, 232)
$teal = [System.Drawing.Color]::FromArgb(30, 107, 92)
$charcoal = [System.Drawing.Color]::FromArgb(28, 31, 29)
$creamOnTeal = [System.Drawing.Color]::FromArgb(245, 241, 232)

$name = "Ayfer Adatepe"
$phone = "(+90) 532 589 14 36"

function New-Brush([System.Drawing.Color]$c) {
  New-Object System.Drawing.SolidBrush $c
}

function Save-Png([System.Drawing.Bitmap]$bmp, [string]$path) {
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Open-Edit([string]$src) {
  $srcBmp = [System.Drawing.Bitmap]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap $srcBmp.Width, $srcBmp.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.DrawImage($srcBmp, 0, 0, $srcBmp.Width, $srcBmp.Height)
  $srcBmp.Dispose()
  return @{ Bmp = $bmp; G = $g }
}

$srcDir = "C:\Users\swsyn\.cursor\projects\c-tedarik\assets"
$dir = "C:\tedarik\public\kartvizit"

$brushCream = New-Brush $cream
$brushInk = New-Brush $charcoal
$brushTeal = New-Brush $teal
$brushLight = New-Brush $creamOnTeal
$fontName = New-Object System.Drawing.Font "Segoe UI Semibold", 26
$fontPhone = New-Object System.Drawing.Font "Segoe UI", 16
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

# A on: keep original Istanbul; add name + phone under website
$a = Open-Edit "$srcDir\kartvizit-a-on.png"
$g = $a.G
$g.DrawString($name, $fontName, $brushInk, 478, 488)
$g.DrawString($phone, $fontPhone, $brushInk, 478, 540)
Save-Png $a.Bmp "$dir\kartvizit-a-on.png"
$g.Dispose(); $a.Bmp.Dispose()

# A back stays brand-only (contact is on the front)
Copy-Item -Force "$srcDir\kartvizit-a-arka.png" "$dir\kartvizit-a-arka.png"

# B on: cover old Istanbul, write name + phone (Istanbul stays omitted rather than garbled)
$b = Open-Edit "$srcDir\kartvizit-b-on.png"
$g = $b.G
$g.FillRectangle($brushCream, 560, 455, 680, 230)
$g.DrawString($name, $fontName, $brushInk, 620, 478)
$g.DrawString($phone, $fontPhone, $brushInk, 620, 532)
Save-Png $b.Bmp "$dir\kartvizit-b-on.png"
$g.Dispose(); $b.Bmp.Dispose()

# B back
$b2 = Open-Edit "$srcDir\kartvizit-b-arka.png"
$g = $b2.G
$g.FillRectangle($brushCream, 80, 560, 720, 120)
$g.DrawString($name, $fontPhone, $brushInk, 96, 568)
$g.DrawString($phone, $fontPhone, $brushInk, 96, 608)
Save-Png $b2.Bmp "$dir\kartvizit-b-arka.png"
$g.Dispose(); $b2.Bmp.Dispose()

$brushCream.Dispose(); $brushInk.Dispose(); $brushTeal.Dispose(); $brushLight.Dispose()
$fontName.Dispose(); $fontPhone.Dispose()
Write-Output "ok"
