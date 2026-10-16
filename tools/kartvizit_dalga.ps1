Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;

public static class WaveField {
  public static void FillFromWave(Graphics g, int W, int H, float baseX, float amp, float phase, Brush brush) {
    GraphicsPath path = new GraphicsPath();
    PointF[] pts = new PointF[H + 1];
    for (int y = 0; y <= H; y++) {
      float t = (float)y / H;
      pts[y] = new PointF(baseX + amp * (float)Math.Sin(2.0 * Math.PI * t + phase), y);
    }
    path.AddLines(pts);
    path.AddLine(W + 2, H, W + 2, 0);
    path.CloseFigure();
    g.FillPath(brush, path);
    path.Dispose();
  }
}
"@

$navy = [System.Drawing.Color]::FromArgb(11, 30, 56)
$navyDeep = [System.Drawing.Color]::FromArgb(8, 14, 28)
$wave1 = [System.Drawing.Color]::FromArgb(14, 42, 74)
$wave2 = [System.Drawing.Color]::FromArgb(22, 58, 96)
$wave3 = [System.Drawing.Color]::FromArgb(30, 78, 120)
$cream = [System.Drawing.Color]::FromArgb(245, 241, 232)
$white = [System.Drawing.Color]::FromArgb(244, 239, 230)
$city = ([char]0x0130).ToString() + "stanbul"

$W = 1280; $H = 720
$outDir = "C:\tedarik\public\kartvizit"
$webDir = Join-Path $outDir "web"
$assetDir = "C:\Users\swsyn\.cursor\projects\c-tedarik\assets"
New-Item -ItemType Directory -Force -Path $webDir | Out-Null

$hex = [System.Drawing.Image]::FromFile("C:\tedarik\public\logo\ferrapro-hex.png")
$qr = [System.Drawing.Image]::FromFile("$outDir\qr-ferrapro.png")

function New-G([System.Drawing.Bitmap]$bmp) {
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return $g
}

function Draw-FrontWaves([System.Drawing.Graphics]$g) {
  $rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $navyDeep, $navy, 0.0
  $g.FillRectangle($grad, $rect)
  $grad.Dispose()
  $amp = [single]48
  $phase = [single]0.35
  $b1 = New-Object System.Drawing.SolidBrush $wave1
  $b2 = New-Object System.Drawing.SolidBrush $wave2
  $b3 = New-Object System.Drawing.SolidBrush $wave3
  $bC = New-Object System.Drawing.SolidBrush $cream
  [WaveField]::FillFromWave($g, $W, $H, 798, $amp, $phase, $b1)
  [WaveField]::FillFromWave($g, $W, $H, 838, $amp, $phase, $b2)
  [WaveField]::FillFromWave($g, $W, $H, 878, $amp, $phase, $b3)
  [WaveField]::FillFromWave($g, $W, $H, 918, $amp, $phase, $bC)
  $b1.Dispose(); $b2.Dispose(); $b3.Dispose(); $bC.Dispose()
}

function Draw-BackBg([string]$src, [System.Drawing.Graphics]$g) {
  $img = [System.Drawing.Image]::FromFile($src)
  $g.DrawImage($img, 0, 0, $W, $H)
  $img.Dispose()
}

function Draw-Icon([System.Drawing.Graphics]$g, [string]$kind, [int]$x, [int]$y, [System.Drawing.Font]$iconFont, [System.Drawing.Brush]$brush) {
  $size = 58
  $pen = New-Object System.Drawing.Pen $white, 2.4
  $g.DrawEllipse($pen, $x, $y, $size, $size)
  $ch = switch ($kind) {
    "phone" { [char]0xE13A }
    "mail"  { [char]0xE715 }
    default { [char]0xE707 }
  }
  $g.DrawString([string]$ch, $iconFont, $brush, $x + 12, $y + 12)
  $pen.Dispose()
}

$bWhite = New-Object System.Drawing.SolidBrush $white
$bNavy = New-Object System.Drawing.SolidBrush $navy
$fontName = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]48)
$fontSlogan = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]26)
$fontLine = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [single]26)
$fontBrand = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]34)
$fontBrandLg = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]56)
$fontWeb = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]18)
$fontIcon = New-Object System.Drawing.Font -ArgumentList @("Segoe MDL2 Assets", [single]18)

$slogan1 = ([char]0x0130).ToString() + ([char]0x015F).ToString() + "letmelere Kesintisiz"
$slogan2 = "Tedarik " + ([char]0x00C7).ToString() + ([char]0x00F6).ToString() + "z" + ([char]0x00FC).ToString() + "mleri"
$slogan = "$slogan1 $slogan2"

# --- FRONT BACKGROUND ---
$zemin = New-Object System.Drawing.Bitmap $W, $H
$gz = New-G $zemin
Draw-FrontWaves $gz
$zemin.Save("$assetDir\kartvizit-dalga-on-zemin.png", [System.Drawing.Imaging.ImageFormat]::Png)
$gz.Dispose()

# --- FRONT ---
$front = New-Object System.Drawing.Bitmap $W, $H
$g = New-G $front
$g.DrawImage($zemin, 0, 0, $W, $H)
$zemin.Dispose()
$g.DrawString("Ayfer Adatepe", $fontName, $bWhite, 52, 54)
$g.DrawString($slogan1, $fontSlogan, $bWhite, 54, 148)
$g.DrawString($slogan2, $fontSlogan, $bWhite, 54, 190)

Draw-Icon $g "phone" 52 400 $fontIcon $bWhite
Draw-Icon $g "mail" 52 490 $fontIcon $bWhite
Draw-Icon $g "pin" 52 580 $fontIcon $bWhite
$g.DrawString("0530 716 18 77", $fontLine, $bWhite, 128, 408)
$g.DrawString("info@ferrapro.com", $fontLine, $bWhite, 128, 498)
$g.DrawString("Ata" + ([char]0x015F) + "ehir/" + $city, $fontLine, $bWhite, 128, 588)

$tw = 128; $th = 128
$tx = 1048; $ty = 48
$g.DrawImage($hex, $tx, $ty, $tw, $th)
$g.DrawString("FerraPro", $fontBrand, $bNavy, 1034, 186)

$qrS = 142
$qrX = 1040
$qrY = 508
$g.DrawImage($qr, $qrX, $qrY, $qrS, $qrS)
$g.DrawString("ferrapro.com", $fontWeb, $bNavy, $qrX + 12, $qrY - 32)

$front.Save("$outDir\kartvizit-navy-on.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $front.Dispose()

# --- BACK ---
$back = New-Object System.Drawing.Bitmap $W, $H
$g = New-G $back
Draw-BackBg "$assetDir\kartvizit-dalga-arka-zemin.png" $g
$mh = 152
$mw = [int]($hex.Width * $mh / $hex.Height)
$g.DrawImage($hex, 48, 48, $mw, $mh)
$brandX = 48 + $mw + 24
$g.DrawString("FerraPro", $fontBrandLg, $bWhite, $brandX, 52)
$g.DrawString($slogan1, $fontSlogan, $bWhite, $brandX, 148)
$g.DrawString($slogan2, $fontSlogan, $bWhite, $brandX, 190)

$qrS = 168
$qrX = $W - 64 - $qrS
$qrY = $H - 72 - $qrS
$g.DrawImage($qr, $qrX, $qrY, $qrS, $qrS)
$g.DrawString("ferrapro.com", $fontWeb, $bNavy, $qrX + 18, $qrY - 34)

$back.Save("$outDir\kartvizit-navy-arka.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $back.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$enc = New-Object System.Drawing.Imaging.EncoderParameters 1
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 86L
function Save-Jpg([string]$inPath, [string]$outName) {
  $src = [System.Drawing.Image]::FromFile($inPath)
  $ww = 1100; $hh = [int]($src.Height * $ww / $src.Width)
  $bmp = New-Object System.Drawing.Bitmap $ww, $hh
  $gg = [System.Drawing.Graphics]::FromImage($bmp)
  $gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg.DrawImage($src, 0, 0, $ww, $hh)
  $bmp.Save((Join-Path $webDir $outName), $codec, $enc)
  $gg.Dispose(); $bmp.Dispose(); $src.Dispose()
}
Save-Jpg "$outDir\kartvizit-navy-on.png" "navy-on.jpg"
Save-Jpg "$outDir\kartvizit-navy-arka.png" "navy-arka.jpg"

$hex.Dispose(); $qr.Dispose()
$bWhite.Dispose(); $bNavy.Dispose()
$fontName.Dispose(); $fontSlogan.Dispose(); $fontLine.Dispose()
$fontBrand.Dispose(); $fontBrandLg.Dispose(); $fontWeb.Dispose(); $fontIcon.Dispose()
Write-Output "ok"
