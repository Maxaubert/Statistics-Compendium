import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const PORT = process.env.PORT ?? "5178";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1000 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

async function capturePopup(termId, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.goto(`http://localhost:${PORT}/#/ordliste`, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h1")).some((h) => /Ordliste/i.test(h.textContent ?? "")),
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate((id) => {
    const cards = Array.from(document.querySelectorAll("button"));
    // The cards have aria-label "Vis definisjon av <term_no>" — we don't know term_no
    // exactly here, so just find any button whose surrounding card matches by data.
    // Easier: open via Glossary's openId by clicking the card with aria-label including the term.
    // Fallback: iterate all and pick by id-like substring.
    for (const c of cards) {
      const label = c.getAttribute("aria-label") ?? "";
      const text = (c.textContent ?? "").toLowerCase();
      if (label.toLowerCase().includes(id) || text.includes(id)) {
        c.click();
        return;
      }
    }
  }, name);
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(OUT, `popup-${termId}.png`),
    fullPage: false,
  });
  await page.close();
  console.log(`captured popup-${termId}`);
}

try {
  await capturePopup("frihetsgrader", "frihetsgrader");
  await capturePopup("forventningsverdi", "forventningsverdi");
  await capturePopup("observatortest", "testobservator");
  await capturePopup("forkastningsomrade", "forkastningsomr");
  await capturePopup("standardavvik", "standardavvik");
} finally {
  await browser.close();
}
