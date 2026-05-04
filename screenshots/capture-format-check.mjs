import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1800 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/#/entry/bayes-setning", { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h2")).some((h) => /detaljerte/i.test(h.textContent ?? "")),
    { timeout: 15000 },
  );
  // Click the Multi-hypotese tab
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('[aria-label="Oppgaveløsnings-varianter"] [role="tab"]');
    const t = Array.from(tabs).find((b) => b.textContent?.includes("Multi-hypotese"));
    if (t) t.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Screenshot the section
  const section = await page.evaluateHandle(() => {
    const h = Array.from(document.querySelectorAll("h2")).find((x) => /detaljerte/i.test(x.textContent ?? ""));
    return h?.closest("section");
  });
  const el = section.asElement();
  if (el) {
    await el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 150));
    await el.screenshot({ path: path.join(OUT, "fmt-bayes-multi.png") });
    console.log("captured");
  }
} finally {
  await browser.close();
}
