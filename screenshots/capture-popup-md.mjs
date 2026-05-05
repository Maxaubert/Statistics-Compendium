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

async function capturePopup(needle, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.goto(`http://localhost:${PORT}/#/ordliste`, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h1")).some((h) => /Ordliste/i.test(h.textContent ?? "")),
    { timeout: 15000 },
  );
  // Filter the grid down to the single card, then click it.
  await page.type('input[type="search"]', needle, { delay: 30 });
  await new Promise((r) => setTimeout(r, 400));
  const ok = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button[aria-label^="Vis definisjon"]'));
    if (cards.length === 0) return false;
    cards[0].scrollIntoView({ block: "center" });
    cards[0].click();
    return true;
  });
  if (!ok) {
    console.log(`  no card found for "${needle}"`);
    await page.close();
    return;
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(OUT, `popup-${name}.png`),
    fullPage: false,
  });
  await page.close();
  console.log(`captured popup-${name}`);
}

try {
  await capturePopup("frihetsgrader", "frihetsgrader");
  await capturePopup("forventningsverdi", "forventningsverdi");
  await capturePopup("observatortest", "testobservator");
  await capturePopup("forkastningsomrade", "forkastningsomr");
  await capturePopup("standardavvik", "standardavvik");
  await capturePopup("total sannsynlighet", "total-sannsynlighet");
  await capturePopup("konfidensintervall", "konfidensintervall");
} finally {
  await browser.close();
}
