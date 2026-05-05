import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const PORT = process.env.PORT ?? "5181";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

async function shot(url, name, type = false) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`http://localhost:${PORT}/#${url}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));
  if (type) {
    const input = await page.$(type.selector);
    if (input) {
      await input.type(type.value, { delay: 30 });
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  await page.screenshot({ path: path.join(OUT, `nav-${name}.png`), fullPage: true });
  await page.close();
  console.log(`captured nav-${name}`);
}

try {
  await shot("/", "home-formler");
  await shot("/?tab=konsepter", "tab-konsepter");
  await shot("/?tab=tabeller", "tab-tabeller");
  await shot("/", "search-p-verdi", { selector: 'input[placeholder*="navn"]', value: "p verdi" });
  await shot("/?tab=konsepter", "search-konsepter-bootstrap", { selector: 'input[placeholder*="konsepter"]', value: "bootstrap" });
} finally {
  await browser.close();
}
