import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const PORT = process.env.PORT ?? "5182";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1600 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  for (const id of ["varians", "standardavvik"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1600 });
    await page.goto(`http://localhost:${PORT}/#/concept/${id}`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT, `concept-${id}.png`), fullPage: true });
    await page.close();
    console.log(`captured concept-${id}`);
  }
} finally {
  await browser.close();
}
