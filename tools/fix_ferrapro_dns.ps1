$ErrorActionPreference = "Stop"
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses @("1.1.1.1","8.8.8.8","192.168.1.1")
$hosts = "$env:SystemRoot\System32\drivers\etc\hosts"
$entry = "`r`n104.21.38.5 ferrapro.com`r`n104.21.38.5 www.ferrapro.com`r`n"
$cur = Get-Content $hosts -Raw
if ($cur -notmatch "ferrapro\.com") { Add-Content -Path $hosts -Value $entry -Encoding ASCII }
ipconfig /flushdns | Out-Null
"OK"
