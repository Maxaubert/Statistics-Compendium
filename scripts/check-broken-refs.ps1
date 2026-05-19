$entryIds = Get-ChildItem content/entries/*.yaml | ForEach-Object { $_.BaseName }
$glosIds = Get-ChildItem content/glossary/*.yaml | ForEach-Object { $_.BaseName }
$tableIds = Get-ChildItem content/tables/*.yaml | ForEach-Object { $_.BaseName }

$allFiles = @()
$allFiles += Get-ChildItem content/entries/*.yaml
$allFiles += Get-ChildItem content/glossary/*.yaml
$allFiles += Get-ChildItem content/tables/*.yaml

$brokenRefs = @()
$totalRefs = 0

foreach ($f in $allFiles) {
  $content = Get-Content $f.FullName -Raw -Encoding UTF8
  $regex = [regex]'id:\s*"?([\w-]+)"?\s*,\s*kind:\s*"?(\w+)"?'
  foreach ($m in $regex.Matches($content)) {
    $totalRefs++
    $id = $m.Groups[1].Value
    $kind = $m.Groups[2].Value
    $found = $false
    switch ($kind) {
      "entry"    { $found = $entryIds -contains $id }
      "glossary" { $found = $glosIds -contains $id }
      "table"    { $found = $tableIds -contains $id }
      default    { $found = $false }
    }
    if (-not $found) {
      $msg = $f.Name + " -> " + $kind + ":" + $id + " NOT FOUND"
      $brokenRefs += $msg
    }
  }
}

Write-Host ("Total references checked: " + $totalRefs)
Write-Host ("Broken refs: " + $brokenRefs.Count)
if ($brokenRefs.Count -gt 0) {
  Write-Host "---"
  $brokenRefs | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
}
