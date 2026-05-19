$aliasMap = @{
  'kvantil' = @('kvantilen', 'kvantiler', 'kvantilene')
  'boksplott' = @('boksplottet', 'boksplott', 'boksplottene')
  'estimator' = @('estimatoren', 'estimatorer', 'estimatorene')
  'forkastningsomrade' = @('forkastningsområdet', 'forkastningsområder', 'forkastningsområdene', 'forkastningsomrade')
  'gjennomsnitt' = @('gjennomsnittet', 'gjennomsnitt', 'gjennomsnittene')
  'hendelse' = @('hendelsen', 'hendelser', 'hendelsene')
  'histogram-glos' = @('histogrammet', 'histogrammer', 'histogrammene', 'histogram')
  'komplement' = @('komplementet', 'komplementer', 'komplementene')
  'korrelasjon-glos' = @('korrelasjonen', 'korrelasjoner', 'korrelasjonene', 'korrelasjon')
  'marginalfordeling-term' = @('marginalfordelingen', 'marginalfordelinger', 'marginalfordelingene', 'marginalfordeling')
  'observatortest' = @('testobservatoren', 'testobservatorene', 'testobservator', 'testobservatorer')
  'p-verdi-glos' = @('p-verdien', 'p-verdier', 'p-verdiene', 'p-verdi')
  'populasjon' = @('populasjonen', 'populasjoner', 'populasjonene')
  'prediksjonsintervall-glos' = @('prediksjonsintervallet', 'prediksjonsintervaller', 'prediksjonsintervallene', 'prediksjonsintervall')
  'residual' = @('residualen', 'residualer', 'residualene')
  'signifikansniva-glos' = @('signifikansnivået', 'signifikansnivåer', 'signifikansnivåene', 'signifikansnivå')
  'standardavvik' = @('standardavviket', 'standardavvik', 'standardavvikene')
  'type-1-feil' = @('type-I-feilen', 'type-I-feil', 'type-I-feilene', 'type I-feil', 'type 1-feil')
  'type-2-feil' = @('type-II-feilen', 'type-II-feil', 'type-II-feilene', 'type II-feil', 'type 2-feil')
  'utvalg' = @('utvalget', 'utvalg', 'utvalgene')
  'varians' = @('variansen', 'varianser', 'variansene')
}

foreach ($key in $aliasMap.Keys) {
  $path = 'content/glossary/' + $key + '.yaml'
  if (-not (Test-Path $path)) { Write-Host "SKIP missing: $path"; continue }
  $content = Get-Content $path -Raw -Encoding UTF8
  if ($content -match '(?m)^aliases:') { Write-Host "SKIP already has aliases: $key"; continue }

  $aliasYaml = "aliases:`n"
  foreach ($a in $aliasMap[$key]) { $aliasYaml += "  - $a`n" }

  # Insert aliases block before 'filters:' line
  $newContent = $content -replace '(?m)^filters:', ($aliasYaml + 'filters:')
  if ($newContent -eq $content) { Write-Host "FAILED to insert in: $key"; continue }

  # Write back as UTF-8 without BOM (cross-platform safe)
  [System.IO.File]::WriteAllText((Resolve-Path $path), $newContent, [System.Text.UTF8Encoding]::new($false))
  Write-Host "OK: $key"
}
