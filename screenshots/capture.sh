#!/usr/bin/env bash
# Capture screenshots of the running dev server using headless Edge.
set -euo pipefail

EDGE='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
BASE='http://localhost:5173/#'
OUT='C:\Users\Admin\Documents\Claude\Github\Statistics-Compendium\screenshots'

shoot() {
  local name="$1" path="$2" w="${3:-1440}" h="${4:-900}"
  "$EDGE" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --no-sandbox \
    --window-size="${w},${h}" \
    --virtual-time-budget=8000 \
    --screenshot="${OUT}\\${name}.png" \
    "${BASE}${path}" 2>/dev/null
  echo "captured ${name}.png"
}

shoot 01-list ""
shoot 02-entry-normalfordeling "/entry/normalfordeling"
shoot 03-entry-t-test "/entry/en-utvalg-t-test"
shoot 04-concept-p-verdi "/concept/p-verdi"
shoot 05-table-z "/table/E3-z-tabell"
shoot 06-symboler "/symboler"
shoot 07-ordliste "/ordliste"
shoot 08-veiviser "/veiviser"
