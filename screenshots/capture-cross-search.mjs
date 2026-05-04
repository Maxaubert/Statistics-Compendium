import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1400 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

async function searchAndCapture(page, tabLabel, query, outName) {
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
  await page.waitForSelector('input[type="search"], input[placeholder*="øk"]', { timeout: 15000 });

  if (tabLabel) {
    await page.evaluate((t) => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent?.includes(t),
      );
      if (btn) btn.click();
    }, tabLabel);
    await new Promise((r) => setTimeout(r, 300));
  }

  const input = await page.$('input[type="search"]') || await page.$('input[placeholder*="øk" i]');
  if (!input) throw new Error("search input not found");
  await input.click();
  await input.type(query, { delay: 30 });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUT, outName), fullPage: true });
  console.log(`captured ${outName}`);
}

try {
  const page = await browser.newPage();
  await searchAndCapture(page, null, "normal", "cross-formler-normal.png");
  await searchAndCapture(page, "Konsepter", "normal", "cross-konsepter-normal.png");
} finally {
  await browser.close();
}
