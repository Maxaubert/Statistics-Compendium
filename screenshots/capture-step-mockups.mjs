import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 2200 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/#/mockups/steps", {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll("h1")).some((h) =>
        /Steg-for-steg/i.test(h.textContent ?? ""),
      ),
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(OUT, "step-mockups-all.png"),
    fullPage: true,
  });
  console.log("captured");
} finally {
  await browser.close();
}
