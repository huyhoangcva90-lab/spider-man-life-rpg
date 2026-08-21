[CmdletBinding(DefaultParameterSetName = 'Prompt')]
param(
    [Parameter(Mandatory, ParameterSetName = 'Prompt')]
    [string]$Prompt,

    [Parameter(Mandatory, ParameterSetName = 'TaskFile')]
    [string]$TaskFile,

    [ValidateSet('plan', 'accept-edits')]
    [string]$Mode = 'accept-edits',

    [ValidateSet('text', 'json', 'stream-json')]
    [string]$OutputFormat = 'stream-json',

    [string]$Model = 'gemini-3.6-flash-high',

    [string]$PrintTimeout = '20m'
)

$ErrorActionPreference = 'Stop'

$agyPath = Join-Path $env:LOCALAPPDATA 'agy\bin\agy.exe'
if (-not (Test-Path -LiteralPath $agyPath)) {
    throw "Antigravity CLI not found at: $agyPath"
}

$workspacePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

if ($PSCmdlet.ParameterSetName -eq 'TaskFile') {
    $resolvedTaskFile = (Resolve-Path -LiteralPath $TaskFile).Path
    $Prompt = Get-Content -LiteralPath $resolvedTaskFile -Raw
}

Push-Location $workspacePath
try {
    & $agyPath `
        -p $Prompt `
        --add-dir $workspacePath `
        --mode $Mode `
        --sandbox `
        --model $Model `
        --output-format $OutputFormat `
        --print-timeout $PrintTimeout

    if ($LASTEXITCODE -ne 0) {
        throw "Antigravity CLI exited with code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}
