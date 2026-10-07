param([int]$Port = 4173)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$root = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..')).Path
$env:PORT = [string]$Port
Write-Host "SPIDEY LIFE local server: http://127.0.0.1:$Port/" -ForegroundColor Cyan
Write-Host "Notion API is available when .env.local contains NOTION_API_KEY." -ForegroundColor Gray
& node --experimental-default-type=module (Join-Path $root 'tools\dev_server.js')
