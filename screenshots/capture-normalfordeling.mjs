// Capture the Steg-for-steg tabs on the Normalfordeling page.
import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const URL = process.env.STAT_URL || "http://localhost:5173/";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1600 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  page.on("console", (m) => console.log(`[browser ${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => console.log(`[pageerror] ${e.message}`));
  page.setDefaultNavigationTimeout(20000);
  await page.goto("http://localhost:5173/#/entry/normalfordeling", {
    waitUntil: "networkidle0",
  });
  // Wait for the actual entry detail to render — h1 of the entry name.
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h1")).some((h) => h.textContent?.includes("Normalfordeling")),
    { timeout: 10000 },
  );
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, "steg-tabs-full.png"), fullPage: true });

  // Find the Steg-for-steg section and screenshot the surrounding card.
  const handle = await page.evaluateHandle(() => {
    const headings = Array.from(document.querySelectorAll("h2"));
    const target = headings.find((h) =>
      h.textContent?.toUpperCase().includes("STEG FOR STEG"),
    );
    if (!target) return null;
    return target.closest("section") ?? target.parentElement;
  });
  const el = handle.asElement();
  if (!el) {
    console.log("section not found — list of h2 on page:");
    const headings = await page.$$eval("h2", (hs) => hs.map((h) => h.textContent));
    console.log(headings);
    process.exit(1);
  }
  await el.scrollIntoView();
  await new Promise((r) => setTimeout(r, 200));
  await el.screenshot({ path: path.join(OUT, "steg-tabs-1.png") });
  console.log("captured tab 1 (default = P(X < x))");

  // Click P(X > x) and capture
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const t = Array.from(tabs).find((b) => b.textContent?.includes("P(X > x)"));
    if (t) t.click();
  });
  await new Promise((r) => setTimeout(r, 150));
  await el.screenshot({ path: path.join(OUT, "steg-tabs-2.png") });
  console.log("captured tab 2 (P(X > x))");

  // Click Invers and capture
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const t = Array.from(tabs).find((b) => b.textContent?.includes("Invers: finn x"));
    if (t) t.click();
  });
  await new Promise((r) => setTimeout(r, 150));
  await el.screenshot({ path: path.join(OUT, "steg-tabs-3.png") });
  console.log("captured tab 3 (Invers)");
} finally {
  await browser.close();
}
