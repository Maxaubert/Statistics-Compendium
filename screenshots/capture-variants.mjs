import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const ENTRIES = [
  { id: "normalfordeling", tabIndex: 3, label: "norm-invers" },     // tab "Invers: finn x" — has conditional step
  { id: "poisson-fordeling", tabIndex: 0, label: "poi-eq-k" },     // P(X = k)
  { id: "binomial-fordeling", tabIndex: 1, label: "bin-leq-k" },   // P(X ≤ k)
  { id: "eksponential-fordeling", tabIndex: 3, label: "exp-mem" }, // memoryless
  { id: "komplementregelen", tabIndex: 0, label: "kom-minst" },    // Minst k
  { id: "bayes-setning", tabIndex: 1, label: "bay-diag" },         // Diagnose
  { id: "en-utvalg-z-test", tabIndex: 2, label: "ztest-twosided" },// Tosidig
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1800 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  for (const entry of ENTRIES) {
    const page = await browser.newPage();
    page.on("pageerror", (e) => console.log(`[pageerror ${entry.id}] ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") console.log(`[console.error ${entry.id}] ${m.text()}`);
    });
    await page.goto(`http://localhost:5173/#/entry/${entry.id}`, { waitUntil: "networkidle0" });
    try {
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll("h2")).some((h) => /steg for steg/i.test(h.textContent ?? "")),
        { timeout: 25000 },
      );
    } catch (e) {
      const headings = await page.$$eval("h1, h2", (els) => els.map((h) => h.textContent));
      console.log(`[${entry.id}] timeout waiting for Steg for steg. Headings on page:`, headings);
      await page.close();
      continue;
    }
    if (entry.tabIndex > 0) {
      await page.evaluate((idx) => {
        const tabs = document.querySelectorAll('[role="tab"]');
        if (tabs[idx]) tabs[idx].click();
      }, entry.tabIndex);
      await new Promise((r) => setTimeout(r, 200));
    }
    const sectionHandle = await page.evaluateHandle(() => {
      const h = Array.from(document.querySelectorAll("h2")).find((x) => /steg for steg/i.test(x.textContent ?? ""));
      return h?.closest("section");
    });
    const el = sectionHandle.asElement();
    if (!el) {
      console.log(`section not found for ${entry.id}`);
      await page.close();
      continue;
    }
    await el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 150));
    await el.screenshot({ path: path.join(OUT, `var-${entry.label}.png`) });
    console.log(`captured ${entry.id} tab ${entry.tabIndex}`);
    await page.close();
  }
} finally {
  await browser.close();
}
