// Drive the wizard to the "Konfidensintervall for μ (ukjent σ)" recommendation
// and capture it at the same 1440x900 viewport as the other screenshots.
import puppeteer from "puppeteer-core";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const URL = "http://localhost:5173/#/veiviser";
const OUT =
  String.raw`C:\Users\Admin\Documents\Claude\Github\Statistics-Compendium\screenshots\09-veiviser-anbefaling.png`;

const PATH_LABELS = [
  "Hypotesetest eller konfidensintervall",
  "Test eller KI for gjennomsnitt",
  "Konfidensintervall for μ – σ ukjent",
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0" });

  for (const needle of PATH_LABELS) {
    await page.waitForSelector("button");
    const clicked = await page.evaluate((needle) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const target = buttons.find((b) =>
        (b.textContent || "").toLowerCase().includes(needle.toLowerCase()),
      );
      if (target) {
        target.click();
        return target.textContent;
      }
      return null;
    }, needle);
    if (!clicked) {
      const visible = await page.evaluate(() =>
        Array.from(document.querySelectorAll("button")).map((b) => b.textContent?.trim()),
      );
      throw new Error(
        `No button matched "${needle}". Visible buttons:\n${visible.join("\n")}`,
      );
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  // Wait for the "Anbefalt:" recommendation header to render
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("div")).some((d) => d.textContent?.trim() === "Anbefalt:"),
    { timeout: 5000 },
  );
  await new Promise((r) => setTimeout(r, 250));

  await page.screenshot({ path: OUT, fullPage: false });
  console.log(`captured ${OUT}`);
} finally {
  await browser.close();
}
