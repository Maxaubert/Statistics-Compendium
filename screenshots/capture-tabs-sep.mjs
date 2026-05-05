import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 800 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/#/mockups/tabs/separated", {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelectorAll("section").length >= 6,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 700));

  const sections = await page.$$("section");
  const labels = ["T0", "T1", "T2", "T3", "T4", "T5"];
  for (let i = 0; i < sections.length; i++) {
    const file = `tabs-sep-${labels[i]}.png`;
    await sections[i].screenshot({ path: path.join(OUT, file) });
    console.log("captured", file);
  }
} finally {
  await browser.close();
}
