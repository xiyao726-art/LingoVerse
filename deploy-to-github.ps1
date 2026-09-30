# Publish/update site via GitHub API (uses api.github.com only, no git push to github.com)
# Auth: gh auth login
$ErrorActionPreference = "Stop"
$owner = "xiyao726-art"
$repo  = "LingoVerse"
$root  = $PSScriptRoot
if (-not $root) { $root = Split-Path -Parent $MyInvocation.MyCommand.Path }
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$utf8 = New-Object Text.UTF8Encoding($false)
$message = [Text.Encoding]::UTF8.GetString([IO.File]::ReadAllBytes((Join-Path $root "commit-msg.txt"))).Trim()
$tmpBody = "$env:TEMP\lv-body.json"

function GhApiJson($path, $obj, $method) {
  $json = ($obj | ConvertTo-Json -Depth 8 -Compress)
  [IO.File]::WriteAllText($tmpBody, $json, $utf8)
  $ghArgs = @("api", $path, "--input", $tmpBody, "--jq", ".sha")
  if ($method) { $ghArgs = @("api", $path, "--method", $method, "--input", $tmpBody, "--jq", ".sha") }
  return ((& $gh @ghArgs) -join "").Trim()
}

# 1. Resolve current main (repo may be empty)
$parent = ""
try { $parent = ((& $gh api "repos/$owner/$repo/git/refs/heads/main" --jq ".object.sha" 2>$null) -join "").Trim() } catch { $parent = "" }

# 2. Empty repo must be initialized first (Git DB blobs return 409 until then)
if (-not $parent) {
  Write-Host "repo empty -> initializing with .nojekyll via Contents API"
  $initB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(""))
  $initReq = @{ message = "init: GitHub Pages (no Jekyll)"; content = $initB64 } | ConvertTo-Json -Compress
  [IO.File]::WriteAllText($tmpBody, $initReq, $utf8)
  $initSha = ((& $gh api "repos/$owner/$repo/contents/.nojekyll" --method PUT --input $tmpBody --jq ".commit.sha") -join "").Trim()
  if (-not $initSha) { throw "init failed" }
  $parent = ((& $gh api "repos/$owner/$repo/git/refs/heads/main" --jq ".object.sha") -join "").Trim()
  Write-Host "initialized parent=$parent"
}

$include = @(
  ".nojekyll", ".gitignore", "index.html", "manifest.webmanifest", "sw.js", "serve.ps1",
  "css/style.css",
  "js/data.js", "js/store.js", "js/speech.js", "js/learn.js", "js/social.js", "js/app.js",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "icons/icon-512-maskable.png", "icons/apple-touch-icon.png", "icons/favicon.png"
)

# 3. Blobs (payload via file to avoid command-line length limits)
$tree = @()
foreach ($rel in $include) {
  $disk = Join-Path $root ($rel -replace "/", "\")
  $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($disk))
  $sha = GhApiJson "repos/$owner/$repo/git/blobs" @{ content = $b64; encoding = "base64" }
  if (-not $sha) { throw "blob failed: $rel" }
  $tree += @{ path = ($rel -replace "\\", "/"); mode = "100644"; type = "blob"; sha = $sha }
  Write-Host "blob OK  $rel  $sha"
}

# 4. Tree -> Commit -> update ref (full tree: every included file is in this commit)
$treeSha = GhApiJson "repos/$owner/$repo/git/trees" @{ tree = $tree }
if (-not $treeSha) { throw "tree failed" }
Write-Host "tree OK  $treeSha"

$commitReq = @{ message = $message; tree = $treeSha; parents = @($parent) } | ConvertTo-Json -Depth 6 -Compress
[IO.File]::WriteAllText($tmpBody, $commitReq, $utf8)
$commitSha = ((& $gh api "repos/$owner/$repo/git/commits" --input $tmpBody --jq ".sha") -join "").Trim()
if (-not $commitSha) { throw "commit failed" }
Write-Host "commit OK $commitSha"

$refReq = @{ sha = $commitSha; force = $false } | ConvertTo-Json -Compress
[IO.File]::WriteAllText($tmpBody, $refReq, $utf8)
& $gh api "repos/$owner/$repo/git/refs/heads/main" --method PATCH --input $tmpBody | Out-Null
Write-Host "DONE: https://github.com/$owner/$repo/commit/$commitSha"
