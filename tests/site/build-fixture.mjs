import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../../scripts/build/build.mjs";

export const RELEASE_CONFIG = { siteName: "Atelier Test", contactUrl: "mailto:bonjour@cabinet-test.fr" };

/** Builds the site with this config into a fresh folder; returns the folder and a file reader. */
export function buildWith(config, { release }) {
  const dir = mkdtempSync(join(tmpdir(), "site-build-"));
  const configPath = join(dir, "site.config.json");
  writeFileSync(configPath, JSON.stringify(config));
  const outDir = join(dir, "dist");
  build({ outDir, release, configPath, year: 2026 });
  return { outDir, read: (path) => readFileSync(join(outDir, path), "utf8") };
}
