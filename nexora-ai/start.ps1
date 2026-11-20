$keyDirectory = Join-Path $env:LOCALAPPDATA "NexoraAI"
$keyPath = Join-Path $keyDirectory "gemini-key.dpapi"

if (Test-Path -LiteralPath $keyPath) {
  try {
    $encryptedKey = Get-Content -LiteralPath $keyPath -Raw
    $secureKey = ConvertTo-SecureString $encryptedKey
  }
  catch {
    throw "The saved key could not be decrypted for this Windows account. Remove '$keyPath' and run this script again."
  }
}
else {
  $secureKey = Read-Host "Enter your Gemini API key (input is hidden)" -AsSecureString
  if ($secureKey.Length -eq 0) {
    throw "A Gemini API key is required to start Nexora AI."
  }

  try {
    New-Item -ItemType Directory -Path $keyDirectory -Force | Out-Null
    ConvertFrom-SecureString -SecureString $secureKey |
      Set-Content -LiteralPath $keyPath -NoNewline -Encoding ascii
  }
  catch {
    $secureKey.Dispose()
    throw "Could not save the key encrypted under your Windows account."
  }
}

$keyPointer = [IntPtr]::Zero
$backendExitCode = 1
Push-Location $PSScriptRoot
try {
  $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $env:GEMINI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  npm.cmd start
  $backendExitCode = $LASTEXITCODE
}
finally {
  Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
  $secureKey.Dispose()
  Pop-Location
}

exit $backendExitCode
