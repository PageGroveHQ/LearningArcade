$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host 'Circuit Sentinel State Quest audio generator' -ForegroundColor Cyan
Write-Host '51 location names + 51 capitals, including Washington, D.C.' -ForegroundColor Cyan
Write-Host 'SECURE HIDDEN PROMPT: paste the Learning Arcade Fish key only after the prompt below appears.' -ForegroundColor Yellow
$secureKey = Read-Host 'Fish Audio API key' -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $env:FISH_AUDIO_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  Push-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
  try {
    $voiceConfig = if (Test-Path 'tools/fish-state-audio.local.json') { 'tools/fish-state-audio.local.json' } else { 'tools/fish-state-audio.example.json' }
    node tools/fish-state-audio.mjs --config=$voiceConfig --categories=names,capitals
    if ($LASTEXITCODE -ne 0) {
      throw "The Fish Audio generator stopped with exit code $LASTEXITCODE."
    }
  }
  finally {
    Pop-Location
  }
}
finally {
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer) }
  $secureKey.Dispose()
  Write-Host 'The API key has been removed from this terminal session.' -ForegroundColor Green
}
