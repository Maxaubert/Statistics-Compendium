import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
  await page.waitForSelector('input[type="search"], input[placeholder*="øk"]', { timeout: 15000 });

  // Switch to Konsepter tab
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Konsepter"),
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Type into the now-visible concept search box
  const input = await page.$('input[type="search"]') || await page.$('input[placeholder*="øk" i]');
  if (!input) throw new Error("concept search input not found");
  await input.click();
  await input.type("standard", { delay: 30 });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUT, "search-konsepter.png"), fullPage: false });
  console.log("captured");

  const firstRow = await page.evaluate(() => {
    const li = document.querySelector("ul li");
    return li?.textContent?.trim().slice(0, 80) ?? "(no rows)";
  });
  console.log("first concept hit:", firstRow);
} finally {
  await browser.close();
}
