Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class TileInvert {
  public static Bitmap CreamMosaic(string path, Color navy, Color cream) {
    Bitmap src = new Bitmap(path);
    int w = src.Width, h = src.Height;
    Rectangle rect = new Rectangle(0, 0, w, h);
    BitmapData sData = src.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int stride = Math.Abs(sData.Stride);
    byte[] buf = new byte[stride * h];
    Marshal.Copy(sData.Scan0, buf, 0, buf.Length);
    src.UnlockBits(sData);
    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    BitmapData dData = bmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    for (int y = 0; y < h; y++) {
      for (int x = 0; x < w; x++) {
        int i = y * stride + x * 4;
        byte a = buf[i+3];
        if (a < 12) continue;
        byte b = buf[i], g = buf[i+1], r = buf[i+2];
        int lum = r + g + b;
        if (lum < 220) { buf[i] = cream.B; buf[i+1] = cream.G; buf[i+2] = cream.R; }
        else { buf[i] = navy.B; buf[i+1] = navy.G; buf[i+2] = navy.R; }
      }
    }
    Marshal.Copy(buf, 0, dData.Scan0, buf.Length);
    bmp.UnlockBits(dData);
    src.Dispose();
    return bmp;
  }
}
"@

$navy = [System.Drawing.Color]::FromArgb(11, 30, 56)
$cream = [System.Drawing.Color]::FromArgb(245, 241, 232)
$white = [System.Drawing.Color]::FromArgb(244, 239, 230)
$muted = [System.Drawing.Color]::FromArgb(190, 205, 220)
$city = ([char]0x0130).ToString() + "stanbul"

$W = 1280; $H = 720
$outDir = "C:\tedarik\public\kartvizit"
$webDir = Join-Path $outDir "web"
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

function Draw-Bg([string]$src, [System.Drawing.Graphics]$g) {
  $img = [System.Drawing.Image]::FromFile($src)
  $g.DrawImage($img, 0, 0, $W, $H)
  $img.Dispose()
}

function Draw-Icon([System.Drawing.Graphics]$g, [string]$kind, [int]$x, [int]$y, [System.Drawing.Font]$iconFont, [System.Drawing.Brush]$brush) {
  $pen = New-Object System.Drawing.Pen $white, 2.0
  $g.DrawEllipse($pen, $x, $y, 46, 46)
  $ch = switch ($kind) {
    "phone" { [char]0xE13A }
    "mail"  { [char]0xE715 }
    default { [char]0xE707 }
  }
  $g.DrawString([string]$ch, $iconFont, $brush, $x + 10, $y + 10)
  $pen.Dispose()
}

$bWhite = New-Object System.Drawing.SolidBrush $white
$bNavy = New-Object System.Drawing.SolidBrush $navy
$bCream = New-Object System.Drawing.SolidBrush $cream
$bMuted = New-Object System.Drawing.SolidBrush $muted
$fontName = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]36)
$fontSub = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [single]18)
$fontSlogan = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]20)
$fontLine = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [single]20)
$fontBrand = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]32)
$fontBrandLg = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]48)
$fontWeb = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]16)
$fontIcon = New-Object System.Drawing.Font -ArgumentList @("Segoe MDL2 Assets", [single]16)

# --- FRONT (contact + logo) ---
$front = New-Object System.Drawing.Bitmap $W, $H
$g = New-G $front
Draw-Bg "C:\Users\swsyn\.cursor\projects\c-tedarik\assets\kartvizit-dalga-on-zemin.png" $g
$slogan = ([char]0x0130).ToString() + ([char]0x015F).ToString() + "letmelere Kesintisiz Tedarik " + ([char]0x00C7).ToString() + ([char]0x00F6).ToString() + "z" + ([char]0x00FC).ToString() + "mleri"
$g.DrawString("Ayfer Adatepe", $fontName, $bWhite, 64, 72)
$g.DrawString($slogan, $fontSlogan, $bWhite, 66, 168)
Draw-Icon $g "phone" 64 430 $fontIcon $bWhite
Draw-Icon $g "mail" 64 510 $fontIcon $bWhite
Draw-Icon $g "pin" 64 590 $fontIcon $bWhite
$g.DrawString("(+90) 532 589 14 36", $fontLine, $bWhite, 128, 438)
$g.DrawString("info@ferrapro.com", $fontLine, $bWhite, 128, 518)
$g.DrawString("Tuzla Tepe" + ([char]0x00F6) + "ren, " + $city, $fontLine, $bWhite, 128, 598)

$tw = 148; $th = 148
$tx = 972; $ty = 108
$g.DrawImage($hex, $tx, $ty, $tw, $th)
$g.DrawString("FerraPro", $fontBrand, $bNavy, 958, 272)

$front.Save("$outDir\kartvizit-navy-on.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $front.Dispose()

# --- BACK (brand + QR) ---
$back = New-Object System.Drawing.Bitmap $W, $H
$g = New-G $back
Draw-Bg "C:\Users\swsyn\.cursor\projects\c-tedarik\assets\kartvizit-dalga-arka-zemin.png" $g
$mh = 140
$mw = [int]($hex.Width * $mh / $hex.Height)
$g.DrawImage($hex, 56, 64, $mw, $mh)
$brandX = 56 + $mw + 28
$g.DrawString("FerraPro", $fontBrandLg, $bWhite, $brandX, 68)
$g.DrawString($slogan, $fontSlogan, $bWhite, (New-Object System.Drawing.RectangleF $brandX, 190, 760, 60))

$qrS = 168
$qrX = $W - 72 - $qrS
$qrY = $H - 88 - $qrS
$g.DrawImage($qr, $qrX, $qrY, $qrS, $qrS)
$g.DrawString("ferrapro.com", $fontWeb, $bNavy, $qrX + 22, $qrY - 32)

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
$bWhite.Dispose(); $bNavy.Dispose(); $bCream.Dispose(); $bMuted.Dispose()
$fontName.Dispose(); $fontSub.Dispose(); $fontSlogan.Dispose(); $fontLine.Dispose()
$fontBrand.Dispose(); $fontBrandLg.Dispose(); $fontWeb.Dispose(); $fontIcon.Dispose()
Write-Output "ok"
