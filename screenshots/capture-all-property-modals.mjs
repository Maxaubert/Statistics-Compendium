import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const ENTRIES = [
  ["normalfordeling", "Forventningsverdi"],
  ["eksponential-fordeling", "Forventningsverdi"],
  ["poisson-fordeling", "Forventningsverdi"],
  ["hypergeometrisk-fordeling", "Forventningsverdi"],
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1100 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  for (const [id, prop] of ENTRIES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:5173/#/entry/${id}`, {
      waitUntil: "networkidle0",
    });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="entry-detail"]') !== null,
      { timeout: 15000 },
    );
    await new Promise((r) => setTimeout(r, 500));

    await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll("h2, h3")).find((el) =>
        /Egenskaper/i.test(el.textContent ?? ""),
      );
      if (h) h.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));

    await page.evaluate((propLabel) => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        new RegExp(`Vis utledning for ${propLabel}`, "i").test(
          b.getAttribute("aria-label") ?? "",
        ),
      );
      if (btn) btn.click();
    }, prop);
    await new Promise((r) => setTimeout(r, 500));

    const file = `property-modal-${id}.png`;
    await page.screenshot({
      path: path.join(OUT, file),
      fullPage: false,
    });
    console.log("captured", file);
    await page.close();
  }
} finally {
  await browser.close();
}
