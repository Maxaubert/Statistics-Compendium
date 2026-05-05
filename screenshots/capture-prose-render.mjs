import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const PORT = process.env.PORT ?? "5175";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1600 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

async function captureEntry(slug, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600 });
  await page.goto(`http://localhost:${PORT}/#/entry/${slug}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="entry-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(OUT, `prose-${name}.png`),
    fullPage: true,
  });
  await page.close();
  console.log(`captured ${name}`);
}

async function captureWithGlossaryClick(slug, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto(`http://localhost:${PORT}/#/entry/${slug}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="entry-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  // Click first glossary link inside Hva den gjør paragraph
  const clicked = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll("h2, h3, h4"));
    const heading = sections.find((h) => /Hva den gjør/i.test(h.textContent ?? ""));
    if (!heading) return { ok: false, reason: "no heading" };
    let container = heading.parentElement;
    while (container && container.querySelector("p") === null) {
      container = container.parentElement;
    }
    if (!container) return { ok: false, reason: "no container" };
    const btns = container.querySelectorAll("p button, ul button");
    if (btns.length === 0) return { ok: false, reason: "no link buttons", buttonCount: container.querySelectorAll("button").length };
    btns[0].click();
    return { ok: true, label: btns[0].textContent };
  });
  console.log(`  click result:`, JSON.stringify(clicked));
  if (!clicked.ok) {
    console.log(`no glossary link found in ${slug}`);
  } else {
    await new Promise((r) => setTimeout(r, 800));
  }
  // Inspect modal DOM
  const modalInfo = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return { hasDialog: false };
    const text = (dialog.textContent ?? "").slice(0, 200);
    const rect = dialog.getBoundingClientRect();
    return {
      hasDialog: true,
      text,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    };
  });
  console.log(`  modal info:`, JSON.stringify(modalInfo));
  await page.screenshot({
    path: path.join(OUT, `prose-${name}-popup.png`),
    fullPage: false,
  });
  await page.close();
  console.log(`captured ${name}-popup`);
}

async function captureTraps(slug, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto(`http://localhost:${PORT}/#/entry/${slug}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="entry-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 500));
  const clip = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2, h3, h4")).find(
      (h) => /Vanlige feller/i.test(h.textContent ?? ""),
    );
    if (!heading) return null;
    let block = heading.closest("section, div");
    while (block && !block.querySelector("ul, p")) block = block.parentElement;
    if (!block) return null;
    block.scrollIntoView({ block: "center" });
    return null;
  });
  if (clip === null) {
    // After scroll, take a viewport screenshot of the section.
    await new Promise((r) => setTimeout(r, 200));
    const r2 = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll("h2, h3, h4")).find(
        (h) => /Vanlige feller/i.test(h.textContent ?? ""),
      );
      if (!heading) return null;
      let block = heading.closest("section, div");
      while (block && !block.querySelector("ul, p")) block = block.parentElement;
      if (!block) return null;
      const r = block.getBoundingClientRect();
      return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 16), width: Math.min(1280, r.width + 16), height: Math.min(800, r.height + 32) };
    });
    if (r2) {
      await page.screenshot({
        path: path.join(OUT, `prose-${name}-traps.png`),
        clip: r2,
      });
      await page.close();
      console.log(`captured ${name}-traps`);
      return;
    }
  }
  await page.close();
  console.log(`no traps section for ${slug}`);
}

async function captureConcept(slug, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600 });
  await page.goto(`http://localhost:${PORT}/#/concept/${slug}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="concept-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(OUT, `prose-concept-${name}.png`),
    fullPage: true,
  });
  await page.close();
  console.log(`captured concept-${name}`);
}

async function captureSection(slug, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto(`http://localhost:${PORT}/#/entry/${slug}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="entry-detail"]') !== null,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 500));
  const clip = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2, h3, h4")).find(
      (h) => /Hva den gjør/i.test(h.textContent ?? ""),
    );
    if (!heading) return null;
    let block = heading.closest("section, div");
    while (block && !block.querySelector("p")) block = block.parentElement;
    if (!block) return null;
    // Walk up so we capture the whole section card (parent flex containing trap also).
    const r = block.getBoundingClientRect();
    return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 16), width: Math.min(1280, r.width + 16), height: Math.min(800, r.height + 32) };
  });
  if (!clip) {
    console.log(`no clip for ${slug}`);
    await page.close();
    return;
  }
  await page.screenshot({
    path: path.join(OUT, `prose-${name}-zoom.png`),
    clip,
  });
  await page.close();
  console.log(`captured ${name}-zoom`);
}

try {
  await captureEntry("varians-standardavvik-diskret", "varians");
  await captureEntry("normalfordeling", "normalfordeling");
  await captureEntry("en-utvalg-t-test", "ttest");
  await captureWithGlossaryClick("en-utvalg-t-test", "ttest");
  await captureSection("en-utvalg-t-test", "ttest");
  await captureSection("varians-standardavvik-diskret", "varians");
  await captureTraps("varians-standardavvik-diskret", "varians");
  await captureTraps("normalfordeling", "normalfordeling");
  await captureSection("bayes-setning", "bayes");
  await captureConcept("bootstrapping", "bootstrap");
  await captureConcept("varians", "varians-konsept");
  await captureSection("kjikvadrat-uavhengighet", "kji");
  await captureSection("en-utvalg-z-test-andel", "ztest-andel");
} finally {
  await browser.close();
}
