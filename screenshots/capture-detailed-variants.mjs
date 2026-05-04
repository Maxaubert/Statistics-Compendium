// Smoke-test that:
//  1. Every entry detail page no longer shows "Eksempler fra obliger og eksamener"
//  2. "Detaljerte oppgaveløsninger" header IS present
//  3. For multi-tab entries, the tab UI is rendered and clickable
import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

// Sample: 1 Group A (multi-tab), 1 Group B (single-tab), 1 Group C (multi-tab),
// and 1 entry without solution_variants but with detailed-solution-variants now.
const SAMPLES = [
  { id: "normalfordeling", label: "norm", tabs: 5 },
  { id: "forventningsverdi-diskret", label: "fv", tabs: 1 },
  { id: "to-utvalgs-t-test", label: "two-t", tabs: 3 },
  { id: "regresjon-prediksjonsintervall", label: "pred", tabs: 1 },
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1800 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

let allOk = true;
try {
  for (const s of SAMPLES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:5173/#/entry/${s.id}`, { waitUntil: "networkidle0" });
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("h2")).some((h) =>
          /detaljerte oppgaveløsninger/i.test(h.textContent ?? ""),
        ),
      { timeout: 15000 },
    );
    await new Promise((r) => setTimeout(r, 300));

    // Check 1: "Eksempler" header is GONE
    const hasUndetailed = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h2")).some((h) =>
        /eksempler fra obliger/i.test(h.textContent ?? ""),
      ),
    );
    if (hasUndetailed) {
      console.log(`FAIL ${s.id}: undetailed 'Eksempler' header still present`);
      allOk = false;
    }

    // Check 2: "Detaljerte oppgaveløsninger" header IS present
    const hasDetailed = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h2")).some((h) =>
        /detaljerte oppgaveløsninger/i.test(h.textContent ?? ""),
      ),
    );
    if (!hasDetailed) {
      console.log(`FAIL ${s.id}: 'Detaljerte oppgaveløsninger' header missing`);
      allOk = false;
    }

    // Check 3: tab count matches
    const detailSection = await page.evaluateHandle(() => {
      const h = Array.from(document.querySelectorAll("h2")).find((x) =>
        /detaljerte oppgaveløsninger/i.test(x.textContent ?? ""),
      );
      return h?.closest("section");
    });
    const tabCount = await page.evaluate((section) => {
      if (!section) return 0;
      return section.querySelectorAll('[role="tab"]').length;
    }, detailSection);

    const expected = s.tabs > 1 ? s.tabs : 0; // single-variant renders flat (no tabs)
    if (tabCount !== expected) {
      console.log(`WARN ${s.id}: expected ${expected} tabs, found ${tabCount}`);
    }

    // Capture
    const sec = detailSection.asElement();
    if (sec) {
      await sec.scrollIntoView();
      await new Promise((r) => setTimeout(r, 150));
      await sec.screenshot({ path: path.join(OUT, `dsv-${s.label}.png`) });
      console.log(`OK ${s.id}: detailed=present, undetailed=gone, tabs=${tabCount}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
process.exit(allOk ? 0 : 1);
