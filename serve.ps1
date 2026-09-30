# 语界 LingoVerse 本地静态服务器
# 用法：在本目录执行  powershell -ExecutionPolicy Bypass -File .\serve.ps1
# 然后浏览器打开 http://localhost:8765/
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8765/")
$listener.Start()
Write-Host "语界 LingoVerse 已启动： http://localhost:8765/  (按 Ctrl+C 停止)" -ForegroundColor Green

$types = @{
  ".html"       = "text/html; charset=utf-8"
  ".js"         = "application/javascript; charset=utf-8"
  ".css"        = "text/css; charset=utf-8"
  ".json"       = "application/json; charset=utf-8"
  ".webmanifest"= "application/manifest+json; charset=utf-8"
  ".png"        = "image/png"
  ".jpg"        = "image/jpeg"
  ".svg"        = "image/svg+xml"
  ".ico"        = "image/x-icon"
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $file = Join-Path $root ($rel -replace "/", "\")

    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      if ($types.ContainsKey($ext)) { $ctx.Response.ContentType = $types[$ext] }
      else { $ctx.Response.ContentType = "application/octet-stream" }
      if ($rel -eq "sw.js") { $ctx.Response.Headers["Cache-Control"] = "no-cache" }
      else { $ctx.Response.Headers["Cache-Control"] = "no-cache, must-revalidate" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
