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
  await page.goto("http://localhost:5173/#/ordliste", {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h1")).some((h) => /Ordliste/i.test(h.textContent ?? "")),
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 600));

  // Click the P-verdi card
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /Vis definisjon av P-verdi/i.test(b.getAttribute("aria-label") ?? ""),
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(OUT, "glossary-modal-pverdi.png"),
    fullPage: false,
  });
  console.log("captured");
} finally {
  await browser.close();
}
