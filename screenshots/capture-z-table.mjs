// Capture the Z-tabell (E.3) lookup widget in both modes.
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

try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log(`[pageerror] ${e.message}`));
  page.setDefaultNavigationTimeout(20000);
  const target = process.env.STAT_TABLE || "E3-z-tabell";
  const outPrefix = process.env.STAT_PREFIX || "z-table";
  await page.goto(`http://localhost:5173/#/table/${target}`, { waitUntil: "networkidle0" });

  // The lookup widget is a card with role-tablist for the toggle.
  await page.waitForSelector('[role="tablist"][aria-label="Lookup-retning"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));

  // Find the lookup card — its container is the closest div with the widget classes.
  const cardHandle = await page.evaluateHandle(() => {
    const tablist = document.querySelector('[role="tablist"][aria-label="Lookup-retning"]');
    return tablist?.closest("div.relative.overflow-hidden.rounded-xl");
  });
  const card = cardHandle.asElement();
  if (!card) {
    console.log("widget not found");
    process.exit(1);
  }

  await card.scrollIntoView();
  await new Promise((r) => setTimeout(r, 200));
  await card.screenshot({ path: path.join(OUT, `${outPrefix}-forward.png`) });
  console.log("captured forward mode");

  // Switch to the inverse tab (whichever it is — match by index inside the toggle group).
  await page.evaluate(() => {
    const tabs = document
      .querySelector('[role="tablist"][aria-label="Lookup-retning"]')
      ?.querySelectorAll('[role="tab"]');
    if (tabs && tabs.length >= 2) tabs[1].click();
  });
  await new Promise((r) => setTimeout(r, 250));
  await card.screenshot({ path: path.join(OUT, `${outPrefix}-inverse.png`) });
  console.log("captured inverse mode");
} finally {
  await browser.close();
}
