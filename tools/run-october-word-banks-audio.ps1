$ErrorActionPreference = 'Stop'
Write-Host 'October Word Wizard recordings: 20 Circuit Sentinel words + 10 corrected Spanish words' -ForegroundColor Cyan
Write-Host 'SECURE HIDDEN PROMPT: paste the Fish Audio API key only at the prompt below.' -ForegroundColor Yellow
$secureKey = Read-Host 'Fish Audio API key' -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try {
  $env:FISH_AUDIO_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  Push-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
  try {
    node tools/fish-word-bank-audio.mjs --config=tools/fish-state-audio.example.json --input=tools/circuit-sentinel-word-bank-2026-10-08.txt --output=audio/circuit-sentinel/spelling
    if ($LASTEXITCODE -ne 0) { throw 'Circuit Sentinel recording stopped. Run this launcher again to resume.' }
    node tools/fish-word-bank-audio.mjs --config=tools/spanish-spelling-audio.example.json --input=tools/spanish-spelling-2026-10-15.txt --output=audio/circuit-sentinel/spelling/spanish-0ceefea9
    if ($LASTEXITCODE -ne 0) { throw 'Spanish recording stopped. Run this launcher again to resume.' }
    Write-Host 'Both October word banks are recorded. Tell Codex generation is complete so the audio can be checked and published.' -ForegroundColor Green
  } finally { Pop-Location }
} finally {
  Remove-Item Env:FISH_AUDIO_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer) }
  $secureKey.Dispose()
  Write-Host 'The API key has been removed from this terminal session.' -ForegroundColor Green
}
