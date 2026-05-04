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
  await page.goto("http://localhost:5173/#/entry/normalfordeling", { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("h2")).some((h) => /eksempler/i.test(h.textContent ?? "")),
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 400));

  const sectionHandle = await page.evaluateHandle(() => {
    const h = Array.from(document.querySelectorAll("h2")).find((x) => /eksempler/i.test(x.textContent ?? ""));
    return h?.closest("section");
  });
  const el = sectionHandle.asElement();
  if (!el) throw new Error("examples section not found");

  // Tab 0: P(X < x) — default
  await el.scrollIntoView();
  await new Promise((r) => setTimeout(r, 150));
  await el.screenshot({ path: path.join(OUT, "examples-tab-0.png") });
  console.log("captured P(X < x)");

  // Switch tabs and capture each
  const labels = ["P(X > x)", "P(a < X < b)", "Invers: finn x", "Invers: finn μ"];
  for (let i = 0; i < labels.length; i++) {
    await page.evaluate((needle) => {
      const tabs = Array.from(document.querySelectorAll('[aria-label="Eksempel-varianter"] [role="tab"]'));
      const target = tabs.find((b) => b.textContent?.includes(needle));
      if (target) target.click();
    }, labels[i]);
    await new Promise((r) => setTimeout(r, 200));
    await el.screenshot({ path: path.join(OUT, `examples-tab-${i + 1}.png`) });
    console.log(`captured ${labels[i]}`);
  }
} finally {
  await browser.close();
}
