param(
  [int]$Port = 8765,
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$Root = [System.IO.Path]::GetFullPath((Resolve-Path (Join-Path $PSScriptRoot "..")).Path)
$RootWithSlash = $Root
if (-not $RootWithSlash.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
  $RootWithSlash += [System.IO.Path]::DirectorySeparatorChar
}

function Test-PortAvailable {
  param([int]$CandidatePort)

  $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $CandidatePort)
  try {
    $probe.Start()
    return $true
  } catch {
    return $false
  } finally {
    if ($null -ne $probe) {
      $probe.Stop()
    }
  }
}

function Find-Port {
  param([int]$FirstPort)

  for ($candidate = $FirstPort; $candidate -lt ($FirstPort + 30); $candidate++) {
    if (Test-PortAvailable -CandidatePort $candidate) {
      return $candidate
    }
  }

  throw "No available local port found from $FirstPort to $($FirstPort + 29)."
}

function Get-ContentType {
  param([string]$Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".htm"  { return "text/html; charset=utf-8" }
    ".css"  { return "text/css; charset=utf-8" }
    ".js"   { return "text/javascript; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".svg"  { return "image/svg+xml" }
    ".png"  { return "image/png" }
    ".jpg"  { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".gif"  { return "image/gif" }
    ".webp" { return "image/webp" }
    ".ico"  { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$Reason,
    [string]$ContentType,
    [byte[]]$Body,
    [bool]$SendBody = $true
  )

  if ($null -eq $Body) {
    $Body = [System.Text.Encoding]::UTF8.GetBytes("")
  }

  $headers = @(
    "HTTP/1.1 $StatusCode $Reason",
    "Content-Type: $ContentType",
    "Content-Length: $($Body.Length)",
    "Cache-Control: no-store",
    "Connection: close",
    "",
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)

  if ($SendBody -and $Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

function Send-Text {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$Reason,
    [string]$Message,
    [bool]$SendBody = $true
  )

  $body = [System.Text.Encoding]::UTF8.GetBytes($Message)
  Send-Response -Stream $Stream -StatusCode $StatusCode -Reason $Reason -ContentType "text/plain; charset=utf-8" -Body $body -SendBody $SendBody
}

function Resolve-RequestPath {
  param([string]$Target)

  $pathOnly = ($Target -split "\?", 2)[0]
  $decoded = [System.Uri]::UnescapeDataString($pathOnly)

  if ([string]::IsNullOrWhiteSpace($decoded) -or $decoded -eq "/") {
    $decoded = "/index.html"
  }

  $relative = $decoded.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
  $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relative))

  if (-not $fullPath.StartsWith($RootWithSlash, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }

  if ([System.IO.Directory]::Exists($fullPath)) {
    $fullPath = Join-Path $fullPath "index.html"
  }

  return $fullPath
}

function Handle-Client {
  param([System.Net.Sockets.TcpClient]$Client)

  $stream = $Client.GetStream()
  $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 8192, $true)

  $requestLine = $reader.ReadLine()
  if ([string]::IsNullOrWhiteSpace($requestLine)) {
    return
  }

  while ($true) {
    $headerLine = $reader.ReadLine()
    if ([string]::IsNullOrEmpty($headerLine)) {
      break
    }
  }

  $parts = $requestLine.Split(" ")
  if ($parts.Length -lt 2) {
    Send-Text -Stream $stream -StatusCode 400 -Reason "Bad Request" -Message "Bad request."
    return
  }

  $method = $parts[0].ToUpperInvariant()
  $target = $parts[1]
  $sendBody = $method -ne "HEAD"

  if ($method -ne "GET" -and $method -ne "HEAD") {
    Send-Text -Stream $stream -StatusCode 405 -Reason "Method Not Allowed" -Message "Only GET and HEAD are supported." -SendBody $sendBody
    return
  }

  $filePath = Resolve-RequestPath -Target $target
  if ($null -eq $filePath) {
    Send-Text -Stream $stream -StatusCode 403 -Reason "Forbidden" -Message "Forbidden." -SendBody $sendBody
    return
  }

  if (-not [System.IO.File]::Exists($filePath)) {
    Send-Text -Stream $stream -StatusCode 404 -Reason "Not Found" -Message "Not found." -SendBody $sendBody
    return
  }

  try {
    $body = [System.IO.File]::ReadAllBytes($filePath)
    Send-Response -Stream $stream -StatusCode 200 -Reason "OK" -ContentType (Get-ContentType -Path $filePath) -Body $body -SendBody $sendBody
  } catch {
    Send-Text -Stream $stream -StatusCode 500 -Reason "Internal Server Error" -Message "Failed to read file." -SendBody $sendBody
  }
}

$Port = Find-Port -FirstPort $Port
$Url = "http://127.0.0.1:$Port/"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)

try {
  $listener.Start()
  Write-Host ""
  Write-Host "Local service is running: $Url"
  Write-Host "Project folder: $Root"
  Write-Host "Keep this window open while using the page. Press Ctrl+C or close the window to stop."
  Write-Host ""

  if (-not $NoBrowser) {
    Start-Process $Url
  }

  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      Handle-Client -Client $client
    } catch {
      try {
        Send-Text -Stream $client.GetStream() -StatusCode 500 -Reason "Internal Server Error" -Message "Server error."
      } catch {
      }
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
