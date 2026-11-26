import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { copyAssets } from "./copy-assets.mjs";
import { loadConfig } from "./load-config.mjs";
import { renderTemplate } from "./render-template.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

function readPartials() {
  const dir = join(ROOT, "src", "partials");
  return Object.fromEntries(
    readdirSync(dir)
      .filter((name) => name.endsWith(".html"))
      .map((name) => [basename(name, ".html"), readFileSync(join(dir, name), "utf8").trimEnd()]),
  );
}

/**
 * Builds the site into outDir, which it empties first.
 * @param {{ outDir: string, release: boolean, configPath?: string, year?: number }} options
 */
export function build({ outDir, release, configPath = join(ROOT, "site.config.json"), year = new Date().getFullYear() }) {
  const config = loadConfig(configPath, { release });
  const template = readFileSync(join(ROOT, "src", "page.html"), "utf8");
  const context = { site: { name: config.siteName, contactUrl: config.contactUrl, year } };
  const partials = readPartials();
  // Without a contact yet, the call to action reads "bientôt" instead of leading nowhere.
  partials["contact-action"] = partials[config.contactUrl ? "contact-link" : "contact-soon"];
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), renderTemplate(template, context, partials));
  copyAssets(outDir);
}

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} expects a path`);
  return value;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const release = process.argv.includes("--release");
    const outDir = resolve(option("--out", join(ROOT, "dist")));
    const configPath = option("--config", join(ROOT, "site.config.json"));
    // build() empties outDir first: never let it be the repository or the current folder.
    if ([resolve(ROOT), process.cwd()].includes(outDir)) throw new Error(`--out cannot be ${outDir}`);
    build({ outDir, release, configPath });
    console.log(`Site built in ${outDir}${release ? " (release)" : " (local preview)"}.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
