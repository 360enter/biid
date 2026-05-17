import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const required = [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
  "functions/api/projects/index.js",
  "functions/api/projects/[id].js",
  "functions/api/purchases/index.js",
  "functions/api/bids/index.js",
  "schema.sql",
  "seed.sql",
  "docs/ARCHITECTURE.md",
  "docs/BRAND_SYSTEM.md"
];

const missing = [];
for (const file of required) {
  try {
    await fs.access(path.join(root, file));
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

const html = await fs.readFile(path.join(root, "public/index.html"), "utf8");
const css = await fs.readFile(path.join(root, "public/styles.css"), "utf8");
const js = await fs.readFile(path.join(root, "public/app.js"), "utf8");

const checks = [
  ["landing hero", html.includes("Apex Strategic Holdings")],
  ["project directory", html.includes("Project Directory")],
  ["bid wizard", html.includes("Contractor Bid Submission")],
  ["admin shell", html.includes("Admin Management Structure")],
  ["responsive CSS", css.includes("@media")],
  ["project loader", js.includes("loadProjects")],
  ["purchase handler", js.includes("handlePurchase")],
  ["bid handler", js.includes("submitBid")]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error(`Validation checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Apex procurement platform validation passed.");
