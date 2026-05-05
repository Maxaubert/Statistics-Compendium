import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1100 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/#/entry/binomial-fordeling", {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="entry-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 600));

  // Scroll to Egenskaper
  await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h2, h3")).find((el) =>
      /Egenskaper/i.test(el.textContent ?? ""),
    );
    if (h) h.scrollIntoView({ block: "start" });
  });
  await new Promise((r) => setTimeout(r, 250));

  await page.screenshot({
    path: path.join(OUT, "binomial-egenskaper-cards.png"),
    fullPage: false,
  });

  // Click first egenskap card (Forventningsverdi)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /Vis utledning for Forventningsverdi/i.test(b.getAttribute("aria-label") ?? ""),
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 350));

  await page.screenshot({
    path: path.join(OUT, "binomial-property-modal-expectation.png"),
    fullPage: false,
  });
  console.log("captured cards + modal");
} finally {
  await browser.close();
}
