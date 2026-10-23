$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
$packageRoot = Split-Path -Parent $PSScriptRoot
$deliveryRoot = Join-Path $packageRoot 'entrega'
[IO.Directory]::CreateDirectory($deliveryRoot) | Out-Null
function Write-DeliveryArchive($destination, $entries) {
  $archiveStream = [IO.File]::Open($destination, [IO.FileMode]::Create)
  $archive = [IO.Compression.ZipArchive]::new($archiveStream, [IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($entry in $entries) {
      $zipEntry = $archive.CreateEntry($entry.Name, [IO.Compression.CompressionLevel]::Optimal)
      $inputStream = [IO.File]::OpenRead($entry.Path)
      $outputStream = $zipEntry.Open()
      try { $inputStream.CopyTo($outputStream) } finally { $inputStream.Dispose(); $outputStream.Dispose() }
    }
  } finally { $archive.Dispose(); $archiveStream.Dispose() }
}
$staticRoot = Join-Path $packageRoot 'dist'
if (-not (Test-Path -LiteralPath (Join-Path $staticRoot 'index.html'))) { throw 'Execute npm run build antes de empacotar.' }
$staticEntries = Get-ChildItem -LiteralPath $staticRoot -File -Recurse | ForEach-Object {
  @{ Path = $_.FullName; Name = [IO.Path]::GetRelativePath($staticRoot, $_.FullName).Replace('\','/') }
}
Write-DeliveryArchive (Join-Path $deliveryRoot 'apresentacao-estatica.zip') $staticEntries
$activityPaths = @('server.mjs','package.json','README.md','.env.example','Dockerfile','compose.yaml','public/index.html','public/style.css','public/app.js','public/image-loading.svg','public/font.woff2','public/OFL.txt','tests/api.test.mjs')
$activityEntries = foreach ($item in $activityPaths) { @{ Path = Join-Path $packageRoot "atividade/$item"; Name = "atividade/$item" } }
$activityEntries += @(@{Path=Join-Path $packageRoot '.dockerignore';Name='.dockerignore'},@{Path=Join-Path $packageRoot 'ASSETS.md';Name='ASSETS.md'})
Write-DeliveryArchive (Join-Path $deliveryRoot 'atividade-servidor.zip') $activityEntries
foreach ($name in @('apresentacao-estatica.zip','atividade-servidor.zip')) {
  $readArchive = [IO.Compression.ZipFile]::OpenRead((Join-Path $deliveryRoot $name))
  try {
    if ($readArchive.Entries.FullName | Where-Object { $_ -match '(^|/)(\.env|data)(/|$)|\.sqlite$' }) { throw 'Arquivo privado encontrado no pacote.' }
    Write-Output "$name : $($readArchive.Entries.Count) arquivos; sem credenciais ou banco de dados."
  } finally { $readArchive.Dispose() }
}
