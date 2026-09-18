Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class NavyLockup {
  public static Bitmap Make(string path, Color navy) {
    Bitmap src = new Bitmap(path);
    int w = src.Width, h = src.Height;
    Rectangle rect = new Rectangle(0, 0, w, h);
    BitmapData sData = src.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int stride = sData.Stride;
    byte[] buf = new byte[Math.Abs(stride) * h];
    Marshal.Copy(sData.Scan0, buf, 0, buf.Length);
    src.UnlockBits(sData);
    src.Dispose();

    bool[] outside = new bool[w * h];
    Queue<int> q = new Queue<int>();
    Action<int,int> enq = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      int idx = y * w + x;
      if (outside[idx]) return;
      int i = y * stride + x * 4;
      byte b = buf[i], g = buf[i+1], r = buf[i+2];
      if (r > 220 && g > 215 && b > 200) { outside[idx] = true; q.Enqueue(idx); }
    };
    enq(0,0); enq(w-1,0); enq(0,h-1); enq(w-1,h-1);
    while (q.Count > 0) {
      int idx = q.Dequeue();
      int x = idx % w, y = idx / w;
      enq(x+1,y); enq(x-1,y); enq(x,y+1); enq(x,y-1);
    }

    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    BitmapData dData = bmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    byte[] dst = new byte[buf.Length];
    int minX = w, minY = h, maxX = 0, maxY = 0;
    for (int y = 0; y < h; y++) {
      for (int x = 0; x < w; x++) {
        int idx = y * w + x;
        int i = y * stride + x * 4;
        if (outside[idx]) { dst[i] = dst[i+1] = dst[i+2] = dst[i+3] = 0; continue; }
        byte b = buf[i], g = buf[i+1], r = buf[i+2];
        bool teal = g > (r + 20) && g > 60 && g < 180;
        if (teal) { dst[i] = navy.B; dst[i+1] = navy.G; dst[i+2] = navy.R; dst[i+3] = 255; }
        else { dst[i] = buf[i]; dst[i+1] = buf[i+1]; dst[i+2] = buf[i+2]; dst[i+3] = 255; }
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
      }
    }
    Marshal.Copy(dst, 0, dData.Scan0, dst.Length);
    bmp.UnlockBits(dData);
    int pad = 4;
    minX = Math.Max(0, minX - pad);
    minY = Math.Max(0, minY - pad);
    int cw = Math.Min(w - minX, maxX - minX + 1 + pad);
    int ch = Math.Min(h - minY, maxY - minY + 1 + pad);
    Bitmap crop = bmp.Clone(new Rectangle(minX, minY, cw, ch), PixelFormat.Format32bppArgb);
    bmp.Dispose();
    return crop;
  }
}
"@

$navy = [System.Drawing.Color]::FromArgb(11, 30, 56)
$cream = [System.Drawing.Color]::FromArgb(245, 241, 232)
$ink = [System.Drawing.Color]::FromArgb(11, 30, 56)
$city = ([char]0x0130).ToString() + "stanbul"
$name = "Ayfer Adatepe"
$phone = "(+90) 532 589 14 36"
$email = "info@ferrapro.com"
$address = "Tuzla Tepe" + ([char]0x00F6) + "ren, " + $city
$web = "ferrapro.com"

$outDir = "C:\tedarik\public\kartvizit"
$webDir = Join-Path $outDir "web"
New-Item -ItemType Directory -Force -Path $webDir | Out-Null

$tile = [NavyLockup]::Make("C:\tedarik\public\logo\ferrapro-fayans.png", $navy)
$tile.Save((Join-Path $outDir "ferrapro-fayans-navy.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$W = 1280; $H = 720
$bNavy = New-Object System.Drawing.SolidBrush $ink
$bCream = New-Object System.Drawing.SolidBrush $cream

$fontBrand = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]36)
$fontName = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [single]26)
$fontPhone = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [single]18)
$fontLine = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [single]18)

# --- FRONT: cream, navy logo left, name/phone right ---
$front = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($front)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear($cream)

$tileH = 320
$tileW = [int]($tile.Width * $tileH / $tile.Height)
$tileX = 72
$tileY = [int](($H - $tileH) / 2)
$g.DrawImage($tile, $tileX, $tileY, $tileW, $tileH)

$textX = $tileX + $tileW + 72
$textY = [int](($H / 2) - 78)
$g.DrawString("FerraPro", $fontBrand, $bNavy, $textX, $textY)
$g.DrawString($name, $fontName, $bNavy, $textX, $textY + 70)
$g.DrawString($phone, $fontPhone, $bNavy, $textX, $textY + 122)

$front.Save((Join-Path $outDir "kartvizit-navy-on.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $front.Dispose()

# --- BACK: cream, stacked aligned info ---
$back = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($back)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear($cream)

$infoX = 88
$lineH = 52
$blockH = $lineH * 3
$infoY = [int](($H - $blockH) / 2)
$g.DrawString($email, $fontLine, $bNavy, $infoX, $infoY)
$g.DrawString($address, $fontLine, $bNavy, $infoX, $infoY + $lineH)
$g.DrawString($web, $fontLine, $bNavy, $infoX, $infoY + ($lineH * 2))

$back.Save((Join-Path $outDir "kartvizit-navy-arka.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $back.Dispose(); $tile.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$enc = New-Object System.Drawing.Imaging.EncoderParameters 1
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 84L
function Save-Jpg([string]$inPath, [string]$outName, [int]$width) {
  $src = [System.Drawing.Image]::FromFile($inPath)
  $hh = [int]($src.Height * $width / $src.Width)
  $bmp = New-Object System.Drawing.Bitmap $width, $hh
  $gg = [System.Drawing.Graphics]::FromImage($bmp)
  $gg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gg.DrawImage($src, 0, 0, $width, $hh)
  $bmp.Save((Join-Path $webDir $outName), $codec, $enc)
  $gg.Dispose(); $bmp.Dispose(); $src.Dispose()
}
Save-Jpg (Join-Path $outDir "kartvizit-navy-on.png") "navy-on.jpg" 1100
Save-Jpg (Join-Path $outDir "kartvizit-navy-arka.png") "navy-arka.jpg" 1100

$bNavy.Dispose(); $bCream.Dispose()
$fontBrand.Dispose(); $fontName.Dispose(); $fontPhone.Dispose(); $fontLine.Dispose()
Write-Output "ok"
