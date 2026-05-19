#
# Add glossary backlinks to entries that were missing them.
# Each item: target file (entries or glossary), list of { id, kind } to add.
#
# Uses regex insertion BEFORE the closing of the related: array. We anchor
# on the first 'tools:' or end-of-related block.
#

$backlinks = @(
  @{ file = 'content/entries/lineaer-regresjon.yaml';
     items = @(
       @{ id='bias'; kind='glossary' },
       @{ id='forutsetninger-regresjon'; kind='glossary' },
       @{ id='minste-kvadraters-metode'; kind='glossary' },
       @{ id='ekstrapolering'; kind='glossary' },
       @{ id='standardfeil-til-stigningstallet'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/multippel-regresjon.yaml';
     items = @(
       @{ id='bias'; kind='glossary' },
       @{ id='forutsetninger-regresjon'; kind='glossary' },
       @{ id='minste-kvadraters-metode'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/en-utvalg-z-test.yaml';
     items = @(
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='alternativhypotese'; kind='glossary' },
       @{ id='forkastningsomrade'; kind='glossary' },
       @{ id='observatortest'; kind='glossary' },
       @{ id='variansen-til-utvalgsgjennomsnittet'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/en-utvalg-t-test.yaml';
     items = @(
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='alternativhypotese'; kind='glossary' },
       @{ id='forkastningsomrade'; kind='glossary' },
       @{ id='observatortest'; kind='glossary' },
       @{ id='variansen-til-utvalgsgjennomsnittet'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/en-utvalg-z-test-andel.yaml';
     items = @(
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='forkastningsomrade'; kind='glossary' },
       @{ id='observatortest'; kind='glossary' },
       @{ id='standardfeil-til-andel'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/paret-t-test.yaml';
     items = @(
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='forkastningsomrade'; kind='glossary' },
       @{ id='observatortest'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/mann-whitney-wilcoxon.yaml';
     items = @(
       @{ id='u-observator'; kind='glossary' },
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='ikke-parametrisk'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/kjikvadrat-goodness-of-fit.yaml';
     items = @(
       @{ id='goodness-of-fit'; kind='glossary' },
       @{ id='nullhypotese'; kind='glossary' },
       @{ id='kategorisk-variabel'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/kjikvadrat-uavhengighet.yaml';
     items = @(
       @{ id='kategorisk-variabel'; kind='glossary' },
       @{ id='nullhypotese'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/enveis-anova.yaml';
     items = @(
       @{ id='nullhypotese'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/bootstrapping.yaml';
     items = @(
       @{ id='prosentilintervall'; kind='glossary' },
       @{ id='konfidensintervall'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/diskret-stokastisk-variabel.yaml';
     items = @(
       @{ id='diskret-varians'; kind='glossary' },
       @{ id='joint'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/poisson-fordeling.yaml';
     items = @(
       @{ id='poissonvarians'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/hypergeometrisk-fordeling.yaml';
     items = @(
       @{ id='hypergeometrisk-varians'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/geometrisk-fordeling.yaml';
     items = @(
       @{ id='geometrisk-fordeling-glos'; kind='glossary' }
     )
   },
  @{ file = 'content/entries/marginalfordeling.yaml';
     items = @(
       @{ id='joint'; kind='glossary' },
       @{ id='marginalfordeling-term'; kind='glossary' }
     )
   }
)

foreach ($entry in $backlinks) {
  $path = $entry.file
  if (-not (Test-Path $path)) { Write-Host "SKIP missing: $path"; continue }
  $content = Get-Content $path -Raw -Encoding UTF8

  # Find the related: block. We need to extract the block to know what's there.
  if ($content -notmatch '(?ms)^related:\s*\n((?:\s*-\s*\{[^\n]*\}\s*\n)+)') {
    Write-Host "SKIP no related block in: $path"
    continue
  }
  $relatedBlock = $matches[1]

  # Build lines to add, only those not already in block
  $linesToAdd = @()
  foreach ($item in $entry.items) {
    $id = $item.id
    $kind = $item.kind
    # Look for { id: "id" or { id: id matching
    if ($relatedBlock -match "id:\s*`"?$([regex]::Escape($id))`"?\s*,") {
      continue
    }
    $linesToAdd += "  - { id: `"$id`", kind: `"$kind`" }"
  }

  if ($linesToAdd.Count -eq 0) {
    Write-Host "SKIP all items already present in: $path"
    continue
  }

  # Append before the LAST occurrence of related-line then blank/next-key
  # Strategy: find the last `  - { ... }` in the related block, append after it
  $newRelated = $relatedBlock.TrimEnd() + "`n" + ($linesToAdd -join "`n") + "`n"
  $newContent = $content -replace [regex]::Escape($relatedBlock), $newRelated

  if ($newContent -eq $content) {
    Write-Host "FAILED to modify: $path"
    continue
  }

  [System.IO.File]::WriteAllText((Resolve-Path $path), $newContent, [System.Text.UTF8Encoding]::new($false))
  Write-Host "OK [$($linesToAdd.Count) added]: $path"
}
